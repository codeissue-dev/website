import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { NewOrderForm } from "@/components/forms/new-order-form";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { requireActorForPage } from "@/lib/auth/actor";
import { PageHeading } from "@/components/ui/page-heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NewOrder");
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function NewOrderPage() {
  // The request is always filed for the signed-in account; the form never sends
  // a customer identifier.
  await requireActorForPage("/orders/new");
  const t = await getTranslations("NewOrder");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <PageHeading title={t("title")} description={t("description")} />

      <Panel>
        <PanelHeader title={t("panel")} description={t("panelHint")} />
        <PanelBody>
          <NewOrderForm />
        </PanelBody>
      </Panel>
    </div>
  );
}
