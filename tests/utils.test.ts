import assert from "node:assert/strict";
import { test } from "node:test";

import {
  cn,
  displayName,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  initials,
  numberLabel,
  paragraphs,
  percentage,
  pluralize,
  toIsoString,
  truncate,
} from "../src/lib/utils";

void test("cn keeps truthy class names only", () => {
  assert.equal(cn("a", null, undefined, false, "b"), "a b");
  assert.equal(cn(), "");
});

void test("dates render in UTC and degrade for invalid input", () => {
  const value = "2025-01-15T10:30:00.000Z";
  const formatted = formatDate(value);
  assert.ok(formatted.includes("2025"));
  assert.ok(formatted.includes("Jan"));
  assert.ok(formatDateTime(value).endsWith("UTC"));
  assert.equal(formatDate("not a date"), "-");
  assert.equal(formatDateTime("not a date"), "-");
});

void test("toIsoString is safe to put in a time element", () => {
  assert.equal(toIsoString("2025-01-15T10:30:00.000Z"), "2025-01-15T10:30:00.000Z");
  assert.equal(toIsoString("not a date"), "");
});

void test("relative time describes the distance from a fixed now", () => {
  const now = new Date("2025-01-15T12:00:00.000Z");
  const fiveMinutesEarlier = new Date(now.getTime() - 5 * 60 * 1000);
  const result = formatRelativeTime(fiveMinutesEarlier, now);
  assert.ok(result.includes("minute"), result);
  assert.ok(result.length > 0);
});

void test("initials and display names never render blank", () => {
  assert.equal(initials("Ada Lovelace"), "AL");
  assert.equal(initials("ada"), "A");
  assert.equal(initials("   "), "?");
  assert.equal(displayName("  Ada  ", "ada@example.com"), "Ada");
  assert.equal(displayName("   ", "ada@example.com"), "ada@example.com");
  assert.equal(displayName(null, "ada@example.com"), "ada@example.com");
});

void test("truncate only shortens longer values", () => {
  assert.equal(truncate("short", 10), "short");
  const long = truncate("a much longer sentence", 10);
  assert.ok(long.length <= 10);
  assert.ok(long.endsWith("..."));
  assert.ok(truncate("exactly ten", 4).length <= 4);
});

void test("paragraphs splits textarea input into blocks", () => {
  assert.deepEqual(paragraphs("one\n\ntwo\n\n\nthree"), ["one", "two", "three"]);
  assert.deepEqual(paragraphs("   "), []);
  assert.deepEqual(paragraphs("single line"), ["single line"]);
});

void test("counting helpers stay in range", () => {
  assert.equal(pluralize(1, "week", "weeks"), "week");
  assert.equal(pluralize(2, "week", "weeks"), "weeks");
  assert.equal(percentage(1, 4), 25);
  assert.equal(percentage(0, 0), 0);
  assert.equal(percentage(3, 0), 0);
});

void test("numberLabel pads the visible index", () => {
  assert.equal(numberLabel(0), "01");
  assert.equal(numberLabel(8), "09");
  assert.equal(numberLabel(11), "12");
});
