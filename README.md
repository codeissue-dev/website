# Codeissue landing page

OLED-first bilingual landing page for Codeissue, built with Next.js App Router, React, Tailwind CSS, and local shadcn-style open-code components.

## Positioning

The site is structured around two statements:

- “Every idea starts as an issue. We turn yours into a working product.”
- “Your idea. Our next issue.”

The visual system treats a product idea as an issue moving through definition, design, implementation, human review, and release. The interface intentionally avoids generic AI imagery and keeps the emphasis on product work, process, and accountability.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The request is redirected to `/en` or `/ru` using the saved language preference and the browser `Accept-Language` header.

## Quality checks

```bash
npm test
npm run typecheck
npm run lint:check
npm run prettier:check
npm run build
```

## Internationalization

- English copy: `dictionaries/en.json`
- Russian copy: `dictionaries/ru.json`
- Locale helpers: `lib/locales.ts`
- Locale-aware route: `app/[lang]/page.tsx`
- Browser-language redirect: `proxy.ts`

The language switch stores a `codeissue-locale` cookie and moves between `/en` and `/ru`. Localized metadata includes canonical and alternate-language URLs.

## Structure

- `components/landing-page.tsx` — page composition and scroll interactions
- `components/social-icons.tsx` — visual marks for every social destination
- `components/ui/` — local shadcn-style primitives
- `lib/site-data.js` — stable links, domains, and contact data
- `app/globals.css` — OLED visual system and responsive behavior
- `tests/` — contact, translation, route, icon, and contrast checks

## Motion and accessibility

The page uses intersection-based reveals, a scroll-driven process panel, subtle ticket parallax, and a reading-progress line. Motion is disabled when `prefers-reduced-motion` is enabled. Primary actions use an opaque high-contrast cyan surface rather than transparent glow-only styling.
