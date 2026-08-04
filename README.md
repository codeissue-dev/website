# Codeissue

Codeissue combines a bilingual public website with an authenticated operations workspace for orders, conversations, integrations, API traffic, and backend events.

## Quick start

Requirements: Node.js 22.22.1+, npm, and PostgreSQL 18.

```bash
cp .env.example .env
npm ci
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`; the seeded operator signs in at `/login` with `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`.

Docker development:

```bash
cp .env.example .env
docker compose up --build
docker compose --profile tools run --rm seed
```

## Main commands

```bash
npm run dev          # Next.js development server
npm run check        # types, ESLint, and typed tests
npm run build        # production build
npm run db:generate  # create a Drizzle migration
npm run db:migrate   # apply committed migrations
npm run db:seed      # create/update the initial owner and demo data
```

## Project boundaries

- `app/` — routes, layouts, route handlers, and server actions
- `features/landing/` — server-rendered public sections and a minimal browser interaction boundary
- `app/globals.css` — Tailwind CSS v4 import and the small shared token layer
- `lib/ui/` — reusable Tailwind utility strings for layout, fields, and motion
- `components/` — shared UI and admin components
- `lib/admin/` — admin read models and fallback data
- `lib/integrations/` — normalized event contracts and ingestion service
- `lib/workspaces/` — tenant lookup and access checks
- `lib/backend/` — safe API/WebSocket bridge helpers
- `db/` and `drizzle/` — schema, client, and migrations
- `tests/` — TypeScript/TSX tests executed through Node + `tsx`

Useful routes: `/`, `/login`, `/admin`, `/admin/inbox`, `/admin/orders`, `/admin/integrations`, `/admin/events`, and `/api/health`.

See [development](docs/development.md), [deployment](docs/deployment.md), [architecture](docs/architecture.md), or the [Russian quick guide](docs/README.ru.md).

## Interface styling

The interface uses Tailwind CSS v4 utilities directly in React components. `app/globals.css` is intentionally small: it imports Tailwind, declares shared theme tokens, and contains only document-level base rules. Repeated utility groups live in `lib/ui/styles.ts`; the files under `styles/` remain compatibility placeholders and are not imported.

The visual system is shared by the landing page, authentication flow, and operations workspace: graphite surfaces, warm white typography, a cobalt signal color, thin routing lines, and clipped issue artifacts. New UI should extend these tokens instead of introducing page-specific CSS.
