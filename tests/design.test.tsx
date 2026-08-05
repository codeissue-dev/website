import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';

import { SocialIcon } from '../components/social-icons';
import { socials } from '../lib/site-data';
import { assertFile, readText } from './helpers/project';

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
    readText('components/i18n/locale-select.tsx'),
    readText('app/[lang]/page.tsx'),
  ]);
  assert.match(config, /localeInPath:\s*false/);
  assert.match(config, /next-i18next\/proxy/);
  assert.match(proxy, /createProxy/);
  assert.match(switcher, /useChangeLanguage/);
  assert.match(switcher, /components\/ui\/select/);
  assert.match(switcher, /<SelectTrigger/);
  assert.doesNotMatch(switcher, /<select/);
  assert.match(switcher, /current\.flag/);
  assert.match(switcher, /option\.flag/);
  assert.match(legacyRoute, /redirect\('\/'\)/);
});

test('uses Geist, pure black surfaces, readable labels, and a compact hero', async () => {
  const [globals, layout, hero, landing] = await Promise.all([
    readText('app/globals.css'),
    readText('app/layout.tsx'),
    readText('features/landing/components/hero-content.tsx'),
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
  const [heroArt, heroOverview, processVisual, processTimeline, interactions] =
    await Promise.all([
      readText('features/landing/components/hero-art.tsx'),
      readText('features/landing/components/hero-issue-overview.tsx'),
      readText('features/landing/components/process-visual.tsx'),
      readText('features/landing/components/process-timeline.tsx'),
      readText('features/landing/hooks/use-landing-interactions.ts'),
    ]);

  assert.match(heroArt, /HeroIssueOverview/);
  assert.match(heroOverview, /next\/image/);
  assert.match(heroOverview, /editorial\/workflow-board\.webp/);
  assert.match(heroOverview, /BrandLogo/);
  assert.match(heroArt, /data-parallax/);
  assert.match(processVisual, /images\/process\//);
  assert.match(processVisual, /data-process-progress-indicator/);
  assert.match(processVisual, /Progress/);
  assert.match(processTimeline, /data-process-step/);
  assert.match(interactions, /pointermove/);
  assert.match(interactions, /IntersectionObserver/);
  assert.match(interactions, /--parallax-y/);
  assert.match(interactions, /data-process-progress-indicator/);
  assert.match(interactions, /processPercent/);
});

test('pins the workflow as a full-screen scroll narrative', async () => {
  const [section, visual, stages, interactions, strip] = await Promise.all([
    readText('features/landing/components/process-section.tsx'),
    readText('features/landing/components/process-visual.tsx'),
    readText('features/landing/components/process-stage-list.tsx'),
    readText('features/landing/hooks/use-landing-interactions.ts'),
    readText('features/landing/components/editorial-strip.tsx'),
  ]);

  assert.match(section, /lg:h-\[430vh\]/);
  assert.match(section, /lg:sticky lg:top-0/);
  assert.match(section, /lg:min-h-screen/);
  assert.match(visual, /editorial\/workflow-wall\.webp/);
  assert.match(visual, /editorial\/material-review\.webp/);
  assert.match(stages, /data-process-step/);
  assert.match(interactions, /rect\.height - window\.innerHeight/);
  assert.match(interactions, /setActiveProcessStep/);
  assert.match(strip, /editorial\/workflow-board\.webp/);
});

test('uses locally optimized editorial photography instead of avatar placeholders', async () => {
  const files = [
    'public/images/editorial/workflow-wall.webp',
    'public/images/editorial/workflow-board.webp',
    'public/images/editorial/material-review.webp',
    'docs/technical/assets.md',
  ];
  await Promise.all(files.map(assertFile));

  const [authPanel, approach, services] = await Promise.all([
    readText('features/auth/auth-side-panel.tsx'),
    readText('features/landing/components/approach-visual.tsx'),
    readText('features/landing/components/service-visual.tsx'),
  ]);
  const source = [authPanel, approach, services].join('\n');
  assert.match(source, /images\/editorial/);
  assert.doesNotMatch(source, /avatar\.png/);
});

test('ships an accessible mobile burger menu', async () => {
  const [header, mobile] = await Promise.all([
    readText('features/landing/components/site-header.tsx'),
    readText('features/landing/components/mobile-navigation.tsx'),
  ]);
  assert.match(header, /useState\(false\)/);
  assert.match(header, /aria-expanded=\{menuOpen\}/);
  assert.match(header, /aria-controls="mobile-navigation"/);
  assert.match(mobile, /h-\[calc\(100dvh-4rem\)\]/);
  assert.match(header, /event\.key === 'Escape'/);
});

test('uses a restrained Next and Vercel inspired interface system', async () => {
  const [globals, header, hero, authShell, adminLayout, panel] =
    await Promise.all([
      readText('app/globals.css'),
      readText('features/landing/components/site-header.tsx'),
      readText('features/landing/components/hero-art.tsx'),
      readText('features/auth/auth-shell.tsx'),
      readText('features/admin/shell/admin-shell.tsx'),
      readText('components/ui/panel.tsx'),
    ]);

  assert.match(globals, /--color-primary:\s*#ffffff/i);
  assert.match(globals, /--color-signal:\s*#8b5cf6/i);
  assert.match(header, /backdrop-blur-xl/);
  assert.match(hero, /HeroWorkspaceHeader/);
  assert.match(hero, /rounded-xl border border-white\/15/);
  assert.match(authShell, /max-w-5xl/);
  assert.match(adminLayout, /grid-cols-\[15rem_minmax\(0,1fr\)\]/);
  assert.match(panel, /rounded-xl border border-border bg-card/);
});

test('configures Turbopack for the website Git root', async () => {
  const config = await readText('next.config.ts');
  assert.match(config, /turbopack:\s*\{/);
  assert.match(config, /root:\s*process\.cwd\(\)/);
});

test('uses a shadcn locale select with one flag per visible option', async () => {
  const [localeSelect, selectPrimitive] = await Promise.all([
    readText('components/i18n/locale-select.tsx'),
    readText('components/ui/select.tsx'),
  ]);

  assert.match(localeSelect, /SelectTrigger/);
  assert.match(localeSelect, /SelectContent/);
  assert.match(localeSelect, /SelectItem/);
  assert.doesNotMatch(localeSelect, /<select/);
  assert.equal((localeSelect.match(/current\.flag/g) ?? []).length, 1);
  assert.equal((localeSelect.match(/option\.flag/g) ?? []).length, 1);
  assert.match(selectPrimitive, /role="combobox"/);
  assert.match(selectPrimitive, /role="listbox"/);
});

test('ships custom process artwork and branded app icons', async () => {
  const files = [
    'public/images/process/discovery.webp',
    'public/images/process/design.webp',
    'public/images/process/build.webp',
    'public/images/process/review.webp',
    'app/favicon.ico',
    'app/icon.png',
    'app/apple-icon.png',
  ];

  await Promise.all(files.map(assertFile));

  const processVisual = await readText(
    'features/landing/components/process-visual.tsx',
  );
  assert.match(processVisual, /FileTextIcon/);
  assert.match(processVisual, /CursorIcon/);
  assert.match(processVisual, /GitBranchIcon/);
  assert.match(processVisual, /ChartIcon/);
});

test('routes visible form controls through local shadcn primitives', async () => {
  const files = [
    'features/auth/login-form.tsx',
    'features/auth/register-form.tsx',
    'features/issues/components/issue-product-fields.tsx',
    'features/issues/components/issue-contact-fields.tsx',
    'features/admin/orders/new-order-menu.tsx',
    'features/admin/inbox/conversation-list.tsx',
    'features/admin/inbox/conversation-thread.tsx',
    'features/admin/events/event-stream-toolbar.tsx',
    'features/admin/shell/admin-account.tsx',
    'features/admin/integrations/integration-grid.tsx',
    'features/landing/components/site-header.tsx',
  ];
  const source = (await Promise.all(files.map(readText))).join('\n');

  assert.match(source, /components\/ui\/input/);
  assert.match(source, /components\/ui\/textarea/);
  assert.match(source, /components\/forms\/form-select/);
  assert.doesNotMatch(source, /<select/);
  assert.doesNotMatch(source, /<textarea/);
  assert.doesNotMatch(source, /<input(?![^>]*type="hidden")/);
  assert.doesNotMatch(source, /<button/);
});
