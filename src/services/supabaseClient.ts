/* Editorial Fieldwork reminder: backend status must be honest in the UI; local-first functionality must remain usable when optional data services are absent. */
import { createClient } from '@supabase/supabase-js';

function normalizeSupabaseUrl(rawUrl?: string): string {
  const url = (rawUrl || '').trim();
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const rawSupabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.SUPABASE_PUBLISHABLE_KEY;

const configuredUrl = normalizeSupabaseUrl(rawSupabaseUrl);
const configuredKey = (rawSupabaseKey || '').trim();

export const SUPABASE_URL = configuredUrl || 'https://placeholder.supabase.co';
export const SUPABASE_ANON_KEY = configuredKey || 'placeholder-public-key';

export const isSupabaseConfigured = (): boolean => Boolean(configuredUrl && configuredKey);

// The fallback client is intentionally inert because all app data has a local-first path.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  db: { schema: 'public' },
});

export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return { connected: false, message: 'Supabase is not configured; using local workspace data.' };
  }

  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') return { connected: false, message: 'The profiles table is unavailable.' };
      return { connected: true, message: `Connected to Supabase (${error.message || 'Ready'})` };
    }
    return { connected: true, message: 'Successfully connected to Supabase backend database' };
  } catch (error: any) {
    return { connected: false, message: error?.message || 'Failed to reach Supabase' };
  }
}
