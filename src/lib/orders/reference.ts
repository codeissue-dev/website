import { randomInt } from "node:crypto";

/**
 * Human-readable order references such as `CI-2026-7QK3ZP`.
 *
 * Crockford base32 without I, L, O and U so references survive being read out
 * loud or copied from a screenshot. Uniqueness is enforced by a unique index;
 * the insert path retries on collision.
 */
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const SUFFIX_LENGTH = 6;

export const ORDER_REFERENCE_PATTERN = /^CI-\d{4}-[0-9A-HJKMNP-TV-Z]{6}$/;

export function generateOrderReference(now: Date = new Date()): string {
  let suffix = "";
  for (let index = 0; index < SUFFIX_LENGTH; index += 1) {
    suffix += ALPHABET.charAt(randomInt(0, ALPHABET.length));
  }
  return `CI-${String(now.getUTCFullYear())}-${suffix}`;
}

export function isOrderReference(value: string): boolean {
  return ORDER_REFERENCE_PATTERN.test(value);
}

/** Normalizes a reference typed or pasted by a user (lowercase, spaces). */
export function normalizeOrderReference(value: string): string {
  return value.trim().toUpperCase();
}
