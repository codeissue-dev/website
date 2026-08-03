# Codeissue landing page

An OLED-inspired landing page for the Codeissue developer network, built with Next.js 16, React 19, Tailwind CSS 4, and local shadcn/ui components.

## Highlights

- OLED-first visual system with true black surfaces and high-contrast cyan/violet accents.
- Native scroll progress, reveal, parallax, pointer glow, sticky storytelling, and 3D card interactions.
- Accessible motion behavior through `prefers-reduced-motion`.
- Responsive layouts for desktop, tablet, and mobile.
- Complete Codeissue domains, social channels, Discord invite, and email contact.
- shadcn/ui configured through `components.json` with local open-code primitives in `components/ui`.
- Dependency-free Node test suite for links, contacts, and landing-page content structure.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm test
npm run typecheck
npm run lint:check
npm run prettier:check
npm run build
```

The test suite uses Node's built-in test runner, so it does not add another test framework to the client bundle or dependency graph.

## Project structure

- `app/` — Next.js App Router entry points and global OLED theme.
- `components/landing-page.tsx` — interactive landing experience.
- `components/ui/` — local shadcn-style UI primitives.
- `lib/site-data.js` — navigation, manifesto, capability, domain, and social content.
- `tests/` — content and contact integrity tests.
