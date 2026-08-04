# Testing and quality gates

## Commands

```bash
npm run typecheck
npm run lint:check
npm run test
npm run docs:check
npm run boundaries:check
npm run prettier:check
npm run check
```

`npm run check` is the primary local and CI gate. All executable tests use TypeScript or TSX and are loaded from `tests/index.ts` through Node's test runner and `tsx`.

## Test responsibilities

- architecture tests protect feature boundaries, thin route composition, compatibility exports, and monorepo preparation;
- design tests protect localization controls, accessibility, typography, motion, and visual tokens;
- ecosystem tests protect authentication, database contracts, integration ingestion, and Docker configuration;
- regression tests protect previously fixed build, lint, and security failures;
- documentation checks ensure the maintained documentation set exists and is English-only.

Add a regression test whenever a production, CI, migration, or `afterApply` failure is fixed.
