import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { ReactNode } from "react";

import { signOutAction } from "@/actions/auth";
import { Wordmark } from "@/components/brand/wordmark";
import { LocaleSwitch } from "@/components/layout/locale-switch";
import { MobileMenu } from "@/components/layout/mobile-menu";
import {
  MobileNavLinks,
  NavMenu,
  type NavMenuItem,
} from "@/components/layout/nav-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { SettingsIcon } from "@/components/ui/icon";
import { RoleBadge } from "@/components/ui/status-badge";
import { Container } from "@/components/ui/section";
import type { Actor } from "@/lib/auth/actor";
import { displayName } from "@/lib/utils";

type PanelReader = (id: string) => (key: string) => string;

function panelReader(t: { raw: (id: string) => unknown }): PanelReader {
  return (id) => {
    const raw = t.raw(id) as Record<string, string>;
    return (key) => raw[key] ?? "";
  };
}

async function publicItems(): Promise<NavMenuItem[]> {
  const t = await getTranslations("Header.panels");
  const panel = panelReader(t);

  const capabilities = panel("capabilities");
  const process = panel("process");
  const work = panel("work");
  const testimonials = panel("testimonials");

  return [
    {
      id: "capabilities",
      label: capabilities("label"),
      href: "/#capabilities",
      panel: {
        description: capabilities("description"),
        links: [
          { label: capabilities("list"), href: "/#capabilities" },
          { label: capabilities("process"), href: "/#process" },
        ],
      },
    },
    {
      id: "process",
      label: process("label"),
      href: "/#process",
      panel: {
        description: process("description"),
        links: [
          { label: process("steps"), href: "/#process" },
          { label: process("start"), href: "/register" },
        ],
      },
    },
    {
      id: "work",
      label: work("label"),
      href: "/work",
      panel: {
        description: work("description"),
        links: [
          { label: work("all"), href: "/work" },
          { label: work("start"), href: "/register" },
        ],
      },
    },
    {
      id: "testimonials",
      label: testimonials("label"),
      href: "/#testimonials",
      panel: {
        description: testimonials("description"),
        links: [{ label: testimonials("read"), href: "/#testimonials" }],
      },
    },
  ];
}

async function workspaceItems(actor: Actor): Promise<NavMenuItem[]> {
  const t = await getTranslations("Header.panels");
  const panel = panelReader(t);

  const dashboard = panel("dashboard");
  const projects = panel("projects");
  const assigned = panel("assigned");
  const studio = panel("studio");
  const account = panel("account");

  if (actor.role === "ADMIN") {
    return [
      { id: "overview", label: studio("overview"), href: "/admin" },
      {
        id: "projects",
        label: projects("label"),
        href: "/admin/orders",
        panel: {
          description: projects("description"),
          links: [{ label: projects("all"), href: "/admin/orders" }],
        },
      },
      {
        id: "studio",
        label: studio("label"),
        href: "/admin/users",
        panel: {
          description: studio("description"),
          links: [
            { label: studio("all"), href: "/admin/orders" },
            { label: studio("people"), href: "/admin/users" },
            { label: studio("portfolio"), href: "/admin/portfolio" },
            { label: studio("testimonials"), href: "/admin/testimonials" },
          ],
        },
      },
      {
        id: "account",
        label: account("label"),
        href: "/account",
        panel: {
          description: account("description"),
          links: [{ label: account("settings"), href: "/account" }],
        },
      },
    ];
  }

  if (actor.role === "EXECUTOR") {
    return [
      { id: "dashboard", label: dashboard("label"), href: "/dashboard" },
      {
        id: "assigned",
        label: assigned("label"),
        href: "/orders",
        panel: {
          description: assigned("description"),
          links: [{ label: assigned("all"), href: "/orders" }],
        },
      },
      {
        id: "account",
        label: account("label"),
        href: "/account",
        panel: {
          description: account("description"),
          links: [{ label: account("settings"), href: "/account" }],
        },
      },
    ];
  }

  return [
    { id: "dashboard", label: dashboard("label"), href: "/dashboard" },
    {
      id: "projects",
      label: projects("label"),
      href: "/orders",
      panel: {
        description: projects("description"),
        links: [
          { label: projects("all"), href: "/orders" },
          { label: projects("new"), href: "/orders/new" },
        ],
      },
    },
    {
      id: "account",
      label: account("label"),
      href: "/account",
      panel: {
        description: account("description"),
        links: [{ label: account("settings"), href: "/account" }],
      },
    },
  ];
}

/**
 * The one header for the public site, the auth screens and the workspace.
 *
 * Desktop gets two sliding menus: site navigation on the left and, on the
 * right, the profile and the site settings (language, theme) as the same kind
 * of panels. Mobile gets a disclosure that works before any JavaScript.
 */
export async function SiteHeader({
  actor,
  variant = "public",
}: {
  actor?: Actor | null;
  variant?: "public" | "workspace";
}) {
  const t = await getTranslations("Header");
  const tPanels = await getTranslations("Header.panels");
  const panel = panelReader(tPanels);
  const signedIn = actor !== undefined && actor !== null;

  const items =
    variant === "workspace" && signedIn
      ? await workspaceItems(actor)
      : await publicItems();

  const settingsControls: ReactNode = (
    <div className="flex flex-col gap-1.5">
      <div className="navmenu-controls-row">
        <span>{panel("settings")("language")}</span>
        <LocaleSwitch />
      </div>
      <div className="navmenu-controls-row">
        <span>{panel("settings")("theme")}</span>
        <ThemeToggle />
      </div>
    </div>
  );

  const signOutControl: ReactNode = (
    <form action={signOutAction}>
      <button type="submit" className="navmenu-link navmenu-link-danger">
        {t("signOut")}
      </button>
    </form>
  );

  const settingsItem: NavMenuItem = {
    id: "settings",
    label: t("settings"),
    icon: <SettingsIcon />,
    panel: {
      description: panel("settings")("description"),
      content: settingsControls,
    },
  };

  const account = signedIn ? actor : null;

  const rightItems: NavMenuItem[] =
    account !== null
      ? [
          settingsItem,
          {
            id: "profile",
            label: displayName(account.name, account.email),
            href: "/account",
            panel: {
              description: tPanels("profile.description", { email: account.email }),
              links: [{ label: panel("profile")("settings"), href: "/account" }],
              content: signOutControl,
            },
          },
        ]
      : [settingsItem];

  const guestActions: ReactNode = (
    <div className="hidden items-center gap-2 md:flex">
      <ButtonLink href="/sign-in" variant="ghost" size="sm">
        {t("signIn")}
      </ButtonLink>
      <ButtonLink href="/register" size="sm">
        {t("startProject")}
      </ButtonLink>
    </div>
  );

  const signedInCluster: ReactNode =
    account !== null ? (
      <div className="hidden items-center gap-2 lg:flex">
        <RoleBadge role={account.role} />
      </div>
    ) : null;

  const mobileProfileLinks = signedIn
    ? actor.role === "CUSTOMER"
      ? [
          { href: "/dashboard", label: panel("dashboard")("label") },
          { href: "/orders", label: panel("projects")("all") },
          { href: "/orders/new", label: panel("projects")("new") },
          { href: "/account", label: panel("account")("settings") },
        ]
      : actor.role === "EXECUTOR"
        ? [
            { href: "/dashboard", label: panel("dashboard")("label") },
            { href: "/orders", label: panel("assigned")("all") },
            { href: "/account", label: panel("account")("settings") },
          ]
        : [
            { href: "/admin", label: panel("studio")("overview") },
            { href: "/admin/orders", label: panel("studio")("all") },
            { href: "/admin/users", label: panel("studio")("people") },
            { href: "/admin/portfolio", label: panel("studio")("portfolio") },
            {
              href: "/admin/testimonials",
              label: panel("studio")("testimonials"),
            },
            { href: "/account", label: panel("account")("settings") },
          ]
    : [
        { href: "/sign-in", label: t("signIn") },
        { href: "/register", label: t("startProject") },
      ];

  const mobileLinks = items.map((item) => ({
    href: item.href ?? "#",
    label: item.label,
  }));

  return (
    <header className="site-bar">
      <Container className="flex h-14 items-center gap-4">
        <Link href="/" className="flex items-center" aria-label={t("home")}>
          <Wordmark size="sm" />
        </Link>

        <NavMenu items={items} ariaLabel="Main" />

        <div className="ml-auto flex items-center gap-2">
          <NavMenu items={rightItems} ariaLabel={t("rightNav")} className="ml-auto" />
          {signedIn ? signedInCluster : guestActions}
        </div>

        <MobileMenu>
          <nav
            aria-label="Main"
            className="menu-panel absolute right-0 z-50 mt-2 w-60 p-1.5"
          >
            <MobileNavLinks links={mobileLinks} />
            <div className="my-1.5 border-t border-line" />
            <MobileNavLinks links={mobileProfileLinks} />
            {signedIn ? (
              <form
                action={signOutAction}
                className="mt-1.5 border-t border-line pt-1.5"
              >
                <button type="submit" className="menu-link w-full text-left">
                  {t("signOut")}
                </button>
              </form>
            ) : null}
            <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-line px-1 pt-2">
              <LocaleSwitch />
              <ThemeToggle />
            </div>
          </nav>
        </MobileMenu>
      </Container>
    </header>
  );
}
