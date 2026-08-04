# Localization

## Runtime model

The website uses `next-i18next` without locale segments in URLs. The selected locale is stored in the `codeissue-locale` cookie. Server routes load the current dictionary through `getT('common')`; client controls change the cookie through `useChangeLanguage`.

## Locale metadata

Supported locale metadata lives in `lib/i18n/locales.ts`. Each option contains:

- the stable locale value;
- the human-readable label;
- the leading flag shown by the shared select;
- the HTML language value.

All interfaces use `components/i18n/locale-select.tsx`. Do not create feature-specific language buttons.

## Translation resources

Active resources live in:

```text
locales/en/common.json
locales/ru/common.json
```

The files under `dictionaries/` are compatibility copies retained for snapshot continuity.

## Adding or changing copy

1. Add matching keys to both active locale files.
2. Keep both dictionary shapes identical.
3. Update compatibility copies when their content is touched.
4. Use plain double quotes and ordinary hyphens in public copy.
5. Run `npm run test` and `npm run docs:check`.
