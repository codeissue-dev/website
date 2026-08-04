export const contactChannels = [
  'telegram',
  'discord',
  'max',
  'instagram',
  'x',
  'other',
] as const;

export function formatContactChannel(
  channel: (typeof contactChannels)[number],
) {
  if (channel === 'x') return 'X';
  if (channel === 'max') return 'MAX';
  return channel[0].toUpperCase() + channel.slice(1);
}
