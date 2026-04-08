const getEnv = (key: string, fallback: string = ""): string => {
  const value = 
    process.env[key] || 
    process.env[`VITE_${key}`] || 
    process.env[`NEXT_PUBLIC_${key}`] || 
    (key === "DATABASE_URL" ? process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.SUPABASE_DB_URL : undefined) ||
    fallback;
  return value || "";
};

export const ENV = {
  appId: getEnv("APP_ID", "nexus-crm"),
  cookieSecret: getEnv("JWT_SECRET", "dm-crm-secret-default"),
  databaseUrl: getEnv("DATABASE_URL"),
  oAuthServerUrl: getEnv("OAUTH_SERVER_URL", "https://api.manus.ai"),
  ownerOpenId: getEnv("OWNER_OPEN_ID"),
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: getEnv("BUILT_IN_FORGE_API_URL"),
  forgeApiKey: getEnv("BUILT_IN_FORGE_API_KEY"),
  supabaseUrl: getEnv("SUPABASE_URL", "https://qxkcgttftkryhhjqqhkm.supabase.co"),
  supabaseAnonKey: getEnv("SUPABASE_ANON_KEY", "sb_publishable_1TUYX4HMN83vlKU4EHTIlg_6V9SVy3P"),
  supabaseJwtSecret: getEnv("SUPABASE_JWT_SECRET", "dm-crm-secret-default"),
};
