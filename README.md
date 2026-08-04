# Codeissue ecosystem foundation

Codeissue is no longer structured as a landing-only project. The public OLED website remains at `/`, while the same Next.js application now includes a protected operations workspace for orders, cross-channel conversations, integrations, API traffic, and live backend events.

## Stack

- Next.js 16 App Router and React 19
- next-i18next in cookie-based `localeInPath: false` mode
- Auth.js / NextAuth with credentials and optional GitHub OAuth
- Drizzle ORM with PostgreSQL 18
- Docker Compose for the application, database, migrations, and seed data
- Tailwind CSS 4 and local shadcn-style components
- Node test runner for architecture, security, i18n, contact, and design checks

## Product surfaces

- `/` — bilingual public website without locale prefixes
- `/login` — localized operator sign-in
- `/admin` — protected operational overview
- `/admin/inbox` — unified cross-channel inbox
- `/admin/orders` — order pipeline
- `/admin/integrations` — adapters and backend endpoints
- `/admin/events` — persisted API events and authenticated WebSocket monitor
- `/api/health` — database readiness check

## Start with Docker

```bash
cp .env.example .env
# Set AUTH_SECRET, ADMIN_PASSWORD, database and integration secrets.
docker compose up --build
```

In another terminal, create the initial owner and demo workspace:

```bash
docker compose --profile tools run --rm seed
```

Open `http://localhost:3000`. PostgreSQL 18 is exposed on port `5432` by default and stores data in the version-aware `/var/lib/postgresql/18/docker` layout.

## Start without Docker

Use Node.js 22.22.1 or newer and provide a PostgreSQL 18 database:

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

## Database workflow

```bash
npm run db:generate   # generate migrations from db/schema.ts
npm run db:migrate    # apply committed migrations
npm run db:push       # direct schema sync for local prototyping
npm run db:studio     # inspect the database
npm run db:seed       # idempotent owner/workspace/demo seed
```

The schema includes Auth.js tables plus users and roles, workspaces and memberships, integrations, contacts, conversations, messages, orders, and an append-only integration event log. External IDs have compound uniqueness constraints so webhook retries do not duplicate contacts, threads, or messages.

## Internationalization

The URL never contains a language segment. next-i18next selects `en` or `ru` from the `codeissue-locale` cookie and browser language, then the client switch updates the cookie without moving to another route.

- Configuration: `i18n.config.ts`
- Server helpers: `lib/i18n/server.ts`
- Translation bundles: `app/i18n/locales/{en,ru}/common.json`
- Proxy: `proxy.ts`

The old `/en` and `/ru` files are retained only as compatibility redirects to `/`.

## Authentication and roles

Auth.js is configured in `auth.ts` with the Drizzle adapter. Local operator accounts use scrypt password hashes; optional GitHub OAuth is enabled only when both GitHub environment variables are present.

Admin routes accept `owner`, `admin`, and `operator`. A `viewer` can authenticate but cannot enter the operations workspace. The seed command creates or updates the configured owner account and is safe to run repeatedly.

## Unified message ingestion

Channel adapters send normalized JSON to:

```text
POST /api/webhooks/{provider}
X-Codeissue-Webhook-Secret: <INTEGRATION_WEBHOOK_SECRET>
Content-Type: application/json
```

Example envelope:

```json
{
  "eventId": "telegram:update:4815",
  "eventType": "message.received",
  "occurredAt": "2026-08-04T10:30:00.000Z",
  "contact": {
    "externalId": "telegram:user:42",
    "displayName": "Alex",
    "email": "alex@example.com"
  },
  "thread": {
    "externalId": "telegram:chat:91",
    "subject": "New product request"
  },
  "message": {
    "externalId": "telegram:message:4815",
    "direction": "inbound",
    "authorName": "Alex",
    "text": "We need a customer operations portal."
  }
}
```

The route validates the envelope, records the raw event, upserts the integration and contact, opens or updates the conversation, inserts the message, and marks the event as processed in one transaction. Non-message events are still stored in the event log for a worker or backend service to process later.

## Backend API and WebSocket bridge

Authenticated operators can call external backend endpoints through:

```text
/api/admin/backend/[...path]
```

The browser's authorization header is never forwarded. The server injects the current Codeissue user ID and role, and optionally authenticates to the backend with `BACKEND_API_TOKEN`.

The event console does not expose a permanent WebSocket credential. On connect it calls `POST /api/admin/socket`. That protected route requests a short-lived ticket from `BACKEND_WS_TICKET_PATH`, appends it to `BACKEND_WS_URL`, and returns the one-time connection URL to the browser. The backend ticket endpoint should return:

```json
{
  "ticket": "short-lived-signed-ticket",
  "expiresAt": "2026-08-04T10:31:00.000Z"
}
```

Persisted events remain available through `GET /api/admin/events`, so the console still works as an API monitor when the WebSocket backend is offline.

## Environment

See `.env.example`. Important production values:

- `DATABASE_URL`
- `AUTH_SECRET`
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` for initial seeding
- `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` when GitHub OAuth is needed
- `BACKEND_API_URL` and `BACKEND_API_TOKEN`
- `BACKEND_WS_URL` and `BACKEND_WS_TICKET_PATH`
- `INTEGRATION_WEBHOOK_SECRET`

Never expose backend or webhook secrets through `NEXT_PUBLIC_*` variables.

## Quality checks

```bash
npm test
npm run typecheck
npm run lint:check
npm run prettier:check
npm run build
```

The source-level tests can run without the application dependencies installed. Type checking, linting, and the production build require a successful `npm install`.

More detail is available in [`docs/architecture.md`](docs/architecture.md).
