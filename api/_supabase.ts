import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (service role key recommended)
export function getSupabase() {
  const url = process.env.SUPABASE_URL as string | undefined;
  const anon = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
  if (!url || !anon) {
    throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }
  return createClient(url, anon, { auth: { persistSession: false } });
}


