/** Small, dependency-free helpers shared by server and client components. */

/** Joins class names, dropping falsy entries. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter((value): value is string => Boolean(value)).join(" ");
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

/** Absolute UTC date, identical on the server and after hydration. */
export function formatDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  return DATE_FORMAT.format(date);
}

export function formatDateTime(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  return `${DATE_TIME_FORMAT.format(date)} UTC`;
}

/** Machine-readable value for the `dateTime` attribute of `<time>`. */
export function toIsoString(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

const RELATIVE_FORMAT = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const RELATIVE_STEPS: ReadonlyArray<{
  limit: number;
  unit: Intl.RelativeTimeFormatUnit;
  ms: number;
}> = [
  { limit: 60_000, unit: "second", ms: 1_000 },
  { limit: 3_600_000, unit: "minute", ms: 60_000 },
  { limit: 86_400_000, unit: "hour", ms: 3_600_000 },
  { limit: 2_592_000_000, unit: "day", ms: 86_400_000 },
  { limit: 31_536_000_000, unit: "month", ms: 2_592_000_000 },
];

export function formatRelativeTime(
  value: Date | string,
  now: Date = new Date(),
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";

  const diff = date.getTime() - now.getTime();
  const magnitude = Math.abs(diff);

  for (const step of RELATIVE_STEPS) {
    if (magnitude < step.limit) {
      return RELATIVE_FORMAT.format(Math.round(diff / step.ms), step.unit);
    }
  }
  return RELATIVE_FORMAT.format(Math.round(diff / 31_536_000_000), "year");
}

/** Initials for an avatar bubble; falls back to the email local part. */
export function initials(name: string | null, email = ""): string {
  const source =
    name && name.trim().length > 0 ? name.trim() : (email.split("@")[0] ?? email);
  const parts = source.split(/[\s._-]+/u).filter((part) => part.length > 0);
  const letters = parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase());
  return letters.length > 0 ? letters.join("") : "?";
}

export function displayName(name: string | null, email: string): string {
  return name && name.trim().length > 0 ? name.trim() : email;
}

export function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, Math.max(0, max - 3)).trimEnd()}...`;
}

/** Splits free-form textarea content into displayable paragraphs. */
export function paragraphs(value: string): string[] {
  return value
    .split(/\n{2,}/u)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

export function percentage(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

/**
 * Two-digit label for a zero-based index, as used by the numbered cards and
 * steps on the public site: 0 becomes "01".
 */
export function numberLabel(index: number): string {
  return String(index + 1).padStart(2, "0");
}
