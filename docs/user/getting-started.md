# Getting started

## Node.js

```bash
cp .env.example .env
npm ci
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Docker Compose

```bash
cp .env.example .env
docker compose up --build
docker compose --profile tools run --rm seed
```

The seeded owner signs in at `/login` with `ADMIN_USERNAME` and `ADMIN_PASSWORD`. Public accounts are created at `/register` with a username and password. Email is not required.
