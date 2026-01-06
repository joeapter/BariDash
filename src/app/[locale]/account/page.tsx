import { getTranslations } from 'next-intl/server';

import AccountAuthForm from '@/components/AccountAuthForm';
import SignOutButton from '@/components/SignOutButton';
import { getCurrentUser } from '@/lib/auth';
import { formatPrice } from '@/lib/format';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'account' });
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <AccountAuthForm />
      </div>
    );
  }

  const supabase = createSupabaseServerClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total_ils, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-emerald-950">{t('title')}</h1>
          <p className="text-emerald-600">{user.email}</p>
        </div>
        <SignOutButton label={t('signOut')} />
      </div>

      <div className="mt-8 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-emerald-950">{t('ordersTitle')}</h2>
        {orders && orders.length > 0 ? (
          <div className="mt-4 space-y-3 text-sm">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col justify-between gap-2 rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-semibold text-emerald-950">#{order.id.slice(0, 8)}</p>
                  <p className="text-emerald-600">{new Date(order.created_at).toLocaleDateString(locale)}</p>
                </div>
                <div className="text-emerald-700">{order.status}</div>
                <div className="font-semibold text-emerald-950">
                  {formatPrice(order.total_ils, locale)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-emerald-600">{t('noOrders')}</p>
        )}
      </div>
    </div>
  );
}
