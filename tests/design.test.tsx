import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';

import { SocialIcon } from '../components/social-icons';
import { socials } from '../lib/site-data';
import { readText } from './helpers/project';

function relativeLuminance(hex: string) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );

  if (!channels || channels.length !== 3)
    throw new Error(`Invalid hex color: ${hex}`);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(first: string, second: string) {
  const brighter = Math.max(
    relativeLuminance(first),
    relativeLuminance(second),
  );
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (brighter + 0.05) / (darker + 0.05);
}

test('primary action colors keep strong contrast', async () => {
  const css = await readText('app/globals.css');
  const primary = css.match(/--color-primary:\s*(#[0-9a-f]{6})/i)?.[1];
  const foreground = css.match(
    /--color-primary-foreground:\s*(#[0-9a-f]{6})/i,
  )?.[1];
  assert.ok(primary);
  assert.ok(foreground);
  assert.ok(contrastRatio(primary, foreground) >= 7);
});

test('renders an SVG brand mark for every social destination', () => {
  for (const social of socials) {
    const markup = renderToStaticMarkup(
      <SocialIcon name={social.id} data-social={social.id} />,
    );
    assert.match(markup, /^<svg/);
    assert.match(markup, new RegExp(`data-social="${social.id}"`));
  }
});

test('keeps next-i18next in no-locale-path mode', async () => {
  const [config, proxy, switcher, legacyRoute] = await Promise.all([
    readText('i18n.config.ts'),
    readText('proxy.ts'),
    readText('features/landing/components/language-switch.tsx'),
    readText('app/[lang]/page.tsx'),
  ]);
  assert.match(config, /localeInPath:\s*false/);
  assert.match(config, /next-i18next\/proxy/);
  assert.match(proxy, /createProxy/);
  assert.match(switcher, /useChangeLanguage/);
  assert.match(legacyRoute, /redirect\('\/'\)/);
});

test('uses Geist, pure black surfaces, readable labels, and a compact hero', async () => {
  const [globals, layout, hero, landing] = await Promise.all([
    readText('app/globals.css'),
    readText('app/layout.tsx'),
    readText('features/landing/components/hero-section.tsx'),
    readText('features/landing/landing-page.tsx'),
  ]);

  assert.match(globals, /--color-background:\s*#000000/i);
  assert.match(globals, /--font-sans:\s*var\(--font-geist-sans\)/);
  assert.match(globals, /--font-mono:/);
  assert.match(layout, /Geist, Geist_Mono/);
  assert.match(hero, /text-\[clamp\(2\.55rem,6\.1vw,5\.4rem\)\]/);
  assert.match(landing, /bg-black[^"]*text-foreground/);

  const source = [globals, layout, hero, landing].join('\n');
  assert.doesNotMatch(source, /text-\[0\.[0-6][0-9]?rem\]/);
  assert.doesNotMatch(source, /text-xs/);
});

test('uses a transparent vector brand asset instead of a boxed bitmap', async () => {
  const [logo, mark] = await Promise.all([
    readText('components/brand/brand-logo.tsx'),
    readText('public/images/codeissue-mark.svg'),
  ]);

  assert.match(logo, /codeissue-mark\.svg/);
  assert.doesNotMatch(logo, /bg-black|border-border/);
  assert.match(mark, /^<svg/);
  assert.doesNotMatch(mark, /<rect/);
});

test('restores illustration, scroll reveal, pointer parallax, and process interaction', async () => {
  const [heroArt, process, interactions] = await Promise.all([
    readText('features/landing/components/hero-art.tsx'),
    readText('features/landing/components/process-section.tsx'),
    readText('features/landing/hooks/use-landing-interactions.ts'),
  ]);

  assert.match(heroArt, /next\/image/);
  assert.match(heroArt, /banner\.png/);
  assert.match(heroArt, /CodeIssueMark/);
  assert.match(heroArt, /data-parallax/);
  assert.match(process, /avatar\.png/);
  assert.match(process, /data-process-step/);
  assert.match(interactions, /pointermove/);
  assert.match(interactions, /IntersectionObserver/);
  assert.match(interactions, /--parallax-y/);
});

test('ships an accessible mobile burger menu', async () => {
  const header = await readText('features/landing/components/site-header.tsx');
  assert.match(header, /useState\(false\)/);
  assert.match(header, /aria-expanded=\{menuOpen\}/);
  assert.match(header, /aria-controls="mobile-navigation"/);
  assert.match(header, /h-\[calc\(100dvh-4rem\)\]/);
  assert.match(header, /event\.key === 'Escape'/);
});

test('uses a restrained Next and Vercel inspired interface system', async () => {
  const [globals, header, hero, authShell, adminLayout, panel] =
    await Promise.all([
      readText('app/globals.css'),
      readText('features/landing/components/site-header.tsx'),
      readText('features/landing/components/hero-art.tsx'),
      readText('components/auth/auth-shell.tsx'),
      readText('app/admin/layout.tsx'),
      readText('components/ui/panel.tsx'),
    ]);

  assert.match(globals, /--color-primary:\s*#ffffff/i);
  assert.match(globals, /--color-signal:\s*#8b5cf6/i);
  assert.match(header, /backdrop-blur-xl/);
  assert.match(hero, /codeissue\.dev\/issues\/001/);
  assert.match(hero, /rounded-xl border border-white\/15/);
  assert.match(authShell, /max-w-5xl/);
  assert.match(adminLayout, /grid-cols-\[15rem_minmax\(0,1fr\)\]/);
  assert.match(panel, /rounded-xl border border-border bg-card/);
});
