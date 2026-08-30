import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";

import { fieldErrorsFromZod } from "../src/actions/state";
import { registerSchema } from "../src/lib/validation/auth";
import { portfolioItemSchema, testimonialSchema } from "../src/lib/validation/content";
import {
  buildOrderListQueryString,
  createOrderSchema,
  parseOrderListParams,
  sendOrderMessageSchema,
} from "../src/lib/validation/orders";
import {
  buildUserListQueryString,
  parseUserListParams,
} from "../src/lib/validation/users";

const inThirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);

function orderInput(overrides: Record<string, string> = {}) {
  return {
    title: "Warehouse picking assistant",
    detailedDescription:
      "We run three warehouses and pick orders from paper lists. We want a web app that sequences picks per aisle, works on cheap Android scanners and syncs with our existing ERP export.",
    problemStatement:
      "Pickers walk the same aisle several times per order, which costs us about two hours per shift.",
    keyFeatures:
      "Pick lists, aisle routing, barcode scanning, CSV import from the ERP.",
    technicalPreferences: "",
    referenceLinks: "",
    desiredDeadline: "",
    ...overrides,
  };
}

void test("a complete brief is accepted and optional fields normalize to null", () => {
  const parsed = createOrderSchema.parse(orderInput());

  assert.equal(parsed.technicalPreferences, null);
  assert.equal(parsed.referenceLinks, null);
  assert.equal(parsed.desiredDeadline, null);
});

void test("a thin brief is rejected field by field", () => {
  const result = createOrderSchema.safeParse(
    orderInput({
      title: "app",
      detailedDescription: "make it good",
      keyFeatures: "all",
    }),
  );
  assert.equal(result.success, false);

  if (!result.success) {
    const errors = fieldErrorsFromZod(result.error);
    assert.ok(errors.title);
    assert.ok(errors.detailedDescription);
    assert.ok(errors.keyFeatures);
  }
});

void test("deadlines must be real calendar dates in the future", () => {
  assert.equal(
    createOrderSchema.parse(orderInput({ desiredDeadline: inThirtyDays }))
      .desiredDeadline,
    inThirtyDays,
  );

  for (const invalid of ["2020-01-01", "2026-02-30", "next friday", "01/02/2027"]) {
    assert.equal(
      createOrderSchema.safeParse(orderInput({ desiredDeadline: invalid })).success,
      false,
      `${invalid} should be rejected`,
    );
  }
});

void test("chat messages are bounded by the database check constraint", () => {
  const orderId = randomUUID();

  assert.equal(
    sendOrderMessageSchema.safeParse({ orderId, body: "   " }).success,
    false,
  );
  assert.equal(
    sendOrderMessageSchema.safeParse({ orderId, body: "a".repeat(4001) }).success,
    false,
  );
  assert.equal(
    sendOrderMessageSchema.parse({ orderId, body: "  Ready for review  " }).body,
    "Ready for review",
  );
});

void test("order list filters survive a query-string round trip", () => {
  const params = parseOrderListParams({
    q: " payments ",
    status: "IN_PROGRESS",
    assignment: "assigned",
    page: "3",
    perPage: "20",
  });

  assert.deepEqual(params, {
    q: "payments",
    status: "IN_PROGRESS",
    assignment: "assigned",
    page: 3,
    perPage: 20,
  });

  const query = buildOrderListQueryString(params);
  const reparsed = parseOrderListParams(
    Object.fromEntries(new URLSearchParams(query.slice(1))),
  );
  assert.deepEqual(reparsed, params);
});

void test("hand-edited list URLs fall back to safe defaults", () => {
  const defaults = parseOrderListParams({});
  assert.deepEqual(defaults, {
    q: "",
    status: "ALL",
    assignment: "any",
    page: 1,
    perPage: 10,
  });

  assert.deepEqual(parseOrderListParams({ status: "DROP TABLE orders" }), defaults);
  assert.deepEqual(parseOrderListParams({ perPage: "100000" }), defaults);
  assert.deepEqual(parseOrderListParams({ page: ["2", "9"] }), {
    ...defaults,
    page: 2,
  });
  assert.equal(buildOrderListQueryString(defaults), "");
});

void test("people list filters behave the same way", () => {
  const params = parseUserListParams({ q: "dana", role: "EXECUTOR", page: "2" });
  assert.deepEqual(params, { q: "dana", role: "EXECUTOR", page: 2, perPage: 20 });
  assert.equal(buildUserListQueryString(params), "?q=dana&role=EXECUTOR&page=2");

  const defaults = parseUserListParams({ role: "SUPERUSER" });
  assert.deepEqual(defaults, { q: "", role: "ALL", page: 1, perPage: 20 });
  assert.equal(buildUserListQueryString(defaults), "");
});

void test("portfolio slugs are normalized and technology lists de-duplicated", () => {
  const parsed = portfolioItemSchema.parse({
    slug: "  Warehouse-Picking  ",
    title: "Warehouse picking assistant",
    summary: "Aisle-aware picking for three warehouses, delivered in six weeks.",
    problem:
      "Pickers walked each aisle several times per order because the paper lists were unsorted.",
    solution:
      "A routed pick list with barcode scanning, plus a nightly CSV bridge to the existing ERP.",
    techStack: "Next.js, Postgres, Next.js , ",
    industry: "Logistics",
    projectUrl: "",
    deliveryWeeks: "6",
    sortOrder: "",
    published: true,
  });

  assert.equal(parsed.slug, "warehouse-picking");
  assert.deepEqual(parsed.techStack, ["Next.js", "Postgres"]);
  assert.equal(parsed.projectUrl, null);
  assert.equal(parsed.deliveryWeeks, 6);
  assert.equal(parsed.sortOrder, 0);
  assert.equal(parsed.published, true);
});

void test("portfolio input is rejected when it would break the public page", () => {
  const base = {
    slug: "warehouse-picking",
    title: "Warehouse picking assistant",
    summary: "Aisle-aware picking for three warehouses, delivered in six weeks.",
    problem:
      "Pickers walked each aisle several times per order because the paper lists were unsorted.",
    solution:
      "A routed pick list with barcode scanning, plus a nightly CSV bridge to the existing ERP.",
    techStack: "Next.js",
    industry: "",
    projectUrl: "",
    deliveryWeeks: "",
    sortOrder: "0",
    published: false,
  };

  assert.equal(portfolioItemSchema.parse(base).deliveryWeeks, null);
  assert.equal(
    portfolioItemSchema.safeParse({ ...base, slug: "Not A Slug" }).success,
    false,
  );
  assert.equal(portfolioItemSchema.safeParse({ ...base, slug: "a" }).success, false);
  assert.equal(
    portfolioItemSchema.safeParse({ ...base, summary: "Too short" }).success,
    false,
  );
  assert.equal(
    portfolioItemSchema.safeParse({ ...base, projectUrl: "example.com" }).success,
    false,
  );
  assert.equal(
    portfolioItemSchema.safeParse({ ...base, deliveryWeeks: "0" }).success,
    false,
  );
});

void test("testimonials require a substantial quote and a sane rating", () => {
  const base = {
    authorName: "Marta Feld",
    authorRole: "Operations lead",
    company: "Nordwind Logistik",
    quote:
      "They asked better questions than we did, then shipped the picking app in six weeks without drama.",
    rating: "5",
    orderId: "",
    sortOrder: "1",
    published: true,
  };

  const parsed = testimonialSchema.parse(base);
  assert.equal(parsed.rating, 5);
  assert.equal(parsed.orderId, null);
  assert.equal(parsed.sortOrder, 1);

  assert.equal(testimonialSchema.parse({ ...base, rating: "" }).rating, null);
  assert.equal(testimonialSchema.safeParse({ ...base, rating: "9" }).success, false);
  assert.equal(
    testimonialSchema.safeParse({ ...base, quote: "Great work" }).success,
    false,
  );
  assert.equal(
    testimonialSchema.safeParse({ ...base, authorName: "M" }).success,
    false,
  );
  assert.equal(
    testimonialSchema.safeParse({ ...base, orderId: "not-a-uuid" }).success,
    false,
  );
  assert.equal(
    testimonialSchema.parse({
      ...base,
      orderId: "6f4c2f1a-6f2f-4b4e-9d6a-1f2c3d4e5f60",
    }).orderId,
    "6f4c2f1a-6f2f-4b4e-9d6a-1f2c3d4e5f60",
  );
});

void test("registration normalizes the email and reports mismatched passwords", () => {
  const parsed = registerSchema.parse({
    name: "  Marta Feld ",
    email: "  Marta@Example.COM ",
    password: "picking-app-2026",
    confirmPassword: "picking-app-2026",
  });

  assert.equal(parsed.name, "Marta Feld");
  assert.equal(parsed.email, "marta@example.com");

  const mismatch = registerSchema.safeParse({
    name: "Marta Feld",
    email: "marta@example.com",
    password: "picking-app-2026",
    confirmPassword: "picking-app-2025",
  });
  assert.equal(mismatch.success, false);
  if (!mismatch.success) {
    const errors = fieldErrorsFromZod(mismatch.error);
    assert.deepEqual(errors.confirmPassword, ["Passwords do not match"]);
  }
});

void test("weak passwords are rejected before any hashing happens", () => {
  for (const password of ["short", "alllettersnodigits", "1234567890123456"]) {
    const result = registerSchema.safeParse({
      name: "Marta Feld",
      email: "marta@example.com",
      password,
      confirmPassword: password,
    });
    assert.equal(result.success, false, `${password} should be rejected`);
  }
});
