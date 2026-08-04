# Development

## Local environment

1. Copy `.env.example` to `.env` and replace every placeholder secret.
2. Start PostgreSQL 18 locally or with `docker compose up postgres -d`.
3. Run `npm ci`, `npm run db:migrate`, `npm run db:seed`, then `npm run dev`.

The seed is idempotent. It updates the owner account identified by `ADMIN_USERNAME` and keeps the default workspace usable.

## Account and issue flow

- `/register` creates a user with a username, display name, and password. Email is not collected.
- The new user is added to the default Codeissue workspace as a viewer.
- `/issues/new` creates a lead order with the original brief, desired outcome, selected contact channel, and handle.
- Admin operators review these records in `/admin/orders`.

## Quality workflow

```bash
npm run test
npm run test:watch
npm run typecheck
npm run lint:check
npm run prettier:check
npm run check
```

Tests use `node:test` with the `tsx` loader. `tests/index.ts` is the single cross-platform entry point.

## Database changes

Edit `db/schema.ts`, then run:

```bash
npm run db:generate
npm run db:migrate
```

Commit both the schema change and generated files under `drizzle/`. The username and public issue intake changes live in `drizzle/0001_username_issue_intake.sql`.

## Styling and motion

Use Tailwind CSS v4 utilities in `className`. Keep shared tokens in `app/globals.css`, repeated utility groups in `lib/ui/styles.ts`, and browser behavior in `features/landing/hooks/use-landing-interactions.ts`. New text labels should not be smaller than `text-xs`. Every animation must remain usable with `prefers-reduced-motion`.
