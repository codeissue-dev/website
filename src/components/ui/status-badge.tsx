import { useTranslations } from "next-intl";

import type { UserRole } from "@/lib/auth/roles";
import { type OrderStatus } from "@/lib/orders/status";
import { cn } from "@/lib/utils";

/**
 * Status tones.
 *
 * Only three meanings exist: work is moving (accent), somebody is waiting
 * (caution), the project ended well or badly (positive, critical).
 */
const STATUS_TONES: Record<OrderStatus, string> = {
  SUBMITTED: "badge-neutral",
  REVIEWING: "badge-caution",
  ACCEPTED: "badge-accent",
  IN_PROGRESS: "badge-accent",
  WAITING_FOR_CUSTOMER: "badge-caution",
  QUALITY_ASSURANCE: "badge-accent",
  COMPLETED: "badge-positive",
  CANCELED: "badge-critical",
};

export function StatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  const t = useTranslations("Statuses");

  return (
    <span className={cn("badge", STATUS_TONES[status], className)}>{t(status)}</span>
  );
}

export function RoleBadge({ role, className }: { role: UserRole; className?: string }) {
  const t = useTranslations("Roles");

  return <span className={cn("badge badge-neutral", className)}>{t(role)}</span>;
}
