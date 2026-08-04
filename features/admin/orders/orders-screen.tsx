import { AdminPageHeader } from '@/components/admin/admin-page-header';
import type { OrderSummary } from '@/lib/admin';
import type { Dictionary } from '@/lib/i18n';

import { NewOrderMenu } from './new-order-menu';
import { OrderList } from './order-list';

export function OrdersScreen({
  orders,
  locale,
  copy,
}: {
  orders: OrderSummary[];
  locale: string;
  copy: Dictionary;
}) {
  const page = copy.admin.orders;

  return (
    <main>
      <AdminPageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        action={<NewOrderMenu copy={page} />}
      />
      <OrderList orders={orders} locale={locale} copy={page} />
    </main>
  );
}
