import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/forms/register-form";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { getActor } from "@/lib/auth/actor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create an account",
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  const actor = await getActor();
  if (actor !== null) redirect("/dashboard");

  return (
    <Panel>
      <PanelHeader
        title="Create an account"
        description="An account is all you need to submit a project request and follow the work."
      />
      <PanelBody>
        <RegisterForm />
        <p className="mt-6 text-sm text-ink-muted">
          Already registered?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
          >
            Sign in
          </Link>
          .
        </p>
      </PanelBody>
    </Panel>
  );
}
