# Codeissue Website

The public website and operations workspace for Codeissue.

## Local start

```bash
cp .env.example .env
npm ci
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Documentation

- [User guides](docs/user/README.md)
- [Technical documentation](docs/technical/README.md)

## Main commands

```bash
npm run check
npm run build
npm run docker:up
```
