import type { UserRole } from "@/lib/auth/roles";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/orders/status";
import { cn } from "@/lib/utils";

const STATUS_TONES: Record<OrderStatus, string> = {
  SUBMITTED: "border-line-strong bg-surface-muted text-ink-muted",
  REVIEWING: "border-caution/35 bg-caution/10 text-caution",
  ACCEPTED: "border-accent/35 bg-accent/10 text-accent",
  IN_PROGRESS: "border-accent/35 bg-accent/10 text-accent",
  WAITING_FOR_CUSTOMER: "border-caution/35 bg-caution/10 text-caution",
  QUALITY_ASSURANCE: "border-accent/35 bg-accent/10 text-accent",
  COMPLETED: "border-positive/35 bg-positive/10 text-positive",
  CANCELED: "border-critical/35 bg-critical/10 text-critical",
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
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
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
        "inline-flex items-center rounded-full border border-line bg-surface-muted px-2.5 py-0.5 text-xs font-semibold text-ink-muted",
        className,
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}
