# Database operations

## Configuration

Local database settings live in `.env`.

`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `POSTGRES_PORT` configure the Docker service. `DATABASE_URL` configures Drizzle Kit, Drizzle Studio, scripts, and the application. Keep both representations synchronized.

The Drizzle configuration explicitly loads `.env.local` and `.env`. It does not fall back to a hidden development password.

## First setup

```bash
docker compose up -d postgres
npm run db:setup
npm run db:doctor
```

`db:setup` applies migrations and runs the idempotent development seed. Migration `0002_default_workspace.sql` initializes the default workspace, so account registration does not depend on demo seed data.

## Drizzle Studio

```bash
npm run db:studio
```

The command runs `db:doctor` first and then starts Studio on port 4984.

## Password authentication failures

The official PostgreSQL image reads `POSTGRES_PASSWORD` only while initializing a new data volume. Editing `.env` later does not change the password stored inside an existing database.

Keep the data and synchronize the role password:

```bash
npm run db:password:sync
npm run db:doctor
```

Delete all local database data and initialize a new volume:

```bash
docker compose down -v
docker compose up -d postgres
npm run db:setup
```

The second option is destructive and should only be used for disposable local data.

## Registration and workspace bootstrap

The migration creates the default `codeissue` workspace. Registration also performs an idempotent workspace upsert before creating membership. This makes registration resilient when a database was migrated before the bootstrap migration existed.

## Production

Apply migrations from a controlled release job. Do not run password synchronization or destructive volume commands against production. Store `DATABASE_URL` in the deployment secret manager and use a dedicated database role with the minimum required privileges.
