const getRequiredEnv = (key: string, fallback?: string): string => {
  const value = 
    process.env[key] || 
    process.env[`VITE_${key}`] || 
    process.env[`NEXT_PUBLIC_${key}`] || 
    (key === "DATABASE_URL" ? process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.SUPABASE_DB_URL : undefined) ||
    fallback;
  if (value === undefined) {
    console.error(`[ENV] CRITICAL ERROR: Environment variable ${key} is missing!`);
    return "";
  }
  return value;
};

export const ENV = {
  appId: process.env.APP_ID || process.env.VITE_APP_ID || "",
  cookieSecret: process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET || "",
  databaseUrl: process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.SUPABASE_DB_URL || "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL || "https://api.manus.ai",
  ownerOpenId: process.env.OWNER_OPEN_ID || "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL || "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY || "",
  supabaseUrl: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://qxkcgttftkryhhjqqhkm.supabase.co",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_1TUYX4HMN83vlKU4EHTIlg_6V9SVy3P",
  supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET || "",
};
