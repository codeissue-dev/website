import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PasswordForm, ProfileForm } from "@/components/forms/account-forms";
import { PageHeading } from "@/components/ui/page-heading";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { RoleBadge } from "@/components/ui/status-badge";
import { requireActorForPage } from "@/lib/auth/actor";
import { formatDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Account");
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function AccountPage() {
  const [actor, t] = await Promise.all([
    requireActorForPage("/account"),
    getTranslations("Account"),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <PageHeading title={t("title")} description={t("description")} />

      <Panel>
        <PanelHeader title={t("details")} />
        <PanelBody>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="label-quiet">{t("email")}</dt>
              <dd className="mt-1 text-sm text-ink">{actor.email}</dd>
            </div>
            <div>
              <dt className="label-quiet">{t("role")}</dt>
              <dd className="mt-1">
                <RoleBadge role={actor.role} />
              </dd>
            </div>
            <div>
              <dt className="label-quiet">{t("memberSince")}</dt>
              <dd className="mt-1 text-sm text-ink">{formatDate(actor.createdAt)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
            {t("adminNote")}
          </p>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader title={t("displayName")} description={t("displayNameHint")} />
        <PanelBody>
          <ProfileForm name={actor.name ?? ""} />
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader title={t("password")} description={t("passwordHint")} />
        <PanelBody>
          <PasswordForm />
        </PanelBody>
      </Panel>
    </div>
  );
}
