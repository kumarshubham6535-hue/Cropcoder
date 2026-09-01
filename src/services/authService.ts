// KisanDirect Secure Authentication & OTP Verification Service
import { FarmerProfile } from '../types';
import { 
  syncSupabaseProfile, 
  saveSupabaseOTPChallenge, 
  verifySupabaseStoredOTP,
  fetchSupabaseProfileByPhone 
} from './supabaseService';

export interface AuthUser extends FarmerProfile {
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
export function requestOTPChallenge(
  rawPhone: string,
  purpose: 'signup' | 'forgot_password' | 'profile_update',
  payload?: any
): { success: boolean; message: string; challenge?: OTPChallenge } {
  const cleanDigits = getCleanDigits(rawPhone);
  if (cleanDigits.length !== 10) {
    return { success: false, message: 'Please enter a valid 10-digit mobile phone number.' };
  }

  const normalized = normalizePhone(rawPhone);
  const users = getRegisteredUsers();
  const existingUser = users.find(u => getCleanDigits(u.phone) === cleanDigits);

  if (purpose === 'signup' && existingUser) {
    return {
      success: false,
      message: `An account with phone ${normalized} already exists. Please log in or use Forgot Password.`,
    };
  }

  if (purpose === 'forgot_password' && !existingUser) {
    return {
      success: false,
      message: `No farmer account found for phone number ${normalized}. Please check or sign up first.`,
    };
  }

  const otpCode = generateRandomOTP();
  const challenge: OTPChallenge = {
    phone: normalized,
    otpCode: otpCode,
    purpose: purpose,
    createdAt: Date.now(),
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes validity
    payload: payload,
  };

  try {
    localStorage.setItem(STORAGE_OTP_CHALLENGE_KEY, JSON.stringify(challenge));
  } catch {
    // ignore
  }

  // Asynchronously record OTP challenge in Supabase otp_challenges table
  saveSupabaseOTPChallenge(normalized, otpCode, purpose, payload, challenge.expiresAt).catch(() => {});

  return {
    success: true,
    message: `Security OTP sent to ${normalized}.`,
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
export function verifyOTPChallenge(
  rawPhone: string,
  enteredOTP: string,
  purpose: 'signup' | 'forgot_password' | 'profile_update',
  newPasswordForReset?: string
): { success: boolean; message: string; user?: AuthUser } {
  const cleanDigits = getCleanDigits(rawPhone);
  const challenge = getActiveOTPChallenge();

  if (!challenge) {
    return {
      success: false,
      message: 'OTP has expired or was not requested. Please request a new OTP.',
    };
  }

  if (getCleanDigits(challenge.phone) !== cleanDigits || challenge.purpose !== purpose) {
    return {
      success: false,
      message: 'OTP mismatch. Please request a fresh OTP for your phone number.',
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

    const { name, phone, state, district, village, isFPO, fpoName, primaryCrops, password } = challenge.payload;
    const users = getRegisteredUsers();

    // Double check duplicate
    if (users.some(u => getCleanDigits(u.phone) === getCleanDigits(phone))) {
      return { success: false, message: 'An account with this phone already exists.' };
    }

    const newUser: AuthUser = {
      id: `farmer-${Date.now()}`,
      name: name.trim(),
      phone: normalizePhone(phone),
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

    users.push(newUser);
    saveRegisteredUsers(users);
    saveActiveAuthSession(newUser);
    clearActiveOTPChallenge();

    // Sync to Supabase profiles table
    syncSupabaseProfile(newUser).catch(err => console.warn('Supabase profile sync notice:', err));

    return {
      success: true,
      message: `Account created successfully for ${newUser.name}! You are now securely logged in.`,
      user: newUser,
    };
  }

  // Handle Forgot Password Reset Completion
  if (purpose === 'forgot_password') {
    if (!newPasswordForReset || newPasswordForReset.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    const users = getRegisteredUsers();
    const userIndex = users.findIndex(u => getCleanDigits(u.phone) === cleanDigits);

    if (userIndex === -1) {
      return { success: false, message: 'User account not found.' };
    }

    users[userIndex].passwordHash = newPasswordForReset;
    users[userIndex].lastLoginAt = new Date().toISOString();
    users[userIndex].isPhoneVerified = true;

    saveRegisteredUsers(users);
    saveActiveAuthSession(users[userIndex]);
    clearActiveOTPChallenge();

    return {
      success: true,
      message: 'Password reset successfully! Logged in with your new credentials.',
      user: users[userIndex],
    };
  }

  return { success: false, message: 'Unknown OTP verification purpose.' };
}

// Standard Secure Login with Phone & Password
export function loginWithPassword(
  rawPhone: string,
  enteredPassword: string
): { success: boolean; message: string; user?: AuthUser } {
  const cleanDigits = getCleanDigits(rawPhone);
  if (cleanDigits.length !== 10) {
    return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
  }

  if (!enteredPassword || enteredPassword.trim() === '') {
    return { success: false, message: 'Please enter your account password.' };
  }

  const users = getRegisteredUsers();
  const user = users.find(u => getCleanDigits(u.phone) === cleanDigits);

  if (!user) {
    return {
      success: false,
      message: `No farmer account found for phone ${normalizePhone(rawPhone)}. Please sign up with OTP.`,
    };
  }

  if (user.passwordHash !== enteredPassword) {
    return {
      success: false,
      message: 'Incorrect password entered. Click "Forgot Password?" to reset via SMS OTP.',
    };
  }

  // Update last login
  user.lastLoginAt = new Date().toISOString();
  saveRegisteredUsers(users);
  saveActiveAuthSession(user);

  return {
    success: true,
    message: `Welcome back, ${user.name}!`,
    user: user,
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
