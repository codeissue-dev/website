import assert from 'node:assert/strict';
import test from 'node:test';

import { contactEmail, domains, navigation, socials } from '../lib/site-data';

const expectedSocials = {
  discord: 'https://discord.gg/uckqayVRmy',
  github: 'https://github.com/codeissue-dev',
  telegram: 'https://t.me/codeissue_dev',
  youtube: 'https://youtube.com/@codeissue_dev',
  x: 'https://x.com/codeissue_dev',
  instagram: 'https://instagram.com/codeissue.dev',
  tiktok: 'https://www.tiktok.com/@codeissue',
  twitch: 'https://twitch.tv/codeissue',
  max: 'https://max.ru/channel_codeissue',
  linkedin: 'https://linkedin.com/in/codeissue',
} as const;

test('publishes every requested contact channel exactly once', () => {
  assert.equal(socials.length, 10);
  assert.equal(new Set(socials.map(({ id }) => id)).size, socials.length);
  assert.equal(new Set(socials.map(({ href }) => href)).size, socials.length);
  assert.deepEqual(
    Object.fromEntries(socials.map(({ id, href }) => [id, href])),
    expectedSocials,
  );
});

test('uses secure URLs and valid contact metadata', () => {
  for (const item of [...socials, ...domains]) {
    assert.match(item.href, /^https:\/\//);
  }

  assert.match(contactEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  assert.deepEqual(
    domains.map(({ href }) => href),
    ['https://codeissue.dev', 'https://codeissue.vercel.app'],
  );
});

test('keeps navigation anchors aligned with landing sections', () => {
  assert.deepEqual(
    navigation.map(({ id, href }) => [id, href]),
    [
      ['approach', '#approach'],
      ['process', '#process'],
      ['network', '#network'],
    ],
  );
});
