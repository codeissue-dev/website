import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { signOutAction } from "@/actions/auth";
import { Wordmark } from "@/components/brand/wordmark";
import { LocaleSwitch } from "@/components/layout/locale-switch";
import {
  MobileNavLinks,
  NavMenu,
  type NavMenuItem,
} from "@/components/layout/nav-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button, ButtonLink } from "@/components/ui/button";
import { ChevronDownIcon } from "@/components/ui/icon";
import { RoleBadge } from "@/components/ui/status-badge";
import { Container } from "@/components/ui/section";
import type { Actor } from "@/lib/auth/actor";
import { displayName } from "@/lib/utils";

/**
 * Panel copy is read as `panel("id")("key")`: next-intl returns raw records,
 * and the accessor keeps the string type without per-key assertions.
 */
async function publicItems(): Promise<NavMenuItem[]> {
  const t = await getTranslations("Header.panels");
  const panel = (id: string) => {
    const raw = t.raw(id) as Record<string, string>;
    return (key: string) => raw[key] ?? "";
  };

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
  const panel = (id: string) => {
    const raw = t.raw(id) as Record<string, string>;
    return (key: string) => raw[key] ?? "";
  };

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
 * Desktop gets the sliding navigation menu; mobile gets a disclosure that
 * works before any JavaScript loads. Language, theme and, once signed in,
 * the profile are present in every variant, so the product reads as one
 * ecosystem everywhere.
 */
export async function SiteHeader({
  actor,
  variant = "public",
}: {
  actor?: Actor | null;
  variant?: "public" | "workspace";
}) {
  const t = await getTranslations("Header");
  const items =
    variant === "workspace" && actor !== undefined && actor !== null
      ? await workspaceItems(actor)
      : await publicItems();

  const mobileLinks = items.map((item) => ({ href: item.href, label: item.label }));

  return (
    <header className="site-bar">
      <Container className="flex h-14 items-center gap-4">
        <Link href="/" className="flex items-center" aria-label={t("home")}>
          <Wordmark size="sm" />
        </Link>

        <NavMenu items={items} />

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <div className="pref-cluster">
            <LocaleSwitch />
            <ThemeToggle />
          </div>
          {actor !== undefined && actor !== null ? (
            <>
              <span className="hidden text-sm text-ink-muted lg:inline">
                {displayName(actor.name, actor.email)}
              </span>
              <RoleBadge role={actor.role} />
              <form action={signOutAction}>
                <Button type="submit" variant="secondary" size="sm">
                  {t("signOut")}
                </Button>
              </form>
            </>
          ) : (
            <>
              <ButtonLink href="/sign-in" variant="ghost" size="sm">
                {t("signIn")}
              </ButtonLink>
              <ButtonLink href="/register" size="sm">
                {t("startProject")}
              </ButtonLink>
            </>
          )}
        </div>

        <details className="relative ml-auto md:hidden">
          <summary className="menu-trigger">
            {t("menu")}
            <ChevronDownIcon className="ml-1.5" />
          </summary>
          <nav
            aria-label="Main"
            className="menu-panel absolute right-0 z-50 mt-2 w-60 p-1.5"
          >
            <MobileNavLinks links={mobileLinks} />
            {actor !== undefined && actor !== null ? (
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
        </details>
      </Container>
    </header>
  );
}
