import assert from 'node:assert/strict';
import test from 'node:test';

import {
  contactEmail,
  domains,
  navigation,
  principles,
  socials,
} from '../lib/site-data.js';

test('publishes every requested contact channel once', () => {
  assert.equal(socials.length, 10);
  assert.equal(new Set(socials.map(({ href }) => href)).size, socials.length);
  assert.deepEqual(
    socials.filter(({ featured }) => featured).map(({ name }) => name),
    ['Discord', 'GitHub'],
  );
});

test('uses secure external URLs and valid contact metadata', () => {
  for (const item of [...socials, ...domains]) {
    assert.match(item.href, /^https:\/\//);
  }

  assert.match(contactEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  assert.ok(domains.some(({ href }) => href === 'https://codeissue.dev'));
});

test('keeps landing-page anchors and narrative ordered', () => {
  assert.deepEqual(
    navigation.map(({ href }) => href),
    ['#manifesto', '#stack', '#network'],
  );
  assert.deepEqual(
    principles.map(({ index }) => index),
    ['01', '02', '03'],
  );
});
