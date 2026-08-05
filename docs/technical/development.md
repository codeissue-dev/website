# Development

## Requirements

- Node.js 22.22.1 or newer
- npm 10.9 or newer
- PostgreSQL 18

## Setup

```bash
cp .env.example .env
npm ci
docker compose up -d postgres
npm run db:setup
npm run db:doctor
npm run dev
```

## Package layout rules

- Keep `app/**/page.tsx` and `app/**/layout.tsx` focused on authentication, data loading, localization, and screen composition.
- Put product-specific UI under `features/{feature}`.
- Export feature screens through a local `index.ts` public API.
- Put reusable primitives in `components/ui`, reusable form structure in `components/forms`, and cross-feature layout elements in `components/layout`.
- Put business rules and persistence orchestration in `lib`, not in React components.
- Never import from `app` inside `features`, `components`, `lib`, or `db`.

## Interface rules

- Use Tailwind CSS utilities in `className`.
- Use `font-sans` for interface text and `font-mono` only for technical identifiers.
- Do not add text smaller than `text-sm`.
- Keep focus states and semantic labels intact.
- Respect `prefers-reduced-motion` for animation.
- Prefer composition over large configurable components.

## Database changes

1. Edit `db/schema.ts`.
2. Run `npm run db:generate`.
3. Review the generated SQL.
4. Run `npm run db:migrate`.
5. Update seed data and tests when the schema contract changes.
6. Run `npm run db:doctor`.
7. Commit the schema and migration together.

See [Database operations](database.md) for Drizzle Studio and Docker password troubleshooting.

## Server actions

Feature-owned actions live beside the feature. Files under `app/**/actions.ts` are compatibility exports only. Actions must validate form data, authenticate the user, verify workspace access, and return stable error codes for localized UI handling.

## UI primitives

Build interactive controls from the local shadcn-style primitives in `components/ui`. The website currently standardizes buttons, badges, cards, panels, progress indicators, separators, and selects there. Feature components should compose those primitives instead of introducing one-off controls.

The locale control is intentionally implemented with `components/ui/select.tsx` rather than a native select so the trigger, option states, focus behavior, and flags render consistently across browsers.

## Turbopack root

`next.config.ts` pins `turbopack.root` to the website package working directory. This prevents Next.js from selecting an unrelated parent `package.json` when the website is checked out as a nested repository and remains compatible with the planned `apps/website` monorepo move.
