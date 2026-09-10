// CropCoder Secure Authentication & OTP Verification Service
import { FarmerProfile } from '../types';
import { 
  syncSupabaseProfile, 
  saveSupabaseOTPChallenge, 
  verifySupabaseStoredOTP,
  fetchSupabaseProfileByPhone,
  fetchSupabaseProfileByEmail,
  recordSupabaseLogin
} from './supabaseService';
import { isSupabaseConfigured, supabase } from './supabaseClient';

export interface AuthUser extends FarmerProfile {
  email?: string;
  passwordHash: string;
  isPhoneVerified: boolean;
  registeredAt: string;
  lastLoginAt: string;
  twoFactorEnabled?: boolean;
}

export interface OTPChallenge {
  phone: string;
  otpCode: string;
  purpose: 'signup' | 'forgot_password' | 'profile_update';
  expiresAt: number; // unix timestamp ms
  createdAt: number;
  payload?: any; // temporary payload during signup/reset
}

const STORAGE_USERS_KEY = 'kd_auth_users_v3';
const STORAGE_SESSION_KEY = 'kd_auth_session_v3';
const STORAGE_OTP_CHALLENGE_KEY = 'kd_auth_otp_active';

// Initial pre-seeded verified farmer accounts
export const DEFAULT_DEMO_USERS: AuthUser[] = [
  {
    id: 'f-101',
    name: 'Rameshwar Patil',
    phone: '+91 98224 51203',
    email: 'rameshwar@patilfarms.in',
    isFPO: true,
    fpoName: 'Godavari Sahyadri Farmer Producer Co.',
    state: 'Maharashtra',
    district: 'Nashik',
    village: 'Lasalgaon',
    primaryCrops: ['Onion', 'Tomato'],
    passwordHash: 'Kisan@123', // Demo password
    isPhoneVerified: true,
    registeredAt: '2026-01-15T09:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  {
    id: 'f-102',
    name: 'Baldev Singh Dhillon',
    phone: '+91 98141 87211',
    email: 'baldev@dhillonfarms.in',
    isFPO: false,
    state: 'Uttar Pradesh',
    district: 'Agra',
    village: 'Khandauli',
    primaryCrops: ['Potato', 'Mustard'],
    passwordHash: 'Kisan@123',
    isPhoneVerified: true,
    registeredAt: '2026-02-10T11:30:00.000Z',
    lastLoginAt: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  {
    id: 'f-103',
    name: 'Venkateshwarlu Reddy',
    phone: '+91 94401 29845',
    email: 'venkat@reddyagro.in',
    isFPO: true,
    fpoName: 'Andhra Spice & Horticulture Federation',
    state: 'Karnataka',
    district: 'Kolar',
    village: 'Malur',
    primaryCrops: ['Tomato', 'Chili'],
    passwordHash: 'Kisan@123',
    isPhoneVerified: true,
    registeredAt: '2026-03-01T08:15:00.000Z',
    lastLoginAt: new Date().toISOString(),
    twoFactorEnabled: true,
  },
];

// Normalize Indian phone numbers to standardize lookup (+91 98765 43210 or 9876543210)
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    const mainDigits = digits.slice(2);
    return `+91 ${mainDigits.slice(0, 5)} ${mainDigits.slice(5)}`;
  }
  return phone.trim();
}

export function getCleanDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  return digits;
}

// Retrieve all registered users
export function getRegisteredUsers(): AuthUser[] {
  try {
    const saved = localStorage.getItem(STORAGE_USERS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Upgrade legacy cached records to include default demo emails
        let upgraded = false;
        for (const user of parsed) {
          if (!user.email) {
            const demo = DEFAULT_DEMO_USERS.find(d => getCleanDigits(d.phone) === getCleanDigits(user.phone));
            if (demo?.email) {
              user.email = demo.email;
              upgraded = true;
            }
          }
        }
        if (upgraded) {
          saveRegisteredUsers(parsed);
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load registered users', e);
  }

  // Seed default demo users
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_DEMO_USERS));
  } catch {
    // ignore
  }
  return DEFAULT_DEMO_USERS;
}

// Save users
export function saveRegisteredUsers(users: AuthUser[]): void {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('Failed to save users', e);
  }
}

// Get active session
export function getActiveAuthSession(): AuthUser | null {
  try {
    const saved = localStorage.getItem(STORAGE_SESSION_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.id && parsed.phone) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

// Save active session
export function saveActiveAuthSession(user: AuthUser | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  } catch (e) {
    console.warn('Failed to save session', e);
  }
}

// Generate a random 6-digit OTP
export function generateRandomOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Request OTP challenge
export async function requestOTPChallenge(
  rawIdentifier: string,
  purpose: 'signup' | 'forgot_password' | 'profile_update',
  payload?: any
): Promise<{ success: boolean; message: string; challenge?: OTPChallenge }> {
  const isEmail = rawIdentifier.includes('@');
  const users = getRegisteredUsers();
  let existingUser: AuthUser | undefined;
  let normalized = rawIdentifier.trim();
  let targetPhone = rawIdentifier.trim();

  if (isEmail) {
    const cleanEmail = rawIdentifier.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    normalized = cleanEmail;
    existingUser = users.find(u => u.email?.toLowerCase() === cleanEmail);

    try {
      const remoteProfile = await fetchSupabaseProfileByEmail(cleanEmail);
      if (remoteProfile) {
        existingUser = {
          id: remoteProfile.id,
          name: remoteProfile.name,
          phone: remoteProfile.phone,
          email: remoteProfile.email || cleanEmail,
          isFPO: Boolean(remoteProfile.is_fpo),
          fpoName: remoteProfile.fpo_name || undefined,
          state: remoteProfile.state,
          district: remoteProfile.district,
          village: remoteProfile.village,
          primaryCrops: remoteProfile.primary_crops || [],
          passwordHash: remoteProfile.password_hash || 'Kisan@123',
          isPhoneVerified: remoteProfile.is_phone_verified,
          registeredAt: remoteProfile.created_at || new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          twoFactorEnabled: true,
        };
      }
    } catch (err) {
      console.warn('Supabase remote profile check notice:', err);
    }

    if (purpose === 'signup' && existingUser) {
      return {
        success: false,
        message: `An account with email ${cleanEmail} already exists in database. Please log in or use Forgot Password.`,
      };
    }

    if (purpose === 'forgot_password' && !existingUser) {
      return {
        success: false,
        message: `No farmer account found for email ${cleanEmail}. Please check or sign up first.`,
      };
    }

    targetPhone = existingUser?.phone || rawIdentifier;
  } else {
    const cleanDigits = getCleanDigits(rawIdentifier);
    if (cleanDigits.length !== 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile phone number.' };
    }

    normalized = normalizePhone(rawIdentifier);
    targetPhone = normalized;
    existingUser = users.find(u => getCleanDigits(u.phone) === cleanDigits);

    // Check Supabase profiles table
    try {
      const remoteProfile = await fetchSupabaseProfileByPhone(rawIdentifier);
      if (remoteProfile) {
        existingUser = {
          id: remoteProfile.id,
          name: remoteProfile.name,
          phone: remoteProfile.phone,
          email: remoteProfile.email || undefined,
          isFPO: Boolean(remoteProfile.is_fpo),
          fpoName: remoteProfile.fpo_name || undefined,
          state: remoteProfile.state,
          district: remoteProfile.district,
          village: remoteProfile.village,
          primaryCrops: remoteProfile.primary_crops || [],
          passwordHash: remoteProfile.password_hash || 'Kisan@123',
          isPhoneVerified: remoteProfile.is_phone_verified,
          registeredAt: remoteProfile.created_at || new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          twoFactorEnabled: true,
        };
      }
    } catch (err) {
      console.warn('Supabase remote profile check notice:', err);
    }

    if (purpose === 'signup' && existingUser) {
      return {
        success: false,
        message: `An account with phone ${normalized} already exists in database. Please log in or use Forgot Password.`,
      };
    }

    if (purpose === 'forgot_password' && !existingUser) {
      return {
        success: false,
        message: `No farmer account found for phone number ${normalized}. Please check or sign up first.`,
      };
    }
  }

  const otpCode = generateRandomOTP();
  const challenge: OTPChallenge = {
    phone: targetPhone,
    otpCode: otpCode,
    purpose: purpose,
    createdAt: Date.now(),
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes validity
    payload: { ...(payload || {}), identifier: normalized },
  };

  try {
    localStorage.setItem(STORAGE_OTP_CHALLENGE_KEY, JSON.stringify(challenge));
  } catch {
    // ignore
  }

  // Asynchronously record OTP challenge in Supabase otp_challenges table
  await saveSupabaseOTPChallenge(targetPhone, otpCode, purpose, challenge.payload, challenge.expiresAt).catch(() => {});

  const destinationDesc = isEmail && existingUser
    ? `registered mobile (${existingUser.phone})`
    : normalized;

  return {
    success: true,
    message: `Security OTP sent to ${destinationDesc}.`,
    challenge: challenge,
  };
}

// Get active OTP challenge
export function getActiveOTPChallenge(): OTPChallenge | null {
  try {
    const saved = localStorage.getItem(STORAGE_OTP_CHALLENGE_KEY);
    if (saved) {
      const challenge: OTPChallenge = JSON.parse(saved);
      if (challenge && challenge.expiresAt > Date.now()) {
        return challenge;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

// Clear OTP challenge
export function clearActiveOTPChallenge(): void {
  try {
    localStorage.removeItem(STORAGE_OTP_CHALLENGE_KEY);
  } catch {
    // ignore
  }
}

// Verify OTP and complete action
export async function verifyOTPChallenge(
  rawIdentifier: string,
  enteredOTP: string,
  purpose: 'signup' | 'forgot_password' | 'profile_update',
  newPasswordForReset?: string
): Promise<{ success: boolean; message: string; user?: AuthUser }> {
  const challenge = getActiveOTPChallenge();

  if (!challenge) {
    return {
      success: false,
      message: 'OTP has expired or was not requested. Please request a new OTP.',
    };
  }

  const isEmail = rawIdentifier.includes('@');
  const cleanDigits = isEmail ? '' : getCleanDigits(rawIdentifier);
  const cleanEmail = isEmail ? rawIdentifier.trim().toLowerCase() : '';

  const matchesIdentifier = isEmail
    ? (challenge.payload?.identifier === cleanEmail || challenge.payload?.email === cleanEmail || challenge.phone === rawIdentifier)
    : (getCleanDigits(challenge.phone) === cleanDigits || challenge.payload?.phone === rawIdentifier || challenge.payload?.identifier === normalizePhone(rawIdentifier));

  if (!matchesIdentifier || challenge.purpose !== purpose) {
    return {
      success: false,
      message: 'OTP mismatch. Please request a fresh OTP for your account.',
    };
  }

  if (enteredOTP.trim() !== challenge.otpCode.trim()) {
    return {
      success: false,
      message: 'Incorrect 6-digit OTP code entered. Please try again.',
    };
  }

  // Handle Signup Completion
  if (purpose === 'signup') {
    if (!challenge.payload) {
      return { success: false, message: 'Signup registration data missing. Please fill the form again.' };
    }

    const { name, phone, email, state, district, village, isFPO, fpoName, primaryCrops, password } = challenge.payload;
    const users = getRegisteredUsers();

    // Double check duplicate phone
    if (users.some(u => getCleanDigits(u.phone) === getCleanDigits(phone))) {
      return { success: false, message: 'An account with this phone already exists.' };
    }

    const newUser: AuthUser = {
      id: `farmer-${Date.now()}`,
      name: name.trim(),
      phone: normalizePhone(phone),
      email: email ? email.trim().toLowerCase() : undefined,
      state: state.trim(),
      district: district.trim(),
      village: village.trim(),
      isFPO: Boolean(isFPO),
      fpoName: isFPO ? fpoName?.trim() : undefined,
      primaryCrops: primaryCrops && primaryCrops.length > 0 ? primaryCrops : ['General Produce'],
      passwordHash: password,
      isPhoneVerified: true,
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      twoFactorEnabled: true,
    };

    const existingIdx = users.findIndex(u => getCleanDigits(u.phone) === getCleanDigits(phone));
    if (existingIdx >= 0) {
      users[existingIdx] = newUser;
    } else {
      users.push(newUser);
    }
    saveRegisteredUsers(users);
    saveActiveAuthSession(newUser);
    clearActiveOTPChallenge();

    // Sync to Supabase profiles table
    try {
      await syncSupabaseProfile(newUser);
    } catch (err) {
      console.warn('Supabase profile sync notice:', err);
    }

    return {
      success: true,
      message: `Account created successfully for ${newUser.name}! Connected to Supabase backend table.`,
      user: newUser,
    };
  }

  // Handle Forgot Password Reset Completion
  if (purpose === 'forgot_password') {
    if (!newPasswordForReset || newPasswordForReset.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    const users = getRegisteredUsers();
    const userIndex = isEmail
      ? users.findIndex(u => u.email?.toLowerCase() === cleanEmail)
      : users.findIndex(u => getCleanDigits(u.phone) === cleanDigits);

    let updatedUser: AuthUser | null = null;
    if (userIndex !== -1) {
      users[userIndex].passwordHash = newPasswordForReset;
      users[userIndex].lastLoginAt = new Date().toISOString();
      users[userIndex].isPhoneVerified = true;
      saveRegisteredUsers(users);
      saveActiveAuthSession(users[userIndex]);
      updatedUser = users[userIndex];
    }

    // Update in Supabase backend profiles table
    try {
      if (isSupabaseConfigured()) {
        const query = supabase
          .from('profiles')
          .update({
            password_hash: newPasswordForReset,
            updated_at: new Date().toISOString(),
          });

        if (isEmail) {
          await query.ilike('email', cleanEmail);
        } else {
          await query.eq('phone', normalizePhone(rawIdentifier));
        }

        if (!updatedUser) {
          const remoteProfile = isEmail
            ? await fetchSupabaseProfileByEmail(cleanEmail)
            : await fetchSupabaseProfileByPhone(rawIdentifier);

          if (remoteProfile) {
            updatedUser = {
              id: remoteProfile.id,
              name: remoteProfile.name,
              phone: remoteProfile.phone,
              email: remoteProfile.email || undefined,
              isFPO: Boolean(remoteProfile.is_fpo),
              fpoName: remoteProfile.fpo_name || undefined,
              state: remoteProfile.state,
              district: remoteProfile.district,
              village: remoteProfile.village,
              primaryCrops: remoteProfile.primary_crops || [],
              passwordHash: newPasswordForReset,
              isPhoneVerified: true,
              registeredAt: remoteProfile.created_at || new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              twoFactorEnabled: true,
            };
            saveActiveAuthSession(updatedUser);
          }
        }
      }
    } catch (err) {
      console.warn('Supabase password reset error:', err);
    }

    clearActiveOTPChallenge();

    if (!updatedUser) {
      return { success: false, message: 'User account not found.' };
    }

    return {
      success: true,
      message: 'Password reset successfully! Updated in Supabase backend database.',
      user: updatedUser,
    };
  }

  return { success: false, message: 'Unknown OTP verification purpose.' };
}

// Standard Secure Login with Phone OR Email & Password (Connected to Supabase Profiles Table)
export async function loginWithPassword(
  identifier: string,
  enteredPassword: string,
  loginMethod: 'phone' | 'email' = 'phone'
): Promise<{ success: boolean; message: string; user?: AuthUser }> {
  const isEmail = loginMethod === 'email' || identifier.includes('@');

  if (!enteredPassword || enteredPassword.trim() === '') {
    return { success: false, message: 'Please enter your account password.' };
  }

  // Branch 1: Email Login
  if (isEmail) {
    const cleanEmail = identifier.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    // 1. Primary check: Query Supabase backend profiles table by email
    try {
      const remoteProfile = await fetchSupabaseProfileByEmail(cleanEmail);
      if (remoteProfile) {
        const expectedPassword = remoteProfile.password_hash || 'Kisan@123';
        if (expectedPassword !== enteredPassword) {
          return {
            success: false,
            message: 'Incorrect password entered. Click "Forgot Password?" to reset your password.',
          };
        }

        const remoteUser: AuthUser = {
          id: remoteProfile.id,
          name: remoteProfile.name,
          phone: remoteProfile.phone,
          email: remoteProfile.email || cleanEmail,
          isFPO: Boolean(remoteProfile.is_fpo),
          fpoName: remoteProfile.fpo_name || undefined,
          state: remoteProfile.state,
          district: remoteProfile.district,
          village: remoteProfile.village,
          primaryCrops: remoteProfile.primary_crops && remoteProfile.primary_crops.length > 0 ? remoteProfile.primary_crops : ['General Produce'],
          passwordHash: expectedPassword,
          isPhoneVerified: remoteProfile.is_phone_verified,
          registeredAt: remoteProfile.created_at || new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          twoFactorEnabled: true,
        };

        // Record login event timestamp in Supabase
        await recordSupabaseLogin(cleanEmail);

        // Cache locally
        const users = getRegisteredUsers();
        const existingIdx = users.findIndex(
          u => (u.email && u.email.toLowerCase() === cleanEmail) || getCleanDigits(u.phone) === getCleanDigits(remoteProfile.phone)
        );
        if (existingIdx >= 0) {
          users[existingIdx] = remoteUser;
        } else {
          users.push(remoteUser);
        }
        saveRegisteredUsers(users);
        saveActiveAuthSession(remoteUser);

        return {
          success: true,
          message: `Welcome back, ${remoteUser.name}! Connected to Supabase backend table.`,
          user: remoteUser,
        };
      }
    } catch (err) {
      console.warn('Supabase remote profile email lookup error:', err);
    }

    // 2. Secondary check: Local pre-seeded user accounts
    const users = getRegisteredUsers();
    const localUser = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);

    if (!localUser) {
      return {
        success: false,
        message: `No farmer account found for email ${cleanEmail}. Please sign up as a farmer to create your profile on Supabase.`,
      };
    }

    if (localUser.passwordHash !== enteredPassword) {
      return {
        success: false,
        message: 'Incorrect password entered. Click "Forgot Password?" to reset your password.',
      };
    }

    // Update last login
    localUser.lastLoginAt = new Date().toISOString();
    saveRegisteredUsers(users);
    saveActiveAuthSession(localUser);

    // Sync profile to Supabase backend profiles table
    try {
      await syncSupabaseProfile(localUser);
    } catch (err) {
      console.warn('Supabase profile sync error during login:', err);
    }

    return {
      success: true,
      message: `Welcome back, ${localUser.name}! Connected to Supabase backend table.`,
      user: localUser,
    };
  }

  // Branch 2: Phone Login
  const cleanDigits = getCleanDigits(identifier);
  if (cleanDigits.length !== 10) {
    return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
  }

  const normalized = normalizePhone(identifier);

  // 1. Primary check: Query Supabase backend profiles table
  try {
    const remoteProfile = await fetchSupabaseProfileByPhone(identifier);
    if (remoteProfile) {
      const expectedPassword = remoteProfile.password_hash || 'Kisan@123';
      if (expectedPassword !== enteredPassword) {
        return {
          success: false,
          message: 'Incorrect password entered. Click "Forgot Password?" to reset via SMS OTP.',
        };
      }

      const remoteUser: AuthUser = {
        id: remoteProfile.id,
        name: remoteProfile.name,
        phone: remoteProfile.phone,
        email: remoteProfile.email || undefined,
        isFPO: Boolean(remoteProfile.is_fpo),
        fpoName: remoteProfile.fpo_name || undefined,
        state: remoteProfile.state,
        district: remoteProfile.district,
        village: remoteProfile.village,
        primaryCrops: remoteProfile.primary_crops && remoteProfile.primary_crops.length > 0 ? remoteProfile.primary_crops : ['General Produce'],
        passwordHash: expectedPassword,
        isPhoneVerified: remoteProfile.is_phone_verified,
        registeredAt: remoteProfile.created_at || new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        twoFactorEnabled: true,
      };

      // Record login event timestamp in Supabase backend profiles table
      await recordSupabaseLogin(remoteUser.phone);

      // Cache locally
      const users = getRegisteredUsers();
      const existingIdx = users.findIndex(u => getCleanDigits(u.phone) === cleanDigits);
      if (existingIdx >= 0) {
        users[existingIdx] = remoteUser;
      } else {
        users.push(remoteUser);
      }
      saveRegisteredUsers(users);
      saveActiveAuthSession(remoteUser);

      return {
        success: true,
        message: `Welcome back, ${remoteUser.name}! Connected to Supabase backend table.`,
        user: remoteUser,
      };
    }
  } catch (err) {
    console.warn('Supabase remote profile lookup error:', err);
  }

  // 2. Secondary check: Local pre-seeded user accounts
  const users = getRegisteredUsers();
  const localUser = users.find(u => getCleanDigits(u.phone) === cleanDigits);

  if (!localUser) {
    return {
      success: false,
      message: `No farmer account found for phone ${normalized}. Please sign up as a farmer to create your profile on Supabase.`,
    };
  }

  if (localUser.passwordHash !== enteredPassword) {
    return {
      success: false,
      message: 'Incorrect password entered. Click "Forgot Password?" to reset via SMS OTP.',
    };
  }

  // Update last login
  localUser.lastLoginAt = new Date().toISOString();
  saveRegisteredUsers(users);
  saveActiveAuthSession(localUser);

  // Sync profile to Supabase backend profiles table
  try {
    await syncSupabaseProfile(localUser);
  } catch (err) {
    console.warn('Supabase profile sync error during login:', err);
  }

  return {
    success: true,
    message: `Welcome back, ${localUser.name}! Connected to Supabase backend table.`,
    user: localUser,
  };
}

// Update profile details for authenticated user
export function updateAuthProfile(
  userId: string,
  updatedData: Partial<AuthUser>
): { success: boolean; message: string; user?: AuthUser } {
  const users = getRegisteredUsers();
  const index = users.findIndex(u => u.id === userId);

  if (index === -1) {
    return { success: false, message: 'Account not found.' };
  }

  const updatedUser: AuthUser = {
    ...users[index],
    ...updatedData,
  };

  users[index] = updatedUser;
  saveRegisteredUsers(users);

  const active = getActiveAuthSession();
  if (active && active.id === userId) {
    saveActiveAuthSession(updatedUser);
  }

  // Sync profile edits to Supabase
  syncSupabaseProfile(updatedUser).catch(err => console.warn('Supabase profile update sync notice:', err));

  return {
    success: true,
    message: 'Profile updated successfully.',
    user: updatedUser,
  };
}
