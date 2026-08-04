import {
  getConversations,
  getEvents,
  getIntegrations,
  getOrders,
} from './queries';

export async function getOverview() {
  const [conversationResult, orderResult, integrationResult, eventResult] =
    await Promise.all([
      getConversations(6),
      getOrders(6),
      getIntegrations(),
      getEvents(12),
    ]);

  return {
    fallback:
      conversationResult.fallback ||
      orderResult.fallback ||
      integrationResult.fallback ||
      eventResult.fallback,
    metrics: {
      openConversations: conversationResult.data.filter(
        (item) => item.status !== 'resolved' && item.status !== 'archived',
      ).length,
      activeOrders: orderResult.data.filter(
        (item) => item.status !== 'completed' && item.status !== 'cancelled',
      ).length,
      connectedSources: integrationResult.data.filter(
        (item) => item.status === 'connected',
      ).length,
      eventsToday: eventResult.data.filter(
        (item) => Date.now() - new Date(item.receivedAt).getTime() < 86_400_000,
      ).length,
    },
    conversations: conversationResult.data,
    orders: orderResult.data,
    integrations: integrationResult.data,
    events: eventResult.data,
  };
}
