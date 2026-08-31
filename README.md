# codeissue

codeissue is a web platform for ordering custom software development. A visitor
reads what the studio does, browses published case studies and testimonials,
registers, submits a detailed project brief, then follows that project through a
real status timeline and an order-scoped realtime chat with the people building
it.

Three roles share one codebase:

| Role       | Can do                                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------------- |
| `CUSTOMER` | Submit briefs, read **only their own** projects, chat in their own projects, cancel or resume their own request |
| `EXECUTOR` | See **only assigned** projects, move them through allowed workflow steps, chat with the customer                |
| `ADMIN`    | See everything, assign executors, change status, manage people and roles, manage portfolio and testimonials     |

There is no AI service call anywhere in the product: the work is done by people,
so adding an AI API would have been decoration rather than a feature.

## Stack

- **Next.js 16** (App Router, React Server Components, Server Actions) and **React 19**
- **TypeScript** in strict mode (`noUncheckedIndexedAccess`, `verbatimModuleSyntax`, no `any`)
- **Auth.js / NextAuth v5** (`next-auth`) with the **Credentials** provider and `@auth/drizzle-adapter`
- **Drizzle ORM** over **PostgreSQL 18** through **node-postgres** (`pg`)
- **WebSockets** (`ws`) with PostgreSQL `LISTEN/NOTIFY` fan-out
- **Zod 4** for every untrusted input
- **Tailwind CSS 4**
- **ESLint 9** flat config with **typescript-eslint** (type-checked rules), **Prettier**
- **pnpm**, deployable to **Vercel** (Fluid compute, Hobby-plan compatible)

## Directory overview

```
src/
  app/
    (public)/            Landing page, /work portfolio index and case studies
    (auth)/              Sign in, register
    (app)/               Authenticated area: dashboard, orders, account, admin
    api/auth/[...nextauth]/   Auth.js route handlers
    api/realtime/        WebSocket endpoint (+ /ticket for the signed handshake)
    layout.tsx, error.tsx, not-found.tsx, robots.ts, sitemap.ts, icon.svg
  actions/               Server Actions: auth, orders, chat, content, users
  components/            UI primitives, landing sections, forms, order views
  content/               Public copy and navigation, kept out of the components
  styles/                Design system split by purpose (theme, base, motion)
  lib/
    auth/                roles, password hashing, RBAC helpers, session actor
    db/                  schema.ts + client.ts (the only Pool and Drizzle client)
    orders/              status machine, references, queries, mutations
    chat/                message queries and mutations
    content/             portfolio and testimonial queries/mutations
    realtime/            event contracts, tickets, hub, connection handling
    stats/               dashboard aggregates
    validation/          Zod schemas shared by forms, actions and scripts
    env.ts, errors.ts, logger.ts, utils.ts
server/realtime/standalone.ts   Local/self-hosted WebSocket gateway
scripts/                 migrate.ts, create-admin.ts
drizzle/                 Committed SQL migrations
tests/                   node:test unit tests
```

### Where a change belongs

- Wording for the public pages lives in `src/content/*`, so copy can change
  without touching a component.
- Layout primitives (`Container`, `Section`, `SectionSplit`) own the page rhythm;
  sections compose them instead of repeating max widths and padding.
- Styles are split by purpose in `src/styles/`: `theme.css` holds the tokens,
  `base.css` element defaults, `primitives.css` shared pieces,
  `public-site.css` the marketing surface, `refinements.css` the small touches
  layered on top, and `motion.css` every animation.
- `src/app/globals.css` is only an import manifest, so the load order of the
  design system stays readable.

## Security model

- Every private page resolves the session with `requireActorForPage()` /
  `requireRoleForPage()`; every mutation resolves it again with `requireActor()`.
  UI visibility is never an authorization decision.
- Order access is decided by `resolveOrderRole(actor, order)` in
  `src/lib/auth/rbac.ts`: administrators are global, a customer matches only
  their own `customerId`, an executor matches only `assignedExecutorId`.
- `loadOrderForActor()` is the single read path for one project. It returns
  `null` for anyone without a relationship, and the page renders `notFound()`,
  so guessing `/orders/CI-2026-XXXXXX` cannot confirm that another customer's
  project exists.
- Identity always comes from the session. No form or socket frame can supply a
  `customerId`, a `senderId` or a role.
- Passwords are hashed with `scrypt` (per-password salt, `timingSafeEqual`
  comparison). Password hashes never leave the data layer: queries select
  explicit columns, and the credentials path is the only reader.
- Sign-in failures are generic, and unknown emails still perform equivalent
  scrypt work so response timing does not disclose whether an account exists.
- Authenticated routes send `X-Robots-Tag: noindex` (see `next.config.ts`), and
  private pages are rendered dynamically, never cached across users.

## Order lifecycle

`src/lib/orders/status.ts` is the only place that defines legal movement:

```
SUBMITTED -> REVIEWING -> ACCEPTED -> IN_PROGRESS -> QUALITY_ASSURANCE -> COMPLETED
                     \        \            \--> WAITING_FOR_CUSTOMER --> IN_PROGRESS
                      \--> CANCELED (reopenable to REVIEWING by an admin)
```

Each transition declares which order-role may perform it, whether it needs an
assigned executor, whether a note is mandatory, and whether it is destructive.
`changeOrderStatus()` runs one transaction that re-reads the order `FOR UPDATE`,
re-validates the transition, updates the row, sets or clears `completedAt`,
appends an `order_status_events` row and emits the realtime notification. Status
history is data, not a UI artifact.

## Realtime architecture

The durable source of truth is PostgreSQL. WebSockets only accelerate delivery.

1. **Handshake.** The order page requests a ticket from `POST /api/realtime/ticket`.
   The ticket is an HMAC over `{userId, role, exp}` derived from `AUTH_SECRET`,
   valid for 60 seconds, and is the only credential the browser puts in a URL.
   On the same origin the session cookie is accepted as well.
2. **Authorization.** `subscribe` frames are authorized per order against
   Postgres with the same `resolveOrderRole()` rules the pages use. An
   unauthorized subscription is answered with an error frame, never with data.
3. **Persist first.** Chat messages and status events are written to Postgres
   inside a transaction. Only then is `pg_notify('codeissue_order_events', …)`
   issued, carrying identifiers and participant ids — never message content.
4. **Fan-out.** Each runtime instance keeps exactly one `LISTEN` connection (the
   hub). On notification it loads the authoritative row and pushes it to the
   local sockets that are both subscribed to that order and authorized for it.
   Nothing assumes that two instances share memory.
5. **Recovery.** The client reconnects with exponential backoff plus jitter
   (1s → 30s), then sends `backfill` with the timestamp of the newest event it
   already has. Missed messages and status events are replayed from Postgres and
   de-duplicated by event id. Notifications are treated as a wake-up signal, not
   as storage, so a dropped notification cannot lose data.
6. **Hygiene.** 30-second heartbeats with a 75-second timeout, 8 KiB client
   frames, 256 KiB socket payload limit, 20 subscriptions and 40 frames per 10
   seconds per connection, plus a visible connection-state indicator in the UI.

### Where the socket runs

- **Vercel:** `src/app/api/realtime/route.ts` uses
  `experimental_upgradeWebSocket()` from `@vercel/functions`. WebSocket support
  is in public beta and **requires Fluid compute to be enabled** for the
  project (it is available on Hobby). A connection is pinned to one instance and
  ends when the function reaches its maximum duration, which is exactly why
  automatic reconnect plus cursor backfill are part of the protocol rather than
  an afterthought.
- **Plain `next dev`:** `next dev` does not run the Vercel WebSocket upgrade
  path. Run `pnpm dev:realtime` (a standalone `ws` gateway that shares the same
  hub, ticket verification and authorization code) and point
  `NEXT_PUBLIC_REALTIME_URL` at `ws://localhost:8787`.
- **`vercel dev`** exercises the deployed code path locally; leave
  `NEXT_PUBLIC_REALTIME_URL` empty in that mode. `vercel dev` needs the Vercel
  CLI installed globally (`pnpm add -g vercel`); it is deliberately not a
  project dependency.
- **Self-hosting:** run `server/realtime/standalone.ts` behind TLS and set
  `NEXT_PUBLIC_REALTIME_URL=wss://…`.

If Fluid compute is unavailable, the app still works end to end: chat and status
changes are persisted through Server Actions and rendered on load. Only push
delivery degrades, and the indicator tells the user the connection is offline.

## PostgreSQL 18 setup

```bash
# macOS (Homebrew)
brew install postgresql@18 && brew services start postgresql@18

# Debian/Ubuntu (PGDG)
sudo apt install -y postgresql-18

# Docker
docker run --name codeissue-pg -e POSTGRES_PASSWORD=<password> \
  -e POSTGRES_DB=codeissue -p 5432:5432 -d postgres:18
```

Then create the role and database (skip when using the Docker command above):

```bash
createdb codeissue
psql -d codeissue -c "CREATE ROLE codeissue LOGIN PASSWORD '<password>';"
psql -d codeissue -c "GRANT ALL ON SCHEMA public TO codeissue;"
```

`gen_random_uuid()` is used for primary keys; it is built into PostgreSQL 13+,
so no extension is required.

## Environment variables

Copy `.env.example` to `.env.local` and fill it in. Nothing has a default
secret, and the app refuses to start without the required values.

| Variable                      | Required | Purpose                                                               |
| ----------------------------- | -------- | --------------------------------------------------------------------- |
| `DATABASE_URL`                | yes      | PostgreSQL 18 connection string used by `pg`                          |
| `AUTH_SECRET`                 | yes      | Auth.js signing secret (min. 32 chars) and realtime ticket key source |
| `DATABASE_SSL`                | no       | `require` for managed providers, `disable` locally (default)          |
| `DATABASE_POOL_MAX`           | no       | Max pooled connections per instance (1–50, default 3)                 |
| `NEXT_PUBLIC_SITE_URL`        | no       | Canonical origin for metadata, sitemap, robots                        |
| `NEXT_PUBLIC_REALTIME_URL`    | no       | External WebSocket gateway; empty means same-origin `/api/realtime`   |
| `REALTIME_PORT`               | no       | Port for `pnpm dev:realtime` (default 8787)                           |
| `NEXT_PUBLIC_BRAND_LOGO_PATH` | no       | Path to a custom logo in `public/`; empty renders the text wordmark   |
| `ADMIN_PASSWORD`              | no       | Read by `pnpm admin:create` instead of prompting                      |

Generate a secret with `openssl rand -base64 33`.

## Installation

```bash
pnpm install
cp .env.example .env.local   # then edit it
```

> `pnpm-lock.yaml` is **not** included in this archive: the environment this
> repository was generated in had no network access, so no lockfile could be
> resolved honestly. The first `pnpm install` creates it from `package.json`;
> commit it immediately afterwards so builds become reproducible.

## Migrations

SQL migrations live in `drizzle/` and are committed. Apply them with:

```bash
set -a && . ./.env.local && set +a   # drizzle and the scripts read the shell env
pnpm db:migrate
```

`scripts/migrate.ts` applies each `drizzle/*.sql` file once, in filename order,
inside a transaction, and records the file name with a SHA-256 checksum in
`codeissue_migrations`. Editing an already-applied file stops the next run
instead of letting the schema drift.

For schema changes, edit `src/lib/db/schema.ts` and run `pnpm db:generate`
(drizzle-kit). Review the emitted SQL, commit it, then run `pnpm db:migrate`.
Because the baseline migration in this archive was written by hand rather than
by drizzle-kit, drizzle-kit has no snapshot of it: the first `pnpm db:generate`
will therefore restate objects that already exist. Delete that first output and
let drizzle-kit re-run against the schema, or write the incremental migration
yourself; every later `generate` diffs normally from the snapshot it just wrote.
`pnpm db:studio` opens Drizzle Studio against `DATABASE_URL`.

## Local development

```bash
# Terminal 1 — app
pnpm dev

# Terminal 2 — realtime gateway (needed with plain `next dev`)
pnpm dev:realtime
# with NEXT_PUBLIC_REALTIME_URL=ws://localhost:8787 in .env.local
```

Or exercise the production socket path locally with `pnpm dev:vercel`
(`vercel dev`, Vercel CLI installed globally) and an empty
`NEXT_PUBLIC_REALTIME_URL`.

## Creating the first administrator

No administrator ships with the code, and no default credentials exist anywhere.
Register normally through the UI, then promote that account:

```bash
set -a && . ./.env.local && set +a
pnpm admin:create --email you@example.com --name "Your Name"
```

If the email already exists the account is promoted to `ADMIN`. Otherwise the
script creates the administrator and asks for a password (or reads
`ADMIN_PASSWORD`). The password is validated with the same Zod rules as
registration and is never printed or logged.

## Production build

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start
```

`next build` never connects to PostgreSQL: the pool is created lazily on first
query, private pages are dynamic, and public pages that read the database are
marked `force-dynamic`.

## Vercel deployment

1. Import the repository and keep the defaults (`pnpm install`, `pnpm build`).
2. Add `DATABASE_URL`, `AUTH_SECRET` and, for a managed database,
   `DATABASE_SSL=require`. Set `DATABASE_POOL_MAX` to a small number — every
   instance owns its own pool — and prefer your provider's pooled connection
   string.
3. Enable **Fluid compute** for the project. It is required for WebSocket
   support and is available on Hobby. Leave `NEXT_PUBLIC_REALTIME_URL` empty so
   the browser connects to `/api/realtime` on the same origin.
4. Run `pnpm db:migrate` against the production database (locally with the
   production `DATABASE_URL`, or from CI). Migrations are never executed by the
   application at runtime.
5. Create your administrator with `pnpm admin:create` using the production
   `DATABASE_URL`.

## Pooling notes

`src/lib/db/client.ts` is the only module that constructs a `pg.Pool` and the
only module that calls `drizzle()`. `getDb()` is a lazy accessor: the pool is
created on first use, cached on `globalThis` so hot reload and repeated Lambda
invocations reuse it, and never opened during module evaluation. Auth.js uses
the same instance — `DrizzleAdapter(getDb(), { …tables })` — so there is exactly
one client for authentication and application queries.

Keep `DATABASE_POOL_MAX` small (default 3) on serverless platforms: the number
of runtime instances multiplies it. The realtime hub adds one dedicated
long-lived client per instance for `LISTEN`, taken outside the pool so a
listening connection can never starve request handling.

## Commands

| Command             | What it does                               |
| ------------------- | ------------------------------------------ |
| `pnpm dev`          | Next.js dev server                         |
| `pnpm dev:realtime` | Standalone WebSocket gateway for local dev |
| `pnpm dev:vercel`   | `vercel dev` (global Vercel CLI required)  |
| `pnpm build`        | Production build                           |
| `pnpm start`        | Serve the production build                 |
| `pnpm typecheck`    | `tsc --noEmit`                             |
| `pnpm lint`         | `eslint . --max-warnings=0`                |
| `pnpm format`       | `prettier --write .`                       |
| `pnpm format:check` | `prettier --check .`                       |
| `pnpm test`         | `node --test` unit tests                   |
| `pnpm db:generate`  | drizzle-kit: generate SQL from the schema  |
| `pnpm db:migrate`   | Apply committed SQL migrations             |
| `pnpm db:studio`    | Drizzle Studio                             |
| `pnpm admin:create` | Create or promote an administrator         |

## Tests

`pnpm test` runs `node:test` unit tests over the parts where a mistake is a
security or data-integrity bug and no database is needed: password hashing and
verification, the RBAC matrix, the status machine, realtime frame contracts,
realtime ticket signing and expiry, order references, and the Zod schemas that
guard every form and query string.

## Branding

The wordmark is text (`codeissue`), so there is no image to break. Drop a file
into `public/` and set `NEXT_PUBLIC_BRAND_LOGO_PATH=/brand/logo.svg` to replace
it. `src/app/icon.svg` is a deliberately minimal favicon placeholder — replacing
that one file replaces the favicon everywhere.
