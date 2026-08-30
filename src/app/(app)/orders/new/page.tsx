import type { Metadata } from "next";

import { NewOrderForm } from "@/components/forms/new-order-form";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { requireActorForPage } from "@/lib/auth/actor";

export const metadata: Metadata = {
  title: "New project request",
  robots: { index: false, follow: false },
};

export default async function NewOrderPage() {
  // The request is always filed for the signed-in account; the form never sends
  // a customer identifier.
  await requireActorForPage("/orders/new");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-ink">
          New project request
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          The more concrete this brief is, the faster we can answer with real scope.
          Everything here is saved to your project and can be discussed in the project
          chat afterwards.
        </p>
      </div>

      <Panel>
        <PanelHeader
          title="Project brief"
          description="Fields marked as optional can be left empty."
        />
        <PanelBody>
          <NewOrderForm />
        </PanelBody>
      </Panel>
    </div>
  );
}
