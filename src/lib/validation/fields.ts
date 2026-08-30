import { z } from "zod";

/**
 * Shared field builders.
 *
 * HTML forms always submit strings, so "optional" fields arrive as empty
 * strings. These helpers normalize them to `null` exactly once, at the trust
 * boundary, so the database layer never has to guess.
 */
export function requiredText(options: {
  min: number;
  max: number;
  label: string;
}): z.ZodType<string, string> {
  return z
    .string()
    .transform((value) => value.trim())
    .pipe(
      z
        .string()
        .min(options.min, `${options.label} needs at least ${options.min} characters`)
        .max(options.max, `${options.label} must stay under ${options.max} characters`),
    );
}

export function optionalText(
  max: number,
  label: string,
): z.ZodType<string | null, string> {
  return z
    .string()
    .max(max, `${label} must stay under ${max} characters`)
    .transform((value) => value.trim())
    .transform((value) => (value.length === 0 ? null : value));
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isCalendarDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed.toISOString().slice(0, 10) === value;
}

/** Optional `YYYY-MM-DD` value that must not be in the past. */
export const optionalFutureDate: z.ZodType<string | null, string> = z
  .string()
  .transform((value) => value.trim())
  .refine(
    (value) => value.length === 0 || isCalendarDate(value),
    "Use the date picker to choose a real date",
  )
  .refine(
    (value) => value.length === 0 || value >= new Date().toISOString().slice(0, 10),
    "Choose a date in the future",
  )
  .transform((value) => (value.length === 0 ? null : value));

export const optionalUuid: z.ZodType<string | null, string> = z
  .string()
  .transform((value) => value.trim())
  .refine(
    (value) => value.length === 0 || z.uuid().safeParse(value).success,
    "Select a valid option",
  )
  .transform((value) => (value.length === 0 ? null : value));

export const optionalHttpUrl: z.ZodType<string | null, string> = z
  .string()
  .transform((value) => value.trim())
  .refine(
    (value) => value.length === 0 || z.url().safeParse(value).success,
    "Enter a full URL including the scheme",
  )
  .transform((value) => (value.length === 0 ? null : value));

/** Comma separated input ("Next.js, Postgres") normalized to a unique list. */
export function commaSeparatedList(options: {
  max: number;
  label: string;
}): z.ZodType<string[], string> {
  return z
    .string()
    .max(1000, `${options.label} is too long`)
    .transform((value) =>
      Array.from(
        new Set(
          value
            .split(",")
            .map((entry) => entry.trim())
            .filter((entry) => entry.length > 0),
        ),
      ),
    )
    .pipe(
      z
        .array(z.string().min(1).max(40))
        .max(options.max, `Use at most ${options.max} entries`),
    );
}
