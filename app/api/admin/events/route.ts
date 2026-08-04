import { getEvents } from '@/lib/admin-data';
import { getAdminSessionForApi } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await getAdminSessionForApi();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const requestedLimit = Number(url.searchParams.get('limit') ?? 100);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 250)
    : 100;
  const result = await getEvents(limit);

  return Response.json({
    events: result.data,
    fallback: result.fallback,
    fetchedAt: new Date().toISOString(),
  });
}
