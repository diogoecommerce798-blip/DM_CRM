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
  appId: getRequiredEnv("APP_ID", ""),
  cookieSecret: getRequiredEnv("JWT_SECRET", ""),
  databaseUrl: getRequiredEnv("DATABASE_URL", ""),
  oAuthServerUrl: getRequiredEnv("OAUTH_SERVER_URL", ""),
  ownerOpenId: getRequiredEnv("OWNER_OPEN_ID", ""),
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: getRequiredEnv("BUILT_IN_FORGE_API_URL", ""),
  forgeApiKey: getRequiredEnv("BUILT_IN_FORGE_API_KEY", ""),
};
