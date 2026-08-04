import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

import { socials } from '../lib/site-data.js';

function relativeLuminance(hex) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(first, second) {
  const brighter = Math.max(
    relativeLuminance(first),
    relativeLuminance(second),
  );
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (brighter + 0.05) / (darker + 0.05);
}

test('primary action colors keep strong OLED contrast', async () => {
  const css = await readFile(
    new URL('../app/globals.css', import.meta.url),
    'utf8',
  );
  const primary = css.match(/--primary:\s*(#[0-9a-f]{6})/i)?.[1];
  const foreground = css.match(/--primary-foreground:\s*(#[0-9a-f]{6})/i)?.[1];

  assert.ok(primary, 'Missing --primary color');
  assert.ok(foreground, 'Missing --primary-foreground color');
  assert.ok(contrastRatio(primary, foreground) >= 7);
});

test('provides a visual brand icon for every social destination', async () => {
  const icons = await readFile(
    new URL('../components/social-icons.tsx', import.meta.url),
    'utf8',
  );

  for (const { id } of socials) {
    assert.match(icons, new RegExp(`case '${id}'`));
  }
});

test('uses next-i18next in no-locale-path mode', async () => {
  const [config, proxy, landing, legacyRoute] = await Promise.all([
    readFile(new URL('../i18n.config.ts', import.meta.url), 'utf8'),
    readFile(new URL('../proxy.ts', import.meta.url), 'utf8'),
    readFile(
      new URL('../components/landing-page.tsx', import.meta.url),
      'utf8',
    ),
    readFile(new URL('../app/[lang]/page.tsx', import.meta.url), 'utf8'),
  ]);

  assert.match(config, /localeInPath:\s*false/);
  assert.match(config, /next-i18next\/proxy/);
  assert.match(proxy, /createProxy/);
  assert.match(landing, /useChangeLanguage/);
  assert.doesNotMatch(landing, /href={`\/${nextLocale}`}/);
  assert.match(legacyRoute, /redirect\('\/'\)/);

  await Promise.all([
    access(new URL('../app/page.tsx', import.meta.url)),
    access(new URL('../app/i18n/locales/en/common.json', import.meta.url)),
    access(new URL('../app/i18n/locales/ru/common.json', import.meta.url)),
  ]);
});
