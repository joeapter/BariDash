import { getTranslations } from 'next-intl/server';

import Button from '@/components/Button';
import { updateOrderStatus } from '@/lib/actions/admin';
import { formatPrice } from '@/lib/format';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const STATUSES = [
  'pending_payment',
  'paid',
  'preparing',
  'delivering',
  'delivered',
  'cancelled'
];

export default async function AdminOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  const supabase = await createSupabaseServerClient();

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total_ils, delivery_type, delivery_eta, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft">
      <h2 className="text-lg font-semibold text-emerald-950">{t('latestOrders')}</h2>
      <div className="mt-4 space-y-4">
        {(orders ?? []).map((order) => (
          <div key={order.id} className="rounded-2xl border border-emerald-100 bg-white/80 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-950">#{order.id.slice(0, 8)}</p>
                <p className="text-xs text-emerald-600">
                {new Date(order.created_at).toLocaleString(locale)} · {order.delivery_type}
                </p>
              </div>
              <div className="text-sm font-semibold text-emerald-900">
                {formatPrice(order.total_ils, locale)}
              </div>
            </div>
            <form action={updateOrderStatus} className="mt-3 flex flex-wrap items-center gap-2">
              <input type="hidden" name="orderId" value={order.id} />
              <input type="hidden" name="locale" value={locale} />
              <select
                name="status"
                defaultValue={order.status}
                className="rounded-full border-emerald-200 bg-white px-3 py-1 text-sm"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="ghost" size="sm">
                {t('updateStatus')}
              </Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
