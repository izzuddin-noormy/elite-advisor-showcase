// Server-side Supabase client for SSR data fetching (public/anon reads).
// No session persistence — safe to instantiate per request in server components.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string;

export function supabaseServer() {
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
