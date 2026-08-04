import { OrdersScreen } from '@/features/admin/orders';
import { getOrders } from '@/lib/admin';
import type { Dictionary } from '@/lib/i18n';
import { toLocale } from '@/lib/i18n/locales';
import { getT } from '@/lib/i18n/server';

export default async function OrdersPage() {
  const [{ i18n, lng }, result] = await Promise.all([
    getT('common'),
    getOrders(),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;

  return (
    <OrdersScreen orders={result.data} locale={toLocale(lng)} copy={copy} />
  );
}
