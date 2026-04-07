import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only initialize if we have a valid URL string that doesn't start with % (Vite placeholder)
const isValidUrl = (url: string | undefined) => {
  if (!url || url === 'undefined') return false;
  try {
    // Ensure the URL has a protocol for the constructor to succeed
    const urlToTest = url.startsWith('http') ? url : `https://${url}`;
    new URL(urlToTest);
    return true;
  } catch (e) {
    console.error(`Invalid Supabase URL: ${url}`, e);
    return false;
  }
};

if (!isValidUrl(supabaseUrl) || !supabaseAnonKey || supabaseAnonKey === 'undefined') {
  console.warn('Supabase credentials missing or invalid. Supabase features will be disabled.');
  if (supabaseUrl) console.log(`Supabase URL: ${supabaseUrl}`);
}

// Create a proxy or a dummy client if credentials are missing to avoid crash
export const supabase = (isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey !== 'undefined')
  ? createClient(supabaseUrl.startsWith('http') ? supabaseUrl : `https://${supabaseUrl}`, supabaseAnonKey)
  : null;
