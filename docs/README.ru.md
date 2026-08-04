# Краткое руководство

## Локальный запуск

```bash
cp .env.example .env
npm ci
npm run db:migrate
npm run db:seed
npm run dev
```

Нужны Node.js 22.22.1+ и PostgreSQL 18. Владелец входит на `/login` через `ADMIN_USERNAME` и `ADMIN_PASSWORD`. Пользовательская регистрация находится на `/register`, email не нужен. Создание продуктовой задачи находится на `/issues/new`.

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

Все тесты написаны на TypeScript/TSX и запускаются через `tests/index.ts`.

## Развертывание

Перед запуском новой версии примените Drizzle-миграции. Обязательно задайте `DATABASE_URL`, `AUTH_SECRET`, webhook-secret и адреса внешнего API/WebSocket backend. Для seed нужны `ADMIN_USERNAME` и `ADMIN_PASSWORD`. PostgreSQL должен использовать постоянный volume и отдельные резервные копии.

Подробности: [development.md](development.md), [deployment.md](deployment.md), [architecture.md](architecture.md).
