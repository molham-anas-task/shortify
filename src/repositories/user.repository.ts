import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const createUser = async (data: typeof users.$inferInsert) => {
  return db.insert(users).values(data).returning();
};

export const getUserByuserName = async (userName: string) => {
  return db.select().from(users).where(eq(users.userName, userName)).limit(1);
};

export const getUserById = async (id: number) => {
  return db.select().from(users).where(eq(users.id, id)).limit(1);
};
