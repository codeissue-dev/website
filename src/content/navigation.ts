import type { UserRole } from "@/lib/auth/roles";

/**
 * One link in any navigation surface: header, footer or workspace nav.
 *
 * Labels are message keys resolved through the intl dictionary by the
 * component that renders the link, so a link's text follows the active locale
 * while its href stays stable.
 */
export type NavLink = {
  readonly href: string;
  readonly labelKey: string;
};

export type FooterColumn = {
  readonly headingKey: string;
  readonly links: readonly NavLink[];
};

/**
 * Workspace links keep literal labels: the signed-in area is English-only for
 * now, so routing them through the dictionary would add nothing.
 */
export type WorkspaceLink = {
  readonly href: string;
  readonly label: string;
};

/**
 * Header actions are described, not styled: the header decides how "strong"
 * maps to a button variant, so the signed-in and guest branches stay identical.
 */
export type HeaderAction = NavLink & {
  readonly emphasis: "quiet" | "strong";
};

/** Anchors on the landing page, in the order the page renders them. */
export const PUBLIC_SECTION_LINKS: readonly NavLink[] = [
  { href: "/#capabilities", labelKey: "nav.capabilities" },
  { href: "/#process", labelKey: "nav.process" },
  { href: "/#work", labelKey: "nav.work" },
  { href: "/#testimonials", labelKey: "nav.testimonials" },
];

const GUEST_ACTIONS: readonly HeaderAction[] = [
  { href: "/sign-in", labelKey: "actions.signIn", emphasis: "quiet" },
  { href: "/register", labelKey: "actions.startProject", emphasis: "strong" },
];

const SIGNED_IN_ACTIONS: readonly HeaderAction[] = [
  { href: "/dashboard", labelKey: "actions.dashboard", emphasis: "quiet" },
  { href: "/orders/new", labelKey: "actions.startProject", emphasis: "strong" },
];

/** The two header buttons, chosen by whether somebody is signed in. */
export function headerActions(isSignedIn: boolean): readonly HeaderAction[] {
  return isSignedIn ? SIGNED_IN_ACTIONS : GUEST_ACTIONS;
}

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    headingKey: "studio.title",
    links: [
      { href: "/#capabilities", labelKey: "studio.capabilities" },
      { href: "/#process", labelKey: "studio.process" },
      { href: "/#workflow", labelKey: "studio.workflow" },
    ],
  },
  {
    headingKey: "public.title",
    links: [
      { href: "/work", labelKey: "public.work" },
      { href: "/#testimonials", labelKey: "public.testimonials" },
      { href: "/#faq", labelKey: "public.faq" },
    ],
  },
  {
    headingKey: "account.title",
    links: [
      { href: "/register", labelKey: "account.register" },
      { href: "/sign-in", labelKey: "account.signIn" },
      { href: "/orders/new", labelKey: "account.newOrder" },
    ],
  },
];

const ACCOUNT_LINK: WorkspaceLink = { href: "/account", label: "Account" };

/**
 * Workspace navigation per role.
 *
 * Only the links a role can actually open are listed; server-side guards still
 * re-check permissions on every request.
 */
export function workspaceNavLinks(role: UserRole): readonly WorkspaceLink[] {
  switch (role) {
    case "ADMIN":
      return [
        { href: "/admin", label: "Overview" },
        { href: "/admin/orders", label: "Projects" },
        { href: "/admin/users", label: "People" },
        { href: "/admin/portfolio", label: "Portfolio" },
        { href: "/admin/testimonials", label: "Testimonials" },
        ACCOUNT_LINK,
      ];
    case "EXECUTOR":
      return [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/orders", label: "Assigned work" },
        ACCOUNT_LINK,
      ];
    case "CUSTOMER":
      return [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/orders", label: "My projects" },
        { href: "/orders/new", label: "New request" },
        ACCOUNT_LINK,
      ];
  }
}
