# codeissue website

Public site, Auth.js identity provider, personal project workspace, and
administrative UI for the codeissue order/message pool.

Operational orders, conversations, messages, integrations, and events are
owned by the sibling `@codeissue/backend`. The website accesses them through a
server-only trusted client; browser code never receives backend service tokens.

## Start locally

```bash
cp .env.example .env
npm ci
npm run docker:up
```

The Compose stack starts PostgreSQL, applies backend-owned migrations, starts
the NestJS pool, and then starts Next.js at `http://localhost:3000`.

Without Compose, run `npm run db:migrate && npm run start:dev` in `../backend`,
then `npm run dev` here. Seed the initial admin and workspace membership with
`npm run db:seed`.

## Cloudflare backend

From `../backend`:

```bash
npm ci
npm run deploy:cloudflare
```

Then configure the website server:

```text
BACKEND_API_URL=https://codeissue-backend.<account>.workers.dev
BACKEND_WS_URL=wss://codeissue-backend.<account>.workers.dev/ws
```

Use the same `WEBSITE_API_TOKEN` in the website and Worker secret store. The
website needs `TELEGRAM_API_TOKEN` only when its Telegram webhook adapter is
enabled. `REALTIME_SIGNING_SECRET` stays backend-only.

## Commands

```bash
npm run check
npm run db:migrate
npm run db:doctor && npm run db:studio
```

The backend owns migration history; the mirrored Drizzle schema remains for
Auth.js and inspection only.

- [User guides](docs/user/README.md)
- [Technical documentation](docs/technical/README.md)
- [Backend architecture and deployment](../backend/README.md)
