# Monorepo migration

The website is prepared to move from the repository root to `apps/website`.

## Current preparation

- The package is named `@codeissue/website`.
- Internal imports use the package-local `@/` alias.
- Features expose public `index.ts` entrypoints.
- Route pages import those entrypoints instead of feature internals.
- `npm run boundaries:check` prevents source modules from depending on `app`.
- Product code is separated into routes, features, shared components, domain services, database code, tests, and scripts.
- Environment access remains package-local.
- User and technical documentation remain package-local.

## Recommended target layout

```text
apps/
  website/
packages/
  ui/
  contracts/
  config-eslint/
  config-typescript/
```

## Migration steps

1. Add the workspace definition at the monorepo root.
2. Move this package to `apps/website` without changing its internal layout.
3. Move the lockfile and package manager configuration to the monorepo root.
4. Keep `@/` mapped to the website package root.
5. Update CI, Docker, and Vercel build contexts to `apps/website`.
6. Extract only code with at least two real consumers:
   - generic primitives to `packages/ui`;
   - normalized integration contracts to `packages/contracts`;
   - shared lint and TypeScript configuration to configuration packages.
7. Replace extracted dependencies with workspace protocol versions.
8. Add task orchestration after package boundaries are stable.

Do not extract feature-specific components only to increase the package count. A shared package must own a stable contract and have multiple consumers.
