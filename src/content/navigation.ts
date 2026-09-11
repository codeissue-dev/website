import type { UserRole } from "@/lib/auth/roles";

/**
 * One link in a navigation surface.
 *
 * Footer labels are message keys resolved through the intl dictionary by the
 * component that renders the link, so text follows the active locale while
 * the href stays stable.
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
 * Workspace links keep literal labels: header navigation is built per role in
 * the header itself, and these only back the account shortcut.
 */
export type WorkspaceLink = {
  readonly href: string;
  readonly label: string;
};

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
