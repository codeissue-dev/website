# Deployment

## Required environment variables

Application runtime:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_TRUST_HOST=true`
- `INTEGRATION_WEBHOOK_SECRET`

Unified backend integration:

- `BACKEND_API_URL`
- `WEBSITE_API_TOKEN`
- `BACKEND_WS_URL`
- `BACKEND_WS_TICKET_PATH`
- `ADMIN_DEMO_FALLBACK=false`

Backend-only runtime variables:

- `TELEGRAM_API_TOKEN`
- `REALTIME_SIGNING_SECRET`
- `BACKEND_ALLOWED_ORIGINS`
- `OUTBOX_LEASE_SECONDS`

Seed-only variables:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

Never expose database, backend, auth, or webhook credentials through `NEXT_PUBLIC_*` variables.

## Release sequence

1. Install locked dependencies with `npm ci`.
2. Run `npm run check`.
3. Build with `npm run build`.
4. Apply migrations with `npm --prefix ../backend run db:migrate` from a controlled release job. Do not run a competing website migration process.
5. Run the seed command only when development sample data or an initial administrator is required. The default workspace is created by migration.
6. Deploy the backend before the website when an API contract or additive schema change is involved.
7. Deploy the website.
8. Verify `/api/health`, backend `/health`, sign-in, issue intake, personal project reads, admin reads, Telegram webhook authentication, outbox claim/ack, and WebSocket ticket creation.

## Docker

```bash
docker build --target production -t codeissue-website:latest .
docker compose --profile tools run --rm migrate
docker run --rm -p 3000:3000 --env-file .env codeissue-website:latest
```

Docker Compose builds the sibling `../backend` package, points server-to-server HTTP traffic at `http://backend:8080`, and keeps the browser WebSocket endpoint separately configurable. The production image uses Next.js standalone output and runs as an unprivileged user. PostgreSQL data needs a persistent volume, independent backups, and a tested restore process.

## Vercel and Cloudflare

Deploy the website as a normal Next.js project on Vercel or another Node-compatible platform. Deploy `../backend` either as the NestJS container or with `npm run deploy:cloudflare`. The Cloudflare path provisions or reuses Hyperdrive, applies PostgreSQL migrations, supplies secrets through an ephemeral mode-0600 file, and deploys the Worker plus realtime Durable Object. The secrets file is deleted immediately after Wrangler exits.

Configure `BACKEND_API_URL` and `BACKEND_WS_URL` in the website environment after the backend URL is known. Preview and production environments require separate secrets and allowed origins.

## Rollback

Application rollback and database rollback are separate operations. Prefer forward-compatible migrations, deploy additive schema changes before dependent code, and remove old columns only after all running versions stop using them.
