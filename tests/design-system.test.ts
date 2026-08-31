import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

/**
 * Design-system guard rails.
 *
 * The visual language is defined once, in `src/styles`, and reused by the
 * public pages and the signed-in workspace. These tests fail when a change
 * reintroduces the habits this codebase deliberately dropped: decorative
 * unicode instead of words, shouty labels, gradients, glows, or a class that
 * lives in the stylesheet but is no longer rendered anywhere.
 */

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = path.join(ROOT, "src");
const STYLES = path.join(SRC, "styles");

function sourceFiles(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      found.push(...sourceFiles(full));
    } else if (/[.](?:ts|tsx|css)$/.test(entry)) {
      found.push(full);
    }
  }
  return found.sort();
}

const FILES = sourceFiles(SRC).map((file) => ({
  name: path.relative(ROOT, file),
  text: readFileSync(file, "utf8"),
}));

void test("the source tree carries no design system files but the four layers", () => {
  const styles = readdirSync(STYLES).sort();
  assert.deepEqual(styles, ["base.css", "components.css", "motion.css", "theme.css"]);

  const globals = readFileSync(path.join(SRC, "app", "globals.css"), "utf8");
  const imported = [...globals.matchAll(/@import "[.][.]\/styles\/([\w.-]+)"/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imported, ["theme.css", "base.css", "components.css", "motion.css"]);
});

function codePointOf(character: string): number {
  return character.codePointAt(0) ?? 0;
}

void test("source text stays plain: no decorative unicode", () => {
  const COPYRIGHT = 169;
  const offenders: string[] = [];
  for (const file of FILES) {
    const characters = new Set(
      [...file.text].filter(
        (character) =>
          codePointOf(character) > 127 && codePointOf(character) !== COPYRIGHT,
      ),
    );
    if (characters.size > 0) {
      offenders.push(`${file.name}: ${[...characters].join(" ")}`);
    }
  }
  assert.deepEqual(offenders, []);
});

void test("labels are written, not shouted", () => {
  const offenders = FILES.filter((file) =>
    /uppercase|text-transform|tracking-\[0[.]/.test(file.text),
  ).map((file) => file.name);
  assert.deepEqual(offenders, []);
});

void test("depth comes from borders and spacing, not gradients or glows", () => {
  const banned = [
    "gradient",
    "backdrop-filter",
    "backdrop-blur",
    "background-clip",
    "bg-clip-text",
    "drop-shadow",
    "shadow-[",
    "animate-[",
  ];
  const offenders: string[] = [];
  for (const file of FILES) {
    for (const token of banned) {
      if (file.text.includes(token)) offenders.push(`${file.name}: ${token}`);
    }
  }
  assert.deepEqual(offenders, []);
});

void test("every shared class is rendered by a component", () => {
  const components = readFileSync(path.join(STYLES, "components.css"), "utf8");
  const declared = new Set(
    [...components.matchAll(/[.]([a-z][a-z0-9-]*)/g)].flatMap((match) =>
      match[1] === undefined ? [] : [match[1]],
    ),
  );
  const markup = FILES.filter((file) => file.name.endsWith(".tsx"))
    .map((file) => file.text)
    .join("\n");

  assert.ok(declared.size > 40, "the shared layer should define the common pieces");
  const unused = [...declared].filter((name) => !markup.includes(name)).sort();
  assert.deepEqual(unused, []);
});

void test("the workspace and the public pages share one heading scale", () => {
  const components = readFileSync(path.join(STYLES, "components.css"), "utf8");
  for (const shared of [
    ".title-hero",
    ".section-title",
    ".page-title",
    ".panel-title",
    ".surface-card",
    ".data-row",
    ".btn",
    ".badge",
  ]) {
    assert.ok(components.includes(shared), `${shared} should be defined once`);
  }

  const inlineHeadings = FILES.filter(
    (file) => file.name.endsWith(".tsx") && /<h1 className="text-/.test(file.text),
  ).map((file) => file.name);
  assert.deepEqual(inlineHeadings, []);
});

void test("one radius scale is used everywhere", () => {
  const offenders: string[] = [];
  for (const file of FILES) {
    if (!file.name.endsWith(".tsx")) continue;
    for (const match of file.text.matchAll(/rounded-([a-z0-9[\]]+)/g)) {
      const value = match[1];
      if (value === undefined) continue;
      if (!["control", "panel", "pill", "sm"].includes(value)) {
        offenders.push(`${file.name}: rounded-${value}`);
      }
    }
  }
  assert.deepEqual(offenders, []);
});
