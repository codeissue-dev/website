# Development

## Local environment

1. Copy `.env.example` to `.env` and replace every placeholder secret.
2. Start PostgreSQL 18 locally or with `docker compose up postgres -d`.
3. Run `npm ci`, `npm run db:migrate`, `npm run db:seed`, then `npm run dev`.

The seed is idempotent: rerunning it updates the owner account and keeps the demo workspace usable.

## Quality workflow

```bash
npm run test          # TypeScript and TSX tests
npm run test:watch    # watch mode
npm run typecheck
npm run lint:check
npm run prettier:check
npm run check         # typecheck + lint + tests
```

Tests use `node:test` with the `tsx` loader. `tests/index.ts` is the single cross-platform entry point, so no shell-specific glob expansion is required. The legacy `.test.mjs` files contain no executable tests and remain only as compatibility markers for snapshot updates.

## Database changes

Edit `db/schema.ts`, then run:

```bash
npm run db:generate
npm run db:migrate
```

Commit both the schema change and generated files under `drizzle/`. Use `db:push` only for disposable local prototypes.

## Integration testing

Normalized adapters call `POST /api/webhooks/{provider}` with `X-Codeissue-Webhook-Secret`. The expected envelope is documented in [architecture.md](architecture.md). Keep provider-specific signatures, retries, media downloads, and OAuth inside adapters or the external backend.

## Styling conventions

Use Tailwind CSS v4 utilities in `className` for component-level styling and responsive behavior. Add shared color or typography tokens in `app/globals.css`; place only genuinely repeated utility groups in `lib/ui/styles.ts`. Do not add new page-specific files under `styles/` - that directory is retained only for package compatibility.
