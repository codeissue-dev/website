export function orderTone(status: string) {
  if (status === 'active' || status === 'completed') return 'positive' as const;
  if (status === 'cancelled') return 'danger' as const;
  if (status === 'review' || status === 'proposal') return 'signal' as const;
  return 'warning' as const;
}

export function integrationTone(status: string) {
  if (status === 'connected') return 'positive' as const;
  if (status === 'degraded') return 'warning' as const;
  if (status === 'disabled') return 'danger' as const;
  return 'neutral' as const;
}
