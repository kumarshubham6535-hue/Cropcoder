import { createClient } from '@supabase/supabase-js';

// Clean and normalize the Supabase Project URL
// Removes any trailing '/rest/v1/' if user supplied the REST endpoint
function normalizeSupabaseUrl(rawUrl?: string): string {
  const defaultUrl = 'https://gzwketwuirwtwrbkhbiz.supabase.co';
  const url = (rawUrl || defaultUrl).trim();
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

// Retrieve client-side environment variables configured in Netlify or Vite
const rawSupabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.SUPABASE_URL;

const rawSupabaseKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_z19LoBbnWaYw8uJEaBbxPA_V_38ai-k';

export const SUPABASE_URL = normalizeSupabaseUrl(rawSupabaseUrl);
export const SUPABASE_ANON_KEY = (rawSupabaseKey || 'sb_publishable_z19LoBbnWaYw8uJEaBbxPA_V_38ai-k').trim();

// Create the unified Supabase JavaScript client with auto-refresh and persistent session
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
});

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
};

// Health check utility
export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error) {
      // If table exists but query failed due to RLS or permissions, it still reached the DB
      if (error.code === '42P01') {
        return { connected: false, message: 'Table does not exist. Run SQL schema in Supabase.' };
      }
      return { connected: true, message: `Connected to Supabase (${error.message || 'Ready'})` };
    }
    return { connected: true, message: 'Successfully connected to Supabase backend database' };
  } catch (err: any) {
    return { connected: false, message: err?.message || 'Failed to reach Supabase' };
  }
}
