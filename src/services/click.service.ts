import { db } from "../db";
import { clicks } from "../db/schema";
import { eq, sql } from "drizzle-orm";

export class ClickService {
  static async createClick(urlId: number) {
    await db.insert(clicks).values({ urlId });
  }

  static async getClickCount(urlId: number) {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(clicks)
      .where(eq(clicks.urlId, urlId));

    return result[0].count;
  }
}
