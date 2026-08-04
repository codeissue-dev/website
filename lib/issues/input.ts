export const contactChannels = [
  'telegram',
  'discord',
  'max',
  'instagram',
  'x',
  'other',
] as const;

export type ContactChannel = (typeof contactChannels)[number];

export type IssueDraft = {
  title: string;
  projectType: string;
  brief: string;
  desiredOutcome: string;
  contactChannel: ContactChannel;
  contactHandle: string;
  budgetRange: string;
};

function text(value: unknown) {
  return String(value ?? '').trim();
}

export function parseIssueDraft(input: Record<string, unknown>): IssueDraft {
  const title = text(input.title);
  const projectType = text(input.projectType);
  const brief = text(input.brief);
  const desiredOutcome = text(input.desiredOutcome);
  const contactChannel = text(input.contactChannel) as ContactChannel;
  const contactHandle = text(input.contactHandle);
  const budgetRange = text(input.budgetRange);

  if (title.length < 3 || title.length > 160) throw new Error('invalid_title');
  if (projectType.length < 2 || projectType.length > 80)
    throw new Error('invalid_project_type');
  if (brief.length < 30 || brief.length > 5000)
    throw new Error('invalid_brief');
  if (desiredOutcome.length < 10 || desiredOutcome.length > 2000)
    throw new Error('invalid_outcome');
  if (!contactChannels.includes(contactChannel))
    throw new Error('invalid_contact_channel');
  if (contactHandle.length < 2 || contactHandle.length > 120)
    throw new Error('invalid_contact_handle');
  if (budgetRange.length > 80) throw new Error('invalid_budget');

  return {
    title,
    projectType,
    brief,
    desiredOutcome,
    contactChannel,
    contactHandle,
    budgetRange,
  };
}
