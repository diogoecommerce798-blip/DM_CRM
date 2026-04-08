import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env.js";

export const supabase = createClient(
  ENV.supabaseUrl,
  ENV.supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    }
  }
);
