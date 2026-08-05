import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const integrationStatusEnum = pgEnum('integration_status', [
  'connected',
  'degraded',
  'planned',
  'disabled',
]);
export const conversationStatusEnum = pgEnum('conversation_status', [
  'open',
  'pending',
  'resolved',
  'archived',
]);
export const messageDirectionEnum = pgEnum('message_direction', [
  'inbound',
  'outbound',
  'internal',
]);
export const orderStatusEnum = pgEnum('order_status', [
  'lead',
  'discovery',
  'proposal',
  'active',
  'review',
  'completed',
  'cancelled',
]);
export const eventStatusEnum = pgEnum('event_status', [
  'received',
  'processed',
  'failed',
  'ignored',
]);

export const users = pgTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    username: text('username').notNull(),
    email: text('email'),
    emailVerified: timestamp('email_verified', { mode: 'date' }),
    image: text('image'),
    passwordHash: text('password_hash'),
    role: userRoleEnum('role').notNull().default('user'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('users_username_unique').on(table.username),
    uniqueIndex('users_email_unique').on(table.email),
  ],
);

export const accounts = pgTable(
  'accounts',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
    index('accounts_user_id_idx').on(table.userId),
  ],
);

export const sessions = pgTable(
  'sessions',
  {
    sessionToken: text('session_token').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (table) => [index('sessions_user_id_idx').on(table.userId)],
);

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })],
);

export const authenticators = pgTable(
  'authenticators',
  {
    credentialID: text('credential_id').notNull().unique(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('provider_account_id').notNull(),
    credentialPublicKey: text('credential_public_key').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credential_device_type').notNull(),
    credentialBackedUp: boolean('credential_backed_up').notNull(),
    transports: text('transports'),
  },
  (table) => [primaryKey({ columns: [table.userId, table.credentialID] })],
);

export const workspaces = pgTable(
  'workspaces',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('workspaces_slug_unique').on(table.slug)],
);

export const workspaceMembers = pgTable(
  'workspace_members',
  {
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: userRoleEnum('role').notNull().default('user'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.workspaceId, table.userId] })],
);

export const integrations = pgTable(
  'integrations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    provider: text('provider').notNull(),
    displayName: text('display_name').notNull(),
    status: integrationStatusEnum('status').notNull().default('planned'),
    externalAccountId: text('external_account_id'),
    config: jsonb('config')
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    lastEventAt: timestamp('last_event_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('integrations_workspace_provider_unique').on(
      table.workspaceId,
      table.provider,
    ),
    index('integrations_status_idx').on(table.status),
  ],
);

export const contacts = pgTable(
  'contacts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    integrationId: uuid('integration_id').references(() => integrations.id, {
      onDelete: 'set null',
    }),
    externalId: text('external_id'),
    displayName: text('display_name').notNull(),
    email: text('email'),
    avatarUrl: text('avatar_url'),
    metadata: jsonb('metadata')
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('contacts_workspace_idx').on(table.workspaceId),
    uniqueIndex('contacts_integration_external_unique').on(
      table.integrationId,
      table.externalId,
    ),
  ],
);

export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    integrationId: uuid('integration_id').references(() => integrations.id, {
      onDelete: 'set null',
    }),
    contactId: uuid('contact_id').references(() => contacts.id, {
      onDelete: 'set null',
    }),
    externalThreadId: text('external_thread_id'),
    subject: text('subject').notNull(),
    status: conversationStatusEnum('status').notNull().default('open'),
    assignedToId: text('assigned_to_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    unreadCount: integer('unread_count').notNull().default(0),
    lastMessageAt: timestamp('last_message_at', { mode: 'date' })
      .notNull()
      .defaultNow(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('conversations_workspace_status_idx').on(
      table.workspaceId,
      table.status,
    ),
    index('conversations_last_message_idx').on(table.lastMessageAt),
    uniqueIndex('conversations_integration_thread_unique').on(
      table.integrationId,
      table.externalThreadId,
    ),
  ],
);

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    externalMessageId: text('external_message_id'),
    direction: messageDirectionEnum('direction').notNull(),
    authorName: text('author_name'),
    body: text('body').notNull(),
    payload: jsonb('payload')
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    sentAt: timestamp('sent_at', { mode: 'date' }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('messages_conversation_sent_idx').on(
      table.conversationId,
      table.sentAt,
    ),
    uniqueIndex('messages_conversation_external_unique').on(
      table.conversationId,
      table.externalMessageId,
    ),
  ],
);

export const orders = pgTable(
  'orders',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    conversationId: uuid('conversation_id').references(() => conversations.id, {
      onDelete: 'set null',
    }),
    ownerId: text('owner_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    requestedById: text('requested_by_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    title: text('title').notNull(),
    status: orderStatusEnum('status').notNull().default('lead'),
    currency: text('currency').notNull().default('USD'),
    valueCents: integer('value_cents'),
    summary: text('summary'),
    intake: jsonb('intake')
      .$type<Record<string, string>>()
      .notNull()
      .default({}),
    dueAt: timestamp('due_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('orders_workspace_status_idx').on(table.workspaceId, table.status),
  ],
);

export const integrationEvents = pgTable(
  'integration_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    integrationId: uuid('integration_id').references(() => integrations.id, {
      onDelete: 'set null',
    }),
    source: text('source').notNull(),
    eventType: text('event_type').notNull(),
    externalEventId: text('external_event_id'),
    status: eventStatusEnum('status').notNull().default('received'),
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull(),
    error: text('error'),
    receivedAt: timestamp('received_at', { mode: 'date' })
      .notNull()
      .defaultNow(),
    processedAt: timestamp('processed_at', { mode: 'date' }),
  },
  (table) => [
    index('integration_events_received_idx').on(table.receivedAt),
    uniqueIndex('integration_events_source_external_unique').on(
      table.source,
      table.externalEventId,
    ),
  ],
);

export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type IntegrationStatus =
  (typeof integrationStatusEnum.enumValues)[number];
export type ConversationStatus =
  (typeof conversationStatusEnum.enumValues)[number];
export type MessageDirection = (typeof messageDirectionEnum.enumValues)[number];
export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];
export type EventStatus = (typeof eventStatusEnum.enumValues)[number];
