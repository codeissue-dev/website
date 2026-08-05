# Codeissue Website

The public website and operations workspace for Codeissue.

## Local start

```bash
cp .env.example .env
npm ci
docker compose up -d postgres
npm run db:setup
npm run dev
```

Open `http://localhost:3000`.

## Database checks

```bash
npm run db:doctor
npm run db:studio
```

If Docker reports a password authentication error after `.env` changed:

```bash
npm run db:password:sync
```

## Documentation

- [User guides](docs/user/README.md)
- [Technical documentation](docs/technical/README.md)

## Main commands

```bash
npm run check
npm run build
npm run docker:up
```
