import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const isConfigPresent = Boolean(supabaseUrl && supabaseAnonKey);

let client: SupabaseClient | null = null;

if (isConfigPresent) {
  client = createClient(supabaseUrl as string, supabaseAnonKey as string, {
    auth: {
      persistSession: true,
    },
    global: {
      headers: {
        "x-application-name": "the-md-manifest/finance-module",
      },
    },
  });
} else {
  console.warn("Supabase credentials are not configured. Finance module will run in offline mode.");
}

export const supabase = client;

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error("Supabase client is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  return supabase;
}
