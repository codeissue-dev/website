import assert from "node:assert/strict";
import { test } from "node:test";

import {
  generateOrderReference,
  isOrderReference,
  normalizeOrderReference,
  ORDER_REFERENCE_PATTERN,
} from "../src/lib/orders/reference";

test("generated references carry the year and match the public pattern", () => {
  const reference = generateOrderReference(new Date("2026-02-17T08:30:00.000Z"));
  assert.match(reference, ORDER_REFERENCE_PATTERN);
  assert.ok(reference.startsWith("CI-2026-"));
  assert.equal(reference.length, "CI-2026-".length + 6);
});

test("references avoid ambiguous characters", () => {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const suffix = generateOrderReference().slice("CI-2026-".length);
    for (const character of suffix) {
      assert.ok(
        !"ILOU".includes(character),
        `${character} is easy to misread and must not appear in a reference`,
      );
    }
  }
});

test("references are unlikely to collide", () => {
  const seen = new Set<string>();
  for (let attempt = 0; attempt < 500; attempt += 1) {
    seen.add(generateOrderReference(new Date("2026-02-17T08:30:00.000Z")));
  }
  assert.ok(seen.size > 490, `only ${seen.size} unique references in 500 attempts`);
});

test("user input is normalized before it reaches a query", () => {
  assert.equal(normalizeOrderReference("  ci-2026-abcdef "), "CI-2026-ABCDEF");
  assert.ok(isOrderReference(normalizeOrderReference(" ci-2026-234567 ")));
});

test("invalid references are rejected", () => {
  for (const invalid of [
    "",
    "CI-2026",
    "CI-26-ABCDEF",
    "CI-2026-ABCDE",
    "CI-2026-ABCDEFG",
    "XX-2026-ABCDEF",
    "CI-2026-ABCDEI",
    "CI-2026-ABC DEF",
    "CI-2026-ABCDEF' OR 1=1 --",
  ]) {
    assert.equal(isOrderReference(invalid), false, `${invalid} should be rejected`);
  }
});
