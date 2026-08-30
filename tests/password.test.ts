import assert from "node:assert/strict";
import { test } from "node:test";

import {
  hashPassword,
  normalizeEmail,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  verifyPassword,
} from "../src/lib/auth/password";

const password = "correct horse battery staple";

void test("hashes are self-describing and never contain the password", async () => {
  const stored = await hashPassword(password);
  const segments = stored.split("$");

  assert.equal(segments.length, 6);
  assert.equal(segments[0], "scrypt");
  assert.ok(!stored.includes(password));
});

void test("the same password produces a different hash every time", async () => {
  const first = await hashPassword(password);
  const second = await hashPassword(password);

  assert.notEqual(first, second);
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword(password, second), true);
});

void test("verification rejects wrong passwords, missing and corrupt hashes", async () => {
  const stored = await hashPassword(password);

  assert.equal(await verifyPassword("correct horse battery stapl", stored), false);
  assert.equal(await verifyPassword("", stored), false);
  assert.equal(await verifyPassword(password, null), false);
  assert.equal(await verifyPassword(password, ""), false);
  assert.equal(await verifyPassword(password, "not-a-hash"), false);
  assert.equal(await verifyPassword(password, "scrypt$16384$8$1$abc"), false);
});

void test("passwords at the supported boundaries round trip", async () => {
  const shortest = "a".repeat(PASSWORD_MIN_LENGTH);
  const longest = "b".repeat(PASSWORD_MAX_LENGTH);

  assert.equal(await verifyPassword(shortest, await hashPassword(shortest)), true);
  assert.equal(await verifyPassword(longest, await hashPassword(longest)), true);
});

void test("emails are normalized before they are stored or compared", () => {
  assert.equal(normalizeEmail("  Person@Example.COM "), "person@example.com");
  assert.equal(normalizeEmail("person@example.com"), "person@example.com");
});
