import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { socials } from '../lib/site-data.js';

const readDictionary = async (locale) =>
  JSON.parse(
    await readFile(
      new URL(`../app/i18n/locales/${locale}/common.json`, import.meta.url),
    ),
  );

function valueShape(value) {
  if (Array.isArray(value)) return value.map(valueShape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, valueShape(child)]),
    );
  }
  return typeof value;
}

test('English and Russian dictionaries have the same complete shape', async () => {
  const [english, russian] = await Promise.all([
    readDictionary('en'),
    readDictionary('ru'),
  ]);

  assert.deepEqual(valueShape(russian), valueShape(english));
});

test('keeps the approved positioning at the center of both locales', async () => {
  const [english, russian] = await Promise.all([
    readDictionary('en'),
    readDictionary('ru'),
  ]);

  assert.equal(english.hero.lineOne, 'Every idea starts as an issue.');
  assert.equal(english.hero.lineTwo, 'We turn yours into a working product.');
  assert.equal(english.approach.title, 'Your idea. Our next issue.');
  assert.equal(
    english.approach.description,
    'We design and build digital products using AI-assisted workflows, custom systems, and human review.',
  );

  assert.match(russian.hero.lineOne, /Каждая идея/);
  assert.match(russian.approach.title, /Ваша идея/);
});

test('translates the ecosystem workspace and every social link', async () => {
  const [english, russian] = await Promise.all([
    readDictionary('en'),
    readDictionary('ru'),
  ]);
  const socialIds = socials.map(({ id }) => id).sort();

  assert.deepEqual(Object.keys(english.network.socials).sort(), socialIds);
  assert.deepEqual(Object.keys(russian.network.socials).sort(), socialIds);
  assert.equal(english.admin.navigation.events, 'Event stream');
  assert.equal(russian.admin.navigation.events, 'Поток событий');
  assert.ok(english.auth.title.length > 10);
  assert.ok(russian.auth.title.length > 10);
});
