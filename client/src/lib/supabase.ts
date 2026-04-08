import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  "https://qxkcgttftkryhhjqqhkm.supabase.co";

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 
  "sb_publishable_1TUYX4HMN83vlKU4EHTIlg_6V9SVy3P";

// Only initialize if we have a valid URL string
const isValidUrl = (url: string | undefined) => {
  if (!url || url === 'undefined' || url.startsWith('%')) return false;
  try {
    const urlToTest = url.startsWith('http') ? url : `https://${url}`;
    new URL(urlToTest);
    return true;
  } catch (e) {
    return false;
  }
};

export const supabase = (isValidUrl(supabaseUrl) && supabaseAnonKey)
  ? createClient(supabaseUrl.startsWith('http') ? supabaseUrl : `https://${supabaseUrl}`, supabaseAnonKey)
  : null;
