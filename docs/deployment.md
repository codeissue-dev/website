# Deployment

## Required production configuration

Set at minimum:

- `DATABASE_URL`
- `AUTH_SECRET` and `AUTH_TRUST_HOST=true`
- `INTEGRATION_WEBHOOK_SECRET`
- `BACKEND_API_URL`, `BACKEND_WS_URL`, and their server-only credentials when the external backend is enabled

`ADMIN_USERNAME` and `ADMIN_PASSWORD` are needed only when running the seed. Public registration does not require email or an email provider.

## Release sequence

1. Install and verify the exact commit: `npm ci && npm run check && npm run build`.
2. Apply migrations once from a controlled job: `npm run db:migrate`.
3. Run `npm run db:seed` when the owner account or demo workspace must be initialized.
4. Deploy the application.
5. Check `/api/health`, `/register`, `/login`, `/issues/new`, admin reads, and WebSocket ticket creation.

## Docker

```bash
docker build --target production -t codeissue:latest .
docker compose --profile tools run --rm migrate
docker run --rm -p 3000:3000 --env-file .env codeissue:latest
```

The image uses Next.js standalone output and runs as an unprivileged user. PostgreSQL data must live on a persistent volume.

## Vercel

Deploy the Next.js application normally. Run Drizzle migrations from CI or a controlled deployment job before the new application version receives traffic. Keep PostgreSQL, channel workers, and the long-lived WebSocket server on external services. Do not expose backend, database, or webhook secrets through `NEXT_PUBLIC_*` variables.
