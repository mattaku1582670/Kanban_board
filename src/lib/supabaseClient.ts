import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_CONFIG_ERROR =
  "Supabase の設定が不足しています。.env.local に VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY を設定してください。";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

export function requireSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(SUPABASE_CONFIG_ERROR);
  }

  return supabase;
}
