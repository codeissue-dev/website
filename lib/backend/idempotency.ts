const requestIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function formRequestId(formData: FormData): string {
  const value = formData.get('requestId');
  if (typeof value !== 'string' || !requestIdPattern.test(value)) {
    throw new Error('invalid_request_id');
  }
  return value;
}

export function websiteIdempotencyKey(requestId: string): string {
  return `website:${requestId}`;
}
