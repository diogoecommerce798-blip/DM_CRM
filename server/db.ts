import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema.js";
import { ENV } from "./_core/env";
import { eq } from "drizzle-orm";

let dbInstance: any = null;

export const getDb = async () => {
  if (dbInstance) return dbInstance;

  if (!ENV.databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  try {
    // prepare: false is required for Supabase (PgBouncer in transaction mode)
    const client = postgres(ENV.databaseUrl, { prepare: false });
    dbInstance = drizzle(client, { schema });
    return dbInstance;
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw error;
  }
};

// For backward compatibility, but use getDb() where possible
export const db = new Proxy({} as any, {
  get(target, prop) {
    throw new Error(`Top-level 'db' is no longer supported. Use 'await getDb()' instead. Property accessed: ${String(prop)}`);
  }
});

export async function upsertUser(user: Partial<schema.InsertUser> & { openId: string }) {
  const db = await getDb();
  const existingUser = await getUserByOpenId(user.openId);

  if (existingUser) {
    return await db
      .update(schema.users)
      .set({
        ...user,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.openId, user.openId));
  } else {
    return await db.insert(schema.users).values(user as schema.InsertUser);
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  const result = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.openId, openId))
    .limit(1);
  return result[0] ?? null;
}
