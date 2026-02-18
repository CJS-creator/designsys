// Safe wrapper around the auto-generated Supabase client
// Handles cases where env vars might not be available yet
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

let supabaseInstance: SupabaseClient<Database> | null = null;

try {
  if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
    supabaseInstance = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  } else {
    console.warn('Supabase environment variables not found. Backend features will be unavailable.');
  }
} catch (e) {
  console.warn('Failed to initialize Supabase client:', e);
}

export const safeSupabase = supabaseInstance;
