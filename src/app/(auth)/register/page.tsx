import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
  const [actor, t] = await Promise.all([getActor(), getTranslations("Auth")]);
  if (actor !== null) redirect("/dashboard");

  return (
    <Panel>
      <PanelHeader title={t("registerTitle")} description={t("registerDescription")} />
      <PanelBody>
        <RegisterForm />
        <p className="mt-6 text-sm text-ink-muted">
          {t("registerPrompt")}{" "}
          <Link
            href="/sign-in"
            className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
          >
            {t("signInLink")}
          </Link>
          .
        </p>
      </PanelBody>
    </Panel>
  );
}
