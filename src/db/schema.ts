import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  userName: varchar("userName", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const links = pgTable(
  "links",
  {
    id: serial("id").primaryKey(),
    originalUrl: text("original_url").notNull(),
    shortCode: varchar("short_code", { length: 7 }).notNull().unique(),
    userId: integer("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    shortCodeIdx: index("short_code_idx").on(table.shortCode),
  }),
);

export const clicks = pgTable("clicks", {
  id: serial("id").primaryKey(),
  urlId: integer("url_id")
    .references(() => links.id, { onDelete: "cascade" })
    .notNull(),
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
});

export const savedLinks = pgTable("saved_links", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  linkId: integer("link_id")
    .notNull()
    .references(() => links.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  links: many(links),
}));

export const linksRelations = relations(links, ({ one, many }) => ({
  user: one(users, {
    fields: [links.userId],
    references: [users.id],
  }),
  clicks: many(clicks),
}));

export const clicksRelations = relations(clicks, ({ one }) => ({
  link: one(links, {
    fields: [clicks.urlId],
    references: [links.id],
  }),
}));

export const savedLinksRelations = relations(savedLinks, ({ one }) => ({
  user: one(users, {
    fields: [savedLinks.userId],
    references: [users.id],
  }),
  link: one(links, {
    fields: [savedLinks.linkId],
    references: [links.id],
  }),
}));
