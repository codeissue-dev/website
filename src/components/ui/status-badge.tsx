import type { UserRole } from "@/lib/auth/roles";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/orders/status";
import { cn } from "@/lib/utils";

const STATUS_TONES: Record<OrderStatus, string> = {
  SUBMITTED: "border-line-strong text-ink-muted",
  REVIEWING: "border-caution/45 text-caution",
  ACCEPTED: "border-accent/45 text-accent",
  IN_PROGRESS: "border-accent/45 text-accent",
  WAITING_FOR_CUSTOMER: "border-caution/45 text-caution",
  QUALITY_ASSURANCE: "border-accent/45 text-accent",
  COMPLETED: "border-positive/45 text-positive",
  CANCELED: "border-critical/40 text-critical",
};

export function StatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        STATUS_TONES[status],
        className,
      )}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}

const ROLE_LABELS: Record<UserRole, string> = {
  CUSTOMER: "Customer",
  EXECUTOR: "Executor",
  ADMIN: "Administrator",
};

export function roleLabel(role: UserRole): string {
  return ROLE_LABELS[role];
}

export function RoleBadge({ role, className }: { role: UserRole; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-ink-muted",
        className,
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}
