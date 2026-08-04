import type { IntegrationStatus, OrderStatus } from '@/db/schema';

export type DataResult<T> = {
  data: T;
  fallback: boolean;
};

export type ConversationSummary = {
  id: string;
  source: string;
  contact: string;
  subject: string;
  preview: string;
  unreadCount: number;
  status: string;
  assignedTo: string | null;
  lastMessageAt: string;
};

export type OrderSummary = {
  id: string;
  title: string;
  status: OrderStatus;
  owner: string | null;
  currency: string;
  valueCents: number | null;
  updatedAt: string;
};

export type IntegrationSummary = {
  id: string;
  provider: string;
  displayName: string;
  status: IntegrationStatus;
  externalAccountId: string | null;
  lastEventAt: string | null;
};

export type EventSummary = {
  id: string;
  source: string;
  eventType: string;
  status: string;
  payload: Record<string, unknown>;
  receivedAt: string;
};
