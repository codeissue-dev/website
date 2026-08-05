# Localization

## Runtime model

The website uses `next-i18next` without locale segments in URLs. The selected locale is stored in the `codeissue-locale` cookie. Server routes load the current dictionary through `getT('common')`; client controls change the cookie through `useChangeLanguage`.

## Canonical resources

The only runtime translation resources are:

```text
locales/en/common.json
locales/ru/common.json
```

`dictionaries/` and `app/i18n/locales/` are historical snapshot paths. They contain deprecation markers and must never be imported by runtime code.

Supported locale metadata lives in `lib/i18n/locales.ts`. Every interface uses the shared `components/i18n/locale-select.tsx` shadcn control.

## Branding in translated copy

Brand identity is configured in `lib/brand/config.ts`. The product name is always written as `codeissue`, including at the beginning of a sentence. Do not create localized variants or title-case the name.

Translated sentences may mention the product name, but shared labels, URLs, email addresses, workspace identity, and route destinations must come from the brand configuration.

## Editing copy

1. Add matching keys to both canonical locale files.
2. Keep both dictionary shapes identical.
3. Do not copy dictionaries into legacy directories.
4. Use plain double quotes and ordinary hyphens in public copy.
5. Run `npm run test` and `npm run docs:check`.
