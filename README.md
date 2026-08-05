# codeissue website

The public website, personal project workspace, and administrative operations console for codeissue.

## Start locally

```bash
cp .env.example .env
npm ci
docker compose up -d postgres
npm run db:setup
npm run dev
```

Open `http://localhost:3000`.

## Useful commands

```bash
npm run check
npm run build
npm run db:doctor
npm run db:studio
```

If an existing Docker volume still uses an older PostgreSQL password:

```bash
npm run db:password:sync
```

## Documentation

- [User guides](docs/user/README.md)
- [Technical documentation](docs/technical/README.md)
