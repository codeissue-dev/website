import type { UserRole } from "@/lib/auth/roles";

/** One link in any navigation surface: header, footer or workspace nav. */
export type NavLink = {
  readonly href: string;
  readonly label: string;
};

export type FooterColumn = {
  readonly heading: string;
  readonly links: readonly NavLink[];
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
  { href: "/#capabilities", label: "What we build" },
  { href: "/#process", label: "How it works" },
  { href: "/#work", label: "Public projects" },
  { href: "/#testimonials", label: "Reviews" },
];

const GUEST_ACTIONS: readonly HeaderAction[] = [
  { href: "/sign-in", label: "Sign in", emphasis: "quiet" },
  { href: "/register", label: "Start a project", emphasis: "strong" },
];

const SIGNED_IN_ACTIONS: readonly HeaderAction[] = [
  { href: "/dashboard", label: "Dashboard", emphasis: "quiet" },
  { href: "/orders/new", label: "Start a project", emphasis: "strong" },
];

/** The two header buttons, chosen by whether somebody is signed in. */
export function headerActions(isSignedIn: boolean): readonly HeaderAction[] {
  return isSignedIn ? SIGNED_IN_ACTIONS : GUEST_ACTIONS;
}

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: "The studio",
    links: [
      { href: "/#capabilities", label: "What we build" },
      { href: "/#process", label: "How it works" },
      { href: "/#workflow", label: "Project flow" },
    ],
  },
  {
    heading: "In public",
    links: [
      { href: "/work", label: "Finished projects" },
      { href: "/#testimonials", label: "Client reviews" },
      { href: "/#faq", label: "Questions" },
    ],
  },
  {
    heading: "Your account",
    links: [
      { href: "/register", label: "Open an account" },
      { href: "/sign-in", label: "Sign in" },
      { href: "/orders/new", label: "Start a project" },
    ],
  },
];

const ACCOUNT_LINK: NavLink = { href: "/account", label: "Account" };

/**
 * Workspace navigation per role.
 *
 * Only the links a role can actually open are listed; server-side guards still
 * re-check permissions on every request.
 */
export function workspaceNavLinks(role: UserRole): readonly NavLink[] {
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
