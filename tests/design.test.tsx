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

  if (!channels || channels.length !== 3) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

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

test('primary action colors keep strong OLED contrast', async () => {
  const css = await readText('app/globals.css');
  const primary = css.match(/--primary:\s*(#[0-9a-f]{6})/i)?.[1];
  const foreground = css.match(/--primary-foreground:\s*(#[0-9a-f]{6})/i)?.[1];

  assert.ok(primary, 'Missing --primary color');
  assert.ok(foreground, 'Missing --primary-foreground color');
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
