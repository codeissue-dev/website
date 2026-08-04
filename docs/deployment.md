# Deployment

## Docker image

Build the production stage and run migrations once before starting the application:

```bash
docker build --target production -t codeissue:latest .
docker compose --profile tools run --rm migrate
docker run --rm -p 3000:3000 --env-file .env codeissue:latest
```

The image uses Next.js standalone output and runs as an unprivileged user. PostgreSQL data must live on a persistent volume; back it up independently from the application container.

## Required production configuration

Set at minimum:

- `DATABASE_URL`
- `AUTH_SECRET` and `AUTH_TRUST_HOST=true`
- `INTEGRATION_WEBHOOK_SECRET`
- `BACKEND_API_URL`, `BACKEND_WS_URL`, and their server-only credentials when the external backend is enabled

`ADMIN_PASSWORD` is needed only when running the seed. Do not expose backend or webhook secrets through `NEXT_PUBLIC_*` variables.

## Release sequence

1. Build and test the exact commit: `npm ci && npm run check && npm run build`.
2. Apply migrations once from a controlled job.
3. Deploy the new application image.
4. Check `/api/health`, login, inbox reads, and WebSocket ticket creation.
5. Keep the previous image available for rollback; database rollback requires a separately reviewed migration.

For Vercel, deploy the Next.js application normally but keep PostgreSQL, channel workers, and the long-lived WebSocket server on external services. The browser connects through the short-lived ticket endpoint implemented by this app.
