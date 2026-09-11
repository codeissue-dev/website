import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import en from "../src/i18n/messages/en.json";
import ru from "../src/i18n/messages/ru.json";
import { FOOTER_COLUMNS, workspaceNavLinks } from "../src/content/navigation";
import { USER_ROLES } from "../src/lib/auth/roles";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

type Messages = Record<string, unknown>;

/** Resolves a dotted key path against a dictionary, or returns undefined. */
function resolve(messages: Messages, key: string): unknown {
  let current: unknown = messages;
  for (const part of key.split(".")) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/** Resolves a dotted key path that must hold a string. */
function stringAt(messages: Messages, key: string): string {
  const value = resolve(messages, key);
  assert.equal(typeof value, "string", `${key} must be a string`);
  return value as string;
}

/** Narrows an unknown value to a typed list, failing when it is not one. */
function listOf<T>(value: unknown): T[] {
  assert.ok(Array.isArray(value), "expected a list");
  return value as T[];
}

/** Collects every string reachable from a dictionary, arrays included. */
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

/** Every leaf key path of a dictionary, in stable order. */
function collectKeys(value: unknown, prefix = "", sink: string[] = []): string[] {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      collectKeys(entry, prefix === "" ? key : `${prefix}.${key}`, sink);
    }
    return sink;
  }
  sink.push(prefix);
  return sink;
}

void test("the two locales carry exactly the same key structure", () => {
  assert.deepEqual(collectKeys(ru).sort(), collectKeys(en).sort());
});

void test("copy stays non-empty and clean in both locales", () => {
  for (const [locale, messages] of [
    ["en", en],
    ["ru", ru],
  ] as const) {
    const copy = collectStrings(messages);
    assert.ok(copy.length > 80, `${locale}: dictionary looks thin`);
    for (const value of copy) {
      assert.ok(value.trim().length > 0, `${locale}: empty copy string`);
      assert.equal(value, value.trim(), `${locale}: untrimmed copy: ${value}`);
      assert.ok(
        !value.includes("\u2014") && !value.includes(" -- ") && !value.includes(" - "),
        `${locale}: decorative dash in copy: ${value}`,
      );
      assert.ok(
        !/\b[A-Z]{4,}\b/u.test(value),
        `${locale}: all-caps word used as a label: ${value}`,
      );
    }
  }
});

void test("plural messages carry the mandatory other branch", () => {
  for (const [locale, messages] of [
    ["en", en],
    ["ru", ru],
  ] as const) {
    for (const value of collectStrings(messages)) {
      if (!value.includes(", plural,")) continue;
      assert.ok(
        value.includes("other {"),
        `${locale}: plural without an other branch: ${value}`,
      );
    }
  }
});

void test("section titles read as unique plain sentences", () => {
  const titles: Array<[string, unknown]> = [
    ["hero", resolve(en, "Hero.title")],
    ["capabilities", resolve(en, "Capabilities.title")],
    ["process", resolve(en, "Process.title")],
    ["workflow", resolve(en, "Workflow.title")],
    ["portfolio", resolve(en, "Portfolio.title")],
    ["testimonials", resolve(en, "Testimonials.title")],
    ["faq", resolve(en, "Faq.title")],
    ["call to action", resolve(en, "Cta.title")],
    ["work index", resolve(en, "Work.title")],
  ];

  const values: string[] = [];
  for (const [name, value] of titles) {
    assert.equal(typeof value, "string", `${name}: title missing`);
    const title = value as string;
    assert.ok(title.length > 12, `${name}: title too thin`);
    assert.ok(title.endsWith("."), `${name}: title should read as a sentence`);
    assert.ok(!title.includes(":"), `${name}: title should not be a label`);
    values.push(title);
  }
  assert.equal(new Set(values).size, values.length, "two sections share a title");
});

void test("capabilities and process steps are unique and complete in both locales", () => {
  for (const [locale, messages] of [
    ["en", en],
    ["ru", ru],
  ] as const) {
    const capabilities = listOf<Capability>(resolve(messages, "Capabilities.items"));
    const titles = capabilities.map((card) => card.title);
    assert.equal(
      new Set(titles).size,
      titles.length,
      `${locale}: duplicate capability`,
    );
    assert.ok(capabilities.length >= 6, `${locale}: too few capabilities`);
    for (const card of capabilities) {
      assert.ok(card.body.length > 40, `${locale}: capability body too thin`);
    }

    const steps = listOf<Capability>(resolve(messages, "Process.steps"));
    assert.equal(steps.length, 4, `${locale}: process must have four steps`);
    const stepTitles = steps.map((step) => step.title);
    assert.equal(
      new Set(stepTitles).size,
      stepTitles.length,
      `${locale}: duplicate step`,
    );
  }
});

void test("every FAQ entry asks a question and answers it", () => {
  for (const [locale, messages] of [
    ["en", en],
    ["ru", ru],
  ] as const) {
    const entries = listOf<FaqEntry>(resolve(messages, "Faq.entries"));
    assert.equal(entries.length, 6, `${locale}: FAQ should have six entries`);
    const questions = entries.map((entry) => entry.question);
    assert.equal(new Set(questions).size, questions.length);
    for (const entry of entries) {
      assert.ok(entry.question.endsWith("?"), `${locale}: not a question`);
      assert.ok(entry.answer.length > 60, `${locale}: answer too thin`);
    }
  }
});

void test("the hero proof stays a triple and actions say what they do", () => {
  const proof = listOf<ProofPoint>(resolve(en, "Hero.proof"));
  assert.equal(proof.length, 3);
  const terms = proof.map((point) => point.term);
  assert.equal(new Set(terms).size, 3);

  const vague = ["learn more", "get started", "click here", "read more", "submit"];
  for (const key of ["Hero.primaryAction", "Hero.secondaryAction"]) {
    const label = stringAt(en, key);
    assert.ok(!vague.includes(label), `vague action label: ${label}`);
  }
});

void test("footer navigation points at real in-app routes with dictionary labels", () => {
  const headingKeys = FOOTER_COLUMNS.map((column) => column.headingKey);
  assert.equal(new Set(headingKeys).size, headingKeys.length);
  for (const column of FOOTER_COLUMNS) {
    assert.ok(column.links.length > 0, `empty footer column: ${column.headingKey}`);
    for (const link of column.links) {
      assert.ok(link.href.startsWith("/"), `not an internal link: ${link.href}`);
      assert.equal(
        typeof resolve(en, `Footer.${link.labelKey}`),
        "string",
        `unresolved footer label: ${link.labelKey}`,
      );
    }
  }
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

void test("the raw dictionaries on disk parse as strict JSON", async () => {
  for (const locale of ["en", "ru"]) {
    const raw = await readFile(
      path.join(ROOT, "src", "i18n", "messages", `${locale}.json`),
      "utf8",
    );
    assert.doesNotThrow(() => JSON.parse(raw), `${locale}.json must parse`);
  }
});

type Capability = { title: string; body: string };
type FaqEntry = { question: string; answer: string };
type ProofPoint = { term: string; detail: string };
