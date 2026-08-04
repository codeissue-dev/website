# Codeissue

Codeissue combines a bilingual product website with a username-based client intake flow and an authenticated operations workspace for orders, conversations, integrations, API traffic, and backend events.

## Quick start

Requirements: Node.js 22.22.1+, npm, and PostgreSQL 18.

```bash
cp .env.example .env
npm ci
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. The seeded owner signs in at `/login` with `ADMIN_USERNAME` and `ADMIN_PASSWORD` from `.env`. Public users register at `/register` without email and create a product issue at `/issues/new`.

Docker development:

```bash
cp .env.example .env
docker compose up --build
docker compose --profile tools run --rm seed
```

## Main commands

```bash
npm run dev          # Next.js development server
npm run check        # TypeScript, ESLint, and typed tests
npm run build        # production build
npm run db:generate  # create a Drizzle migration
npm run db:migrate   # apply committed migrations
npm run db:seed      # create/update the initial owner and demo data
```

## Main routes

- `/` - public website
- `/register` - username-only account creation
- `/login` - username and password sign-in
- `/issues/new` - authenticated product issue intake without email
- `/admin` - protected operations workspace
- `/admin/inbox`, `/admin/orders`, `/admin/integrations`, `/admin/events`
- `/api/health` - health check

## Project boundaries

- `app/` - routes, layouts, route handlers, and server actions
- `features/landing/` - server-rendered public sections and one browser motion boundary
- `components/auth/` and `components/issues/` - account and issue intake UI
- `app/globals.css` - Tailwind CSS v4 import, Geist font tokens, and minimal document rules
- `lib/ui/` - reusable Tailwind utility strings
- `lib/auth/` - username validation, password hashing, and access guards
- `lib/issues/` - issue intake validation
- `lib/admin/` - admin read models and fallback data
- `lib/integrations/` - normalized event contracts and ingestion service
- `lib/workspaces/` - tenant lookup and access checks
- `lib/backend/` - safe API/WebSocket bridge helpers
- `db/` and `drizzle/` - schema, client, and migrations
- `tests/` - TypeScript/TSX tests executed through Node + `tsx`

## Interface rules

The interface uses Tailwind CSS v4 utilities directly in React components. Geist is the default font, while `font-mono` maps to Geist Mono. The base canvas is `#000000`; interface text stays at 14px or larger, while form controls use 16px text. Motion is limited to reveal, scroll progress, process state, and parallax on supplied visual assets, with `prefers-reduced-motion` support.

See [development](docs/development.md), [deployment](docs/deployment.md), [architecture](docs/architecture.md), or the [Russian quick guide](docs/README.ru.md).
