export type ReplyDraft = {
  conversationId: string;
  body: string;
};

export function parseReplyDraft(input: {
  conversationId: FormDataEntryValue | null;
  body: FormDataEntryValue | null;
}): ReplyDraft {
  const conversationId = String(input.conversationId ?? '');
  const body = String(input.body ?? '').trim();

  if (!/^[0-9a-f-]{36}$/i.test(conversationId)) {
    throw new Error('Invalid conversation ID.');
  }
  if (!body || body.length > 10_000) {
    throw new Error('Reply must contain 1-10000 characters.');
  }

  return { conversationId, body };
}
