import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

export function createClient() {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : null;
  const supabaseUrl =
    metaEnv?.VITE_SUPABASE_URL ||
    'https://aovqspldjfmhbljdogqw.supabase.co';

  const supabaseAnonKey =
    metaEnv?.VITE_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdnFzcGxkamZtaGJsamRvZ3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMzMzNDcsImV4cCI6MjEwNzgwOTM0N30.lBqZELfmXsKTezWtNbMfOGV3xAYC6JfMLSuDhMaM5aw';

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export const supabase = createClient();
