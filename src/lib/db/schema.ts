import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

import { ORDER_STATUSES } from "@/lib/orders/status";
import { USER_ROLES } from "@/lib/auth/roles";

/* -------------------------------------------------------------------------- */
/* Enums                                                                      */
/* -------------------------------------------------------------------------- */

export const userRoleEnum = pgEnum("user_role", USER_ROLES);
export const orderStatusEnum = pgEnum("order_status", ORDER_STATUSES);

/* -------------------------------------------------------------------------- */
/* Auth.js tables (shape required by @auth/drizzle-adapter) + local columns    */
/* -------------------------------------------------------------------------- */

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("email_verified", { withTimezone: true, mode: "date" }),
    image: text("image"),
    /** Null for accounts that never used the credentials provider. */
    passwordHash: text("password_hash"),
    role: userRoleEnum("role").notNull().default("CUSTOMER"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    index("users_role_created_at_idx").on(table.role, table.createdAt),
    check("users_email_lowercase", sql`"email" = lower("email")`),
  ],
);

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [
    primaryKey({
      name: "accounts_provider_provider_account_id_pk",
      columns: [table.provider, table.providerAccountId],
    }),
    index("accounts_user_id_idx").on(table.userId),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("session_token").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    expires: timestamp("expires", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [
    primaryKey({
      name: "verification_tokens_identifier_token_pk",
      columns: [table.identifier, table.token],
    }),
  ],
);

/* -------------------------------------------------------------------------- */
/* Orders                                                                     */
/* -------------------------------------------------------------------------- */

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Human-readable reference shown in the UI and in conversations. */
    reference: text("reference").notNull(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
    assignedExecutorId: uuid("assigned_executor_id").references(() => users.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    title: text("title").notNull(),
    detailedDescription: text("detailed_description").notNull(),
    problemStatement: text("problem_statement").notNull(),
    keyFeatures: text("key_features").notNull(),
    technicalPreferences: text("technical_preferences"),
    referenceLinks: text("reference_links"),
    desiredDeadline: date("desired_deadline", { mode: "string" }),
    status: orderStatusEnum("status").notNull().default("SUBMITTED"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    uniqueIndex("orders_reference_unique").on(table.reference),
    index("orders_customer_id_created_at_idx").on(table.customerId, table.createdAt),
    index("orders_assigned_executor_id_created_at_idx").on(
      table.assignedExecutorId,
      table.createdAt,
    ),
    index("orders_status_created_at_idx").on(table.status, table.createdAt),
    check(
      "orders_completed_at_matches_status",
      sql`("status" = 'COMPLETED') = ("completed_at" IS NOT NULL)`,
    ),
    check(
      "orders_executor_is_not_customer",
      sql`"assigned_executor_id" IS NULL OR "assigned_executor_id" <> "customer_id"`,
    ),
  ],
);

export const orderStatusEvents = pgTable(
  "order_status_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade", onUpdate: "cascade" }),
    /** Null only for the event that records the initial submission. */
    fromStatus: orderStatusEnum("from_status"),
    toStatus: orderStatusEnum("to_status").notNull(),
    changedById: uuid("changed_by_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("order_status_events_order_id_created_at_idx").on(
      table.orderId,
      table.createdAt,
    ),
  ],
);

export const orderMessages = pgTable(
  "order_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade", onUpdate: "cascade" }),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("order_messages_order_id_created_at_idx").on(table.orderId, table.createdAt),
    check("order_messages_body_length", sql`char_length("body") BETWEEN 1 AND 4000`),
  ],
);

/**
 * Read state per (order, user).
 *
 * A single row per participant is updated when they open a conversation, so
 * unread counts never require rewriting historical messages.
 */
export const orderReadReceipts = pgTable(
  "order_read_receipts",
  {
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade", onUpdate: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    lastReadAt: timestamp("last_read_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({
      name: "order_read_receipts_order_id_user_id_pk",
      columns: [table.orderId, table.userId],
    }),
    index("order_read_receipts_user_id_idx").on(table.userId),
  ],
);

/* -------------------------------------------------------------------------- */
/* Public content                                                             */
/* -------------------------------------------------------------------------- */

export const portfolioItems = pgTable(
  "portfolio_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    problem: text("problem").notNull(),
    solution: text("solution").notNull(),
    techStack: text("tech_stack")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    industry: text("industry"),
    projectUrl: text("project_url"),
    deliveryWeeks: integer("delivery_weeks"),
    sortOrder: integer("sort_order").notNull().default(0),
    published: boolean("published").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("portfolio_items_slug_unique").on(table.slug),
    index("portfolio_items_published_sort_order_idx").on(
      table.published,
      table.sortOrder,
    ),
    check(
      "portfolio_items_published_at_matches_published",
      sql`"published" = false OR "published_at" IS NOT NULL`,
    ),
    check(
      "portfolio_items_delivery_weeks_positive",
      sql`"delivery_weeks" IS NULL OR "delivery_weeks" > 0`,
    ),
  ],
);

export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorName: text("author_name").notNull(),
    authorRole: text("author_role"),
    company: text("company"),
    quote: text("quote").notNull(),
    rating: integer("rating"),
    /** Optional link to the delivered order the quote refers to. */
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    sortOrder: integer("sort_order").notNull().default(0),
    published: boolean("published").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("testimonials_published_sort_order_idx").on(table.published, table.sortOrder),
    check(
      "testimonials_published_at_matches_published",
      sql`"published" = false OR "published_at" IS NOT NULL`,
    ),
    check(
      "testimonials_rating_range",
      sql`"rating" IS NULL OR "rating" BETWEEN 1 AND 5`,
    ),
  ],
);

/* -------------------------------------------------------------------------- */
/* Row types                                                                  */
/* -------------------------------------------------------------------------- */

export type UserRow = typeof users.$inferSelect;
export type OrderRow = typeof orders.$inferSelect;
export type OrderStatusEventRow = typeof orderStatusEvents.$inferSelect;
export type OrderMessageRow = typeof orderMessages.$inferSelect;
export type PortfolioItemRow = typeof portfolioItems.$inferSelect;
export type TestimonialRow = typeof testimonials.$inferSelect;
