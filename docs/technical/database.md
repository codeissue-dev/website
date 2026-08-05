# Database operations

## Configuration

`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `POSTGRES_PORT` configure Docker. `DATABASE_URL` configures Drizzle Kit, Drizzle Studio, scripts, and the application. Keep both representations synchronized.

The Drizzle configuration explicitly loads `.env.local` and `.env`. It does not fall back to a hidden development password.

## First setup

```bash
docker compose up -d postgres
npm run db:setup
npm run db:doctor
```

`db:setup` applies committed migrations and runs the idempotent development seed. The default workspace is created by migration and by an idempotent application bootstrap, so registration does not depend on demo data.

## Account roles

Migration `0003_account_roles_and_portal.sql` reduces the account role model to:

- `user` - personal workspace and own project discussions;
- `admin` - all user capabilities plus the operations console and admin APIs.

Legacy `owner`, `operator`, and `viewer` values are mapped during migration. Existing `owner`, `admin`, and `operator` accounts become `admin`; `viewer` becomes `user`.

`users.role` is the authentication role. `workspace_members.role` uses the same enum for membership records. Never authorize an admin route only from a client-side condition.

## Project ownership and discussions

`orders.requested_by_id` identifies the user who created the project request. Personal queries must filter by this column. `orders.conversation_id` links a project to its shared discussion. Intake creates the project, conversation, and first message transactionally.

## Drizzle Studio

```bash
npm run db:studio
```

The command runs `db:doctor` first and starts Studio on port 4984.

## Password authentication failures

The PostgreSQL Docker image reads `POSTGRES_PASSWORD` only while initializing a new volume. Editing `.env` later does not change the password stored inside an existing database.

Keep the data and synchronize the role password:

```bash
npm run db:password:sync
npm run db:doctor
```

Delete disposable local data and create a new volume:

```bash
docker compose down -v
docker compose up -d postgres
npm run db:setup
```

The second option is destructive.

## Production

Apply migrations from a controlled release job. Do not run password synchronization or destructive volume commands against production. Store `DATABASE_URL` in the deployment secret manager and use a dedicated database role with minimum required privileges.
