import { saveFarmerProfileToSupabase } from './supabaseService';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  state: string;
  district: string;
  village?: string;
  farmSizeAcres: number;
  primaryCrop: string;
  farmerIdCode: string;
  createdAt: string;
}

export const CURRENT_USER_STORAGE_KEY = 'krishi_current_user';
export const REGISTERED_USERS_STORAGE_KEY = 'krishi_registered_users';
export const USER_SCANS_PREFIX = 'krishi_user_scans_';

// Default Demo Farmer Profiles across Indian Agricultural Belts
export const DEMO_USER: UserProfile = {
  id: 'user-demo-rajendra',
  name: 'Rajendra Patil',
  phone: '9876543210',
  email: 'rajendra.patil@krishiscan.in',
  state: 'Maharashtra',
  district: 'Nashik',
  village: 'Dindori',
  farmSizeAcres: 4.5,
  primaryCrop: 'potato',
  farmerIdCode: 'KRISHI-4882',
  createdAt: '2026-08-01T10:00:00Z',
};

export const PRESET_SAMPLE_USERS: UserProfile[] = [
  DEMO_USER,
  {
    id: 'user-demo-suresh',
    name: 'Suresh Kumar Sharma',
    phone: '9812345678',
    email: 'suresh.sharma@krishiscan.in',
    state: 'Punjab',
    district: 'Ludhiana',
    village: 'Samrala',
    farmSizeAcres: 8.0,
    primaryCrop: 'wheat',
    farmerIdCode: 'KRISHI-9120',
    createdAt: '2026-08-10T08:30:00Z',
  },
  {
    id: 'user-demo-anita',
    name: 'Anita Devi Verma',
    phone: '9456781234',
    email: 'anita.verma@krishiscan.in',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    village: 'Rohaniya',
    farmSizeAcres: 3.2,
    primaryCrop: 'rice',
    farmerIdCode: 'KRISHI-3381',
    createdAt: '2026-08-15T14:20:00Z',
  },
  {
    id: 'user-demo-vikram',
    name: 'Vikram Singh Rathore',
    phone: '9414012345',
    email: 'vikram.singh@krishiscan.in',
    state: 'Rajasthan',
    district: 'Jaipur',
    village: 'Chomu',
    farmSizeAcres: 6.5,
    primaryCrop: 'mustard',
    farmerIdCode: 'KRISHI-7290',
    createdAt: '2026-08-18T09:15:00Z',
  },
  {
    id: 'user-demo-priya',
    name: 'Priya Sundaram',
    phone: '9840123456',
    email: 'priya.sundaram@krishiscan.in',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    village: 'Pollachi',
    farmSizeAcres: 5.0,
    primaryCrop: 'cotton',
    farmerIdCode: 'KRISHI-5512',
    createdAt: '2026-08-20T11:45:00Z',
  },
  {
    id: 'user-demo-manoj',
    name: 'Manoj Kumar Yadav',
    phone: '9934123456',
    email: 'manoj.yadav@krishiscan.in',
    state: 'Bihar',
    district: 'Patna',
    village: 'Danapur',
    farmSizeAcres: 2.5,
    primaryCrop: 'tomato',
    farmerIdCode: 'KRISHI-2041',
    createdAt: '2026-08-22T16:00:00Z',
  },
];

/**
 * Get current logged in user from localStorage or return null
 */
export function getCurrentUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as UserProfile;
  } catch (err) {
    console.error('Failed to parse current user:', err);
    return null;
  }
}

/**
 * Set current logged in user
 */
export function setCurrentUser(user: UserProfile | null): void {
  try {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    } else {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Failed to store current user:', err);
  }
}

/**
 * Get all registered accounts locally
 */
export function getRegisteredUsers(): UserProfile[] {
  try {
    const data = localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
    if (!data) {
      // Seed preset accounts initially
      localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(PRESET_SAMPLE_USERS));
      return PRESET_SAMPLE_USERS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : PRESET_SAMPLE_USERS;
  } catch (err) {
    return PRESET_SAMPLE_USERS;
  }
}

/**
 * Register or login with phone / name / OTP
 */
export function saveOrUpdateUser(user: UserProfile): void {
  const users = getRegisteredUsers();
  const existingIdx = users.findIndex((u) => u.phone === user.phone || u.id === user.id);
  let updatedUsers: UserProfile[];
  if (existingIdx >= 0) {
    updatedUsers = [...users];
    updatedUsers[existingIdx] = { ...updatedUsers[existingIdx], ...user };
  } else {
    updatedUsers = [user, ...users];
  }
  localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  setCurrentUser(user);
  // Auto-sync profile to Supabase Cloud PostgreSQL in background
  saveFarmerProfileToSupabase(user).catch((err) => {
    console.warn('Background Supabase profile sync skipped:', err);
  });
}

/**
 * Find user by phone number or ID
 */
export function findUserByPhone(phone: string): UserProfile | null {
  const cleanPhone = phone.trim().replace(/\D/g, '').slice(-10);
  const users = getRegisteredUsers();
  return users.find((u) => u.phone.replace(/\D/g, '').slice(-10) === cleanPhone) || null;
}
