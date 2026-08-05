import type { OrderStatus } from '@/db/schema';

export type PortalProject = {
  id: string;
  title: string;
  status: OrderStatus;
  summary: string | null;
  updatedAt: string;
  conversationId: string | null;
};

export type PortalMessage = {
  id: string;
  authorName: string | null;
  body: string;
  direction: 'inbound' | 'outbound' | 'internal';
  sentAt: string;
};

export type PortalProjectDetail = PortalProject & {
  messages: PortalMessage[];
};
