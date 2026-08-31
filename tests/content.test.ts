import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CAPABILITIES,
  CTA_SECTION,
  FAQ_ENTRIES,
  HERO,
  HERO_CONSOLE,
  HERO_PROOF,
  PROCESS_STEPS,
  WORK_INDEX,
} from "../src/content/landing";
import {
  FOOTER_COLUMNS,
  headerActions,
  PUBLIC_SECTION_LINKS,
  workspaceNavLinks,
} from "../src/content/navigation";
import { SITE } from "../src/content/site";
import { USER_ROLES } from "../src/lib/auth/roles";

/** Collects every string reachable from a content export, arrays included. */
function collectStrings(value: unknown, sink: string[] = []): string[] {
  if (typeof value === "string") {
    sink.push(value);
    return sink;
  }
  if (typeof value === "object" && value !== null) {
    for (const entry of Object.values(value as Record<string, unknown>)) {
      collectStrings(entry, sink);
    }
  }
  return sink;
}

const ALL_COPY = collectStrings([
  SITE,
  HERO,
  HERO_PROOF,
  HERO_CONSOLE,
  CAPABILITIES,
  PROCESS_STEPS,
  FAQ_ENTRIES,
  CTA_SECTION,
  WORK_INDEX,
  PUBLIC_SECTION_LINKS,
  FOOTER_COLUMNS,
]);

void test("landing sections keep their copy non-empty", () => {
  assert.ok(ALL_COPY.length > 60);
  for (const value of ALL_COPY) {
    assert.ok(value.trim().length > 0, `empty copy string: ${JSON.stringify(value)}`);
    assert.equal(value, value.trim(), `untrimmed copy string: ${value}`);
  }
});

void test("copy avoids dashes and shouting used as decoration", () => {
  for (const value of ALL_COPY) {
    assert.ok(!value.includes("\u2014"), `em dash in copy: ${value}`);
    assert.ok(!value.includes(" -- "), `double dash in copy: ${value}`);
    assert.ok(!/\b[A-Z]{4,}\b/u.test(value), `all-caps word used as a label: ${value}`);
  }
});

void test("capabilities and process steps are unique and complete", () => {
  const titles = CAPABILITIES.map((card) => card.title);
  assert.equal(new Set(titles).size, titles.length);
  assert.ok(CAPABILITIES.length >= 6);
  for (const card of CAPABILITIES) assert.ok(card.body.length > 40);

  const steps = PROCESS_STEPS.map((step) => step.title);
  assert.equal(new Set(steps).size, steps.length);
  assert.equal(PROCESS_STEPS.length, 4);
});

void test("every FAQ entry asks a question and answers it", () => {
  const questions = FAQ_ENTRIES.map((entry) => entry.question);
  assert.equal(new Set(questions).size, questions.length);
  for (const entry of FAQ_ENTRIES) {
    assert.ok(entry.question.endsWith("?"), `not a question: ${entry.question}`);
    assert.ok(entry.answer.length > 60, `answer too thin: ${entry.question}`);
  }
});

void test("hero proof points and console illustration stay in sync", () => {
  assert.equal(HERO_PROOF.length, 3);
  assert.equal(new Set(HERO_PROOF.map((point) => point.term)).size, 3);

  const percent = HERO_CONSOLE.progress.percent;
  assert.ok(percent > 0 && percent < 100);
  assert.equal(HERO_CONSOLE.progress.ticks.length, 4);
  assert.equal(new Set(HERO_CONSOLE.nav).size, HERO_CONSOLE.nav.length);
  assert.equal(
    new Set(HERO_CONSOLE.activity.map((entry) => entry.label)).size,
    HERO_CONSOLE.activity.length,
  );
});

void test("public navigation points at real in-app routes", () => {
  const hrefs = PUBLIC_SECTION_LINKS.map((link) => link.href);
  assert.equal(new Set(hrefs).size, hrefs.length);
  for (const link of PUBLIC_SECTION_LINKS) {
    assert.ok(link.href.startsWith("/"), `not an internal link: ${link.href}`);
  }

  for (const column of FOOTER_COLUMNS) {
    assert.ok(column.links.length > 0, `empty footer column: ${column.heading}`);
    for (const link of column.links) {
      assert.ok(link.href.startsWith("/"), `not an internal link: ${link.href}`);
    }
  }
  const headings = FOOTER_COLUMNS.map((column) => column.heading);
  assert.equal(new Set(headings).size, headings.length);
});

void test("header offers exactly one emphasised action per state", () => {
  for (const signedIn of [true, false]) {
    const actions = headerActions(signedIn);
    assert.equal(actions.length, 2);
    assert.equal(actions.filter((action) => action.emphasis === "strong").length, 1);
    assert.equal(new Set(actions.map((action) => action.href)).size, 2);
  }
  assert.ok(headerActions(true).some((action) => action.href === "/dashboard"));
  assert.ok(headerActions(false).some((action) => action.href === "/sign-in"));
});

void test("workspace navigation is unique and role appropriate", () => {
  for (const role of USER_ROLES) {
    const links = workspaceNavLinks(role);
    const hrefs = links.map((link) => link.href);
    assert.equal(new Set(hrefs).size, hrefs.length, `duplicate route for ${role}`);
    assert.ok(hrefs.includes("/account"), `${role} cannot reach the account page`);
    for (const link of links) assert.ok(link.href.startsWith("/"));
  }

  assert.ok(workspaceNavLinks("ADMIN").some((link) => link.href === "/admin"));
  assert.ok(
    !workspaceNavLinks("EXECUTOR").some((link) => link.href.startsWith("/admin")),
    "executors must not be offered admin routes",
  );
  assert.ok(
    !workspaceNavLinks("CUSTOMER").some((link) => link.href.startsWith("/admin")),
    "customers must not be offered admin routes",
  );
  assert.ok(workspaceNavLinks("CUSTOMER").some((link) => link.href === "/orders/new"));
  assert.ok(
    !workspaceNavLinks("EXECUTOR").some((link) => link.href === "/orders/new"),
    "executors do not submit briefs",
  );
});
