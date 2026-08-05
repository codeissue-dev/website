import { brandConfig } from '@/lib/brand/config';

import type {
  ConversationSummary,
  EventSummary,
  IntegrationSummary,
  OrderSummary,
} from './types';

const now = Date.now();

export const fallbackConversations: ConversationSummary[] = [
  {
    id: 'demo-conversation-1',
    source: 'telegram',
    contact: 'Alex Morgan',
    subject: 'AI-assisted customer portal',
    preview: 'Can the first version be ready for internal review this month?',
    unreadCount: 2,
    status: 'open',
    assignedTo: `${brandConfig.name} admin`,
    lastMessageAt: new Date(now - 7 * 60_000).toISOString(),
  },
  {
    id: 'demo-conversation-2',
    source: 'discord',
    contact: 'northstar',
    subject: 'Marketplace MVP estimate',
    preview: 'I have the user flows and a rough data model ready.',
    unreadCount: 1,
    status: 'pending',
    assignedTo: null,
    lastMessageAt: new Date(now - 42 * 60_000).toISOString(),
  },
  {
    id: 'demo-conversation-3',
    source: 'email',
    contact: 'Mira Studio',
    subject: 'Internal automation system',
    preview: 'Sharing the updated scope and access requirements.',
    unreadCount: 0,
    status: 'open',
    assignedTo: `${brandConfig.name} admin`,
    lastMessageAt: new Date(now - 3 * 60 * 60_000).toISOString(),
  },
];

export const fallbackOrders: OrderSummary[] = [
  {
    id: 'demo-order-1',
    title: 'Customer operations portal',
    status: 'discovery',
    owner: `${brandConfig.name} admin`,
    currency: 'USD',
    valueCents: 1_800_000,
    updatedAt: new Date(now - 18 * 60_000).toISOString(),
  },
  {
    id: 'demo-order-2',
    title: 'Creator marketplace MVP',
    status: 'proposal',
    owner: null,
    currency: 'USD',
    valueCents: 2_400_000,
    updatedAt: new Date(now - 2 * 60 * 60_000).toISOString(),
  },
  {
    id: 'demo-order-3',
    title: 'Operations automation layer',
    status: 'active',
    owner: `${brandConfig.name} admin`,
    currency: 'EUR',
    valueCents: 3_200_000,
    updatedAt: new Date(now - 5 * 60 * 60_000).toISOString(),
  },
];

export const fallbackIntegrations: IntegrationSummary[] = [
  {
    id: 'telegram',
    provider: 'telegram',
    displayName: 'Telegram',
    status: 'connected',
    externalAccountId: '@codeissue_dev',
    lastEventAt: new Date(now - 7 * 60_000).toISOString(),
  },
  {
    id: 'discord',
    provider: 'discord',
    displayName: 'Discord',
    status: 'connected',
    externalAccountId: 'discord.gg/codeissue',
    lastEventAt: new Date(now - 22 * 60_000).toISOString(),
  },
  {
    id: 'email',
    provider: 'email',
    displayName: 'Outlook',
    status: 'planned',
    externalAccountId: 'codeissue@outlook.com',
    lastEventAt: null,
  },
  {
    id: 'instagram',
    provider: 'instagram',
    displayName: 'Instagram',
    status: 'planned',
    externalAccountId: '@codeissue.dev',
    lastEventAt: null,
  },
];

export const fallbackEvents: EventSummary[] = [
  {
    id: 'demo-event-1',
    source: 'telegram',
    eventType: 'message.received',
    status: 'processed',
    payload: {
      author: '@alexbuilds',
      conversation: 'AI-assisted customer portal',
    },
    receivedAt: new Date(now - 7 * 60_000).toISOString(),
  },
  {
    id: 'demo-event-2',
    source: 'backend-api',
    eventType: 'order.status_changed',
    status: 'processed',
    payload: { order: 'Operations automation layer', status: 'active' },
    receivedAt: new Date(now - 28 * 60_000).toISOString(),
  },
];
