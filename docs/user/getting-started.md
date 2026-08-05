# Getting started

## Local development

```bash
cp .env.example .env
npm ci
docker compose up -d postgres
npm run db:setup
npm run dev
```

Open `http://localhost:3000`.

Create a regular account at `/register` with a username and password. Email is not required. The seeded administrator uses `ADMIN_USERNAME` and `ADMIN_PASSWORD` from `.env`.

## Main areas

- `/dashboard` is the personal workspace for every signed-in user.
- `/issues/new` creates a project request and its discussion thread.
- `/admin` is available only to accounts with the `admin` database role.
