import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

/**
 * Server / Edge / Cloudflare Workers Supabase client adapter
 */
export function createServerSupabaseClient(serviceKey?: string) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = serviceKey || process.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
