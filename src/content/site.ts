/**
 * Site-wide facts.
 *
 * Metadata, the footer note and the browser title all read from here, so the
 * studio's own wording lives in one file instead of being retyped per page.
 */
export const SITE = {
  name: "codeissue",
  title: "codeissue: custom software development",
  titleTemplate: "%s - codeissue",
  description:
    "codeissue builds custom software from a written brief: submit your project, follow every status change, and talk to the engineers doing the work.",
  summary:
    "Software built around a real brief and kept visible from the first note to delivery.",
  closingNote: "Built for people who want the work to stay clear.",
} as const;

/** Fallback description used by public pages that do not set their own. */
export const PUBLIC_PAGE_DESCRIPTION = SITE.description;
