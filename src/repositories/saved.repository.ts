import { db } from "../db";
import { savedLinks, clicks, links } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";

export const saveLink = async (userId: number, linkId: number) => {
  return db.insert(savedLinks).values({ userId, linkId }).returning();
};

export const unsaveLink = async (userId: number, linkId: number) => {
  return db
    .delete(savedLinks)
    .where(and(eq(savedLinks.userId, userId), eq(savedLinks.linkId, linkId)));
};

export const isLinkSaved = async (userId: number, linkId: number) => {
  const result = await db
    .select()
    .from(savedLinks)
    .where(and(eq(savedLinks.userId, userId), eq(savedLinks.linkId, linkId)))
    .limit(1);
  return result.length > 0;
};

export const getSavedLinksByUserId = async (userId: number) => {
  return db.select().from(savedLinks).where(eq(savedLinks.userId, userId));
};

export const getSavedLinksWithClickCountByUserId = async (userId: number) => {
  return db
    .select({
      id: links.id,
      originalUrl: links.originalUrl,
      shortCode: links.shortCode,
      createdAt: links.createdAt,
      clickCount: sql<number>`COUNT(${clicks.id})`.as("clickCount"),
    })
    .from(savedLinks)
    .innerJoin(links, eq(savedLinks.linkId, links.id))
    .leftJoin(clicks, eq(links.id, clicks.urlId))
    .where(eq(savedLinks.userId, userId))
    .groupBy(links.id);
};
