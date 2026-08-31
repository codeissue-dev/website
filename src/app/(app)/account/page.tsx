import type { Metadata } from "next";

import { PasswordForm, ProfileForm } from "@/components/forms/account-forms";
import { PageHeading } from "@/components/ui/page-heading";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { RoleBadge } from "@/components/ui/status-badge";
import { requireActorForPage } from "@/lib/auth/actor";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const actor = await requireActorForPage("/account");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <PageHeading
        title="Account"
        description="Your sign-in details and how you appear to the project team."
      />

      <Panel>
        <PanelHeader title="Details" />
        <PanelBody>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="label-quiet">Email</dt>
              <dd className="mt-1 text-sm text-ink">{actor.email}</dd>
            </div>
            <div>
              <dt className="label-quiet">Role</dt>
              <dd className="mt-1">
                <RoleBadge role={actor.role} />
              </dd>
            </div>
            <div>
              <dt className="label-quiet">Member since</dt>
              <dd className="mt-1 text-sm text-ink">{formatDate(actor.createdAt)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
            Email addresses and roles are changed by an administrator, so that the
            history of a project always points at a stable account.
          </p>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader
          title="Display name"
          description="Shown on your messages and on any status change you make."
        />
        <PanelBody>
          <ProfileForm name={actor.name ?? ""} />
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader
          title="Password"
          description="Changing your password does not sign you out of this browser."
        />
        <PanelBody>
          <PasswordForm />
        </PanelBody>
      </Panel>
    </div>
  );
}
