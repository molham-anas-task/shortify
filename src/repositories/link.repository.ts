import { db } from "../db";
import { clicks, links, savedLinks } from "../db/schema";
import { eq, sql, and } from "drizzle-orm";

export const createLink = async (data: typeof links.$inferInsert) => {
  return db.insert(links).values(data).returning();
};

export const getLinkByShortCode = async (code: string) => {
  return db.select().from(links).where(eq(links.shortCode, code)).limit(1);
};

export const getLinksByUserId = async (userId: number) => {
  return db.select().from(links).where(eq(links.userId, userId));
};

export const insertClick = async (linkId: number) => {
  return db.insert(clicks).values({ urlId: linkId });
};

export const getClickCountByLinkId = async (linkId: number) => {
  return db
    .select({ count: sql<number>`COUNT(*)` })
    .from(clicks)
    .where(eq(clicks.urlId, linkId));
};

export const getLinksWithClickCountByUserId = async (userId: number) => {
  return db
    .select({
      id: links.id,
      originalUrl: links.originalUrl,
      shortCode: links.shortCode,
      createdAt: links.createdAt,
      clickCount: sql<number>`COUNT(${clicks.id})`.as("clickCount"),
      isSaved: sql<boolean>`(${savedLinks.id} IS NOT NULL)`.as("isSaved"),
    })
    .from(links)
    .leftJoin(clicks, eq(links.id, clicks.urlId))
    .leftJoin(
      savedLinks,
      and(eq(savedLinks.linkId, links.id), eq(savedLinks.userId, userId)),
    )
    .where(eq(links.userId, userId))
    .groupBy(links.id, savedLinks.id);
};

export const deleteLinkById = async (linkId: number, userId: number) => {
  return db
    .delete(links)
    .where(and(eq(links.id, linkId), eq(links.userId, userId)));
};

export const getLinkById = async (linkId: number) => {
  const result = await db.select().from(links).where(eq(links.id, linkId)).limit(1);
  return result[0];
};
