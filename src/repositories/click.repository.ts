import { db } from "../db";
import { clicks } from "../db/schema";
import { eq } from "drizzle-orm";

export const createClick = async (data: typeof clicks.$inferInsert) => {
  return db.insert(clicks).values(data).returning();
};

export const getClicksByUrlId = async (urlId: number) => {
  return db.select().from(clicks).where(eq(clicks.urlId, urlId));
};
