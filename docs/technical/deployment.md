# Deployment

## Required environment variables

Application runtime:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_TRUST_HOST=true`
- `INTEGRATION_WEBHOOK_SECRET`

External NestJS backend integration:

- `BACKEND_API_URL`
- `BACKEND_API_TOKEN`
- `BACKEND_WS_URL`
- `BACKEND_WS_TICKET_PATH`
- `BACKEND_ALLOWED_ORIGINS` (backend runtime)

Seed-only variables:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

Never expose database, backend, auth, or webhook credentials through `NEXT_PUBLIC_*` variables.

## Release sequence

1. Install locked dependencies with `npm ci`.
2. Run `npm run check`.
3. Build with `npm run build`.
4. Apply Drizzle migrations from a controlled release job.
5. Run the seed command only when development sample data or an initial administrator is required. The default workspace is created by migration.
6. Deploy the application.
7. Verify `/api/health`, backend `/health`, sign-in, issue intake, admin reads, webhook authentication, backend proxying, and WebSocket ticket creation.

## Docker

```bash
docker build --target production -t codeissue-website:latest .
docker compose --profile tools run --rm migrate
docker run --rm -p 3000:3000 --env-file .env codeissue-website:latest
```

Docker Compose builds the sibling `../backend` package, points server-to-server HTTP traffic at `http://backend:8080`, and keeps the browser WebSocket endpoint separately configurable. The production image uses Next.js standalone output and runs as an unprivileged user. PostgreSQL data needs a persistent volume, independent backups, and a tested restore process.

## Vercel

Deploy the package as a normal Next.js project. Run migrations from CI or a controlled release job before new application code receives traffic. Keep PostgreSQL, provider workers, and any long-lived WebSocket server on services designed for those workloads. Vercel environment variables must be configured separately for preview and production environments.

## Rollback

Application rollback and database rollback are separate operations. Prefer forward-compatible migrations, deploy additive schema changes before dependent code, and remove old columns only after all running versions stop using them.
