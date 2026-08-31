import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CAPABILITIES,
  CAPABILITIES_SECTION,
  CTA_SECTION,
  FAQ_ENTRIES,
  FAQ_SECTION,
  HERO,
  HERO_PROOF,
  PORTFOLIO_SECTION,
  PROCESS_SECTION,
  PROCESS_STEPS,
  TESTIMONIALS_SECTION,
  WORK_INDEX,
  WORKFLOW_SECTION,
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

/** Reads one string field and fails with a useful message when it is missing. */
function field(section: Record<string, unknown>, key: string): string {
  const value = section[key];
  if (typeof value !== "string") {
    throw new Error(`${key} should be a string, received ${typeof value}`);
  }
  return value;
}

const SECTIONS: readonly (readonly [string, Record<string, unknown>])[] = [
  ["hero", HERO],
  ["capabilities", CAPABILITIES_SECTION],
  ["process", PROCESS_SECTION],
  ["workflow", WORKFLOW_SECTION],
  ["portfolio", PORTFOLIO_SECTION],
  ["testimonials", TESTIMONIALS_SECTION],
  ["faq", FAQ_SECTION],
  ["call to action", CTA_SECTION],
  ["work index", WORK_INDEX],
];

const ALL_COPY = collectStrings([
  SITE,
  HERO,
  HERO_PROOF,
  CAPABILITIES_SECTION,
  CAPABILITIES,
  PROCESS_SECTION,
  PROCESS_STEPS,
  WORKFLOW_SECTION,
  PORTFOLIO_SECTION,
  TESTIMONIALS_SECTION,
  FAQ_SECTION,
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

void test("every section names itself in a plain sentence", () => {
  const titles: string[] = [];
  for (const [name, section] of SECTIONS) {
    const title = field(section, "title");
    assert.ok(title.length > 12, `${name}: title too thin`);
    assert.ok(title.endsWith("."), `${name}: title should read as a sentence`);
    assert.ok(!title.includes(":"), `${name}: title should not be a label`);
    titles.push(title);

    const eyebrow = field(section, "eyebrow");
    assert.ok(eyebrow.length > 2, `${name}: eyebrow too thin`);
    assert.equal(eyebrow, eyebrow.trim());
    assert.notEqual(eyebrow, eyebrow.toUpperCase(), `${name}: eyebrow is shouted`);
  }
  assert.equal(new Set(titles).size, titles.length, "two sections share a title");
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

void test("the hero promises something concrete and links where it says", () => {
  assert.equal(HERO_PROOF.length, 3);
  assert.equal(new Set(HERO_PROOF.map((point) => point.term)).size, 3);
  for (const point of HERO_PROOF) assert.ok(point.detail.length > 20);

  assert.equal(HERO.primaryAction.href, "/register");
  assert.equal(HERO.secondaryAction.href, "/work");
  const vague = ["learn more", "get started", "click here", "read more", "submit"];
  for (const action of [HERO.primaryAction, HERO.secondaryAction]) {
    assert.ok(
      !vague.includes(action.label.toLowerCase()),
      `an action label should say what happens: ${action.label}`,
    );
  }
});

void test("site metadata is filled in and reusable", () => {
  assert.ok(SITE.name.length > 2);
  assert.ok(SITE.titleTemplate.includes("%s"));
  assert.ok(SITE.description.length > 60);
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
