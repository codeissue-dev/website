# Краткое руководство

## Локальный запуск

```bash
cp .env.example .env
npm ci
npm run db:migrate
npm run db:seed
npm run dev
```

Нужны Node.js 22.22.1+ и PostgreSQL 18. После запуска откройте `http://localhost:3000`; вход для оператора находится на `/login`.

## Через Docker Compose

```bash
cp .env.example .env
docker compose up --build
docker compose --profile tools run --rm seed
```

## Проверки

```bash
npm run check
npm run prettier:check
npm run build
```

Все тесты находятся в `tests/`, написаны на TypeScript/TSX и запускаются через `tests/index.ts`.

## Развёртывание

Соберите production stage Dockerfile, один раз примените миграции и запустите контейнер с production `.env`. Обязательно задайте `DATABASE_URL`, `AUTH_SECRET`, webhook-secret и адреса внешнего API/WebSocket backend. PostgreSQL должен использовать постоянный volume и отдельные резервные копии.

Подробности: [development.md](development.md), [deployment.md](deployment.md), [architecture.md](architecture.md).
