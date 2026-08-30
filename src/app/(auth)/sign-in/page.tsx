import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignInForm } from "@/components/forms/sign-in-form";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { getActor } from "@/lib/auth/actor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

/** Only same-site absolute paths may be used as a post-sign-in destination. */
function safeNext(value: string | string[] | undefined): string {
  if (typeof value !== "string") return "/dashboard";
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [actor, params] = await Promise.all([getActor(), searchParams]);
  const next = safeNext(params.next);

  if (actor !== null) redirect(next);

  return (
    <Panel>
      <PanelHeader
        title="Sign in"
        description="Access your projects, history and chat."
      />
      <PanelBody>
        <SignInForm next={next} />
        <p className="mt-6 text-sm text-ink-muted">
          No account yet?{" "}
          <Link
            href="/register"
            className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
          >
            Create one
          </Link>
          .
        </p>
      </PanelBody>
    </Panel>
  );
}
