import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";
import { ENV } from "./_core/env";
import { eq } from "drizzle-orm";

if (!ENV.databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const connection = await mysql.createConnection(ENV.databaseUrl);
export const db = drizzle(connection, { schema, mode: "default" });

export async function upsertUser(user: Partial<schema.InsertUser> & { openId: string }) {
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
  const result = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.openId, openId))
    .limit(1);
  return result[0] ?? null;
}
