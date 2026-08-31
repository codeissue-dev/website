import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AssignExecutorForm } from "@/components/orders/assign-executor-form";
import { OrderRealtimePanel } from "@/components/orders/order-realtime-panel";
import { OrderStatusForm } from "@/components/orders/order-status-form";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { requireActorForPage } from "@/lib/auth/actor";
import {
  canAssignExecutors,
  canParticipateInOrderChat,
  transitionsAvailableTo,
} from "@/lib/auth/rbac";
import { listOrderMessages } from "@/lib/chat/queries";
import { listStatusEvents, loadOrderForActor } from "@/lib/orders/queries";
import { ORDER_STATUS_DESCRIPTIONS } from "@/lib/orders/status";
import { toChatMessagePayload, toStatusEventPayload } from "@/lib/realtime/payloads";
import { listExecutors } from "@/lib/users/queries";
import { displayName, formatDate, formatDateTime, paragraphs } from "@/lib/utils";

/** Matches the realtime backfill window: fewer rows than this means the whole history is loaded. */
const HISTORY_WINDOW = 200;

type PageProps = {
  params: Promise<{ reference: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { reference } = await params;
  return {
    title: `Project ${reference}`,
    robots: { index: false, follow: false },
  };
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h3 className="label-quiet">{label}</h3>
      <div className="mt-1.5 flex flex-col gap-2 text-sm text-ink">
        {paragraphs(value).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

export default async function OrderDetailPage({ params, searchParams }: PageProps) {
  const { reference } = await params;
  // Set by the redirect after a successful submission; the banner is the only
  // success feedback, and it reflects a row that already exists.
  const justSubmitted = (await searchParams).submitted === "1";
  const actor = await requireActorForPage(`/orders/${reference}`);

  // Authorization happens inside the lookup: an unrelated reference is
  // indistinguishable from one that does not exist.
  const order = await loadOrderForActor(actor, reference);
  if (order === null) notFound();

  const mayAssign = canAssignExecutors(actor);

  const [messages, events, executors] = await Promise.all([
    listOrderMessages(order.id, { limit: HISTORY_WINDOW }),
    listStatusEvents(order.id, { limit: HISTORY_WINDOW }),
    mayAssign ? listExecutors() : Promise.resolve([]),
  ]);

  const transitions = transitionsAvailableTo(actor, order);
  const canWrite = canParticipateInOrderChat(actor, order);

  return (
    <div className="flex flex-col gap-5">
      {justSubmitted ? (
        <div
          role="status"
          className="rounded-control border border-line bg-surface-muted px-4 py-3 text-sm text-ink"
        >
          <span className="font-medium text-positive">Request received.</span> We review
          new briefs in the order they arrive and reply in the project chat below. Every
          status change is recorded on the timeline.
        </div>
      ) : null}

      <div>
        <Link
          href={actor.role === "ADMIN" ? "/admin/orders" : "/orders"}
          className="font-mono text-xs text-ink-muted transition-colors hover:text-ink"
        >
          &larr; All projects
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs text-ink-subtle">
                {order.reference}
              </span>
              <StatusBadge status={order.status} />
            </div>
            <h1 className="page-title mt-2">{order.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-ink-muted">
              {ORDER_STATUS_DESCRIPTIONS[order.status]}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex min-w-0 flex-col gap-5">
          <Panel>
            <PanelHeader
              title="The brief"
              description={`Submitted ${formatDateTime(order.createdAt)}`}
            />
            <PanelBody className="flex flex-col gap-5">
              <Field label="The idea" value={order.detailedDescription} />
              <Field label="Problem and goals" value={order.problemStatement} />
              <Field label="Important features" value={order.keyFeatures} />
              {order.technicalPreferences ? (
                <Field
                  label="Technical preferences"
                  value={order.technicalPreferences}
                />
              ) : null}
              {order.referenceLinks ? (
                <Field label="References" value={order.referenceLinks} />
              ) : null}
            </PanelBody>
          </Panel>

          <OrderRealtimePanel
            orderId={order.id}
            viewerId={actor.id}
            canWrite={canWrite}
            initialStatus={order.status}
            initialMessages={messages.map(toChatMessagePayload)}
            initialEvents={events.map(toStatusEventPayload)}
            initialHistoryComplete={messages.length < HISTORY_WINDOW}
          />
        </div>

        <div className="flex flex-col gap-5">
          <Panel>
            <PanelHeader title="Details" />
            <PanelBody>
              <dl className="flex flex-col gap-3.5">
                <div>
                  <dt className="label-quiet">Requested deadline</dt>
                  <dd className="mt-1 text-sm text-ink">
                    {order.desiredDeadline === null
                      ? "Not specified"
                      : formatDate(order.desiredDeadline)}
                  </dd>
                </div>
                <div>
                  <dt className="label-quiet">Last update</dt>
                  <dd className="mt-1 text-sm text-ink">
                    {formatDateTime(order.updatedAt)}
                  </dd>
                </div>
                {order.completedAt !== null ? (
                  <div>
                    <dt className="label-quiet">Completed</dt>
                    <dd className="mt-1 text-sm text-ink">
                      {formatDateTime(order.completedAt)}
                    </dd>
                  </div>
                ) : null}
                {actor.role === "CUSTOMER" ? null : (
                  <div>
                    <dt className="label-quiet">Customer</dt>
                    <dd className="mt-1 text-sm text-ink">
                      {displayName(order.customerName, order.customerEmail)}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="label-quiet">Assigned to</dt>
                  <dd className="mt-1 text-sm text-ink">
                    {order.assignedExecutorId === null
                      ? "Not assigned yet"
                      : displayName(order.executorName, order.executorEmail ?? "")}
                  </dd>
                </div>
              </dl>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader
              title="Status"
              description="Only transitions your role is allowed to make are offered, and the server checks again."
            />
            <PanelBody>
              <OrderStatusForm
                orderId={order.id}
                transitions={[...transitions]}
                hasAssignedExecutor={order.assignedExecutorId !== null}
              />
            </PanelBody>
          </Panel>

          {mayAssign ? (
            <Panel>
              <PanelHeader
                title="Assignment"
                description="The assigned executor gains access to this project only."
              />
              <PanelBody>
                <AssignExecutorForm
                  orderId={order.id}
                  executors={executors.map((executor) => ({
                    id: executor.id,
                    name: executor.name,
                    email: executor.email,
                  }))}
                  currentExecutorId={order.assignedExecutorId}
                />
              </PanelBody>
            </Panel>
          ) : null}
        </div>
      </div>
    </div>
  );
}
