import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Link
        href="/admin/orders"
        locale={locale}
        className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft"
      >
        <h2 className="text-lg font-semibold text-emerald-950">{t('orders')}</h2>
        <p className="text-sm text-emerald-600">{t('cards.orders')}</p>
      </Link>
      <Link
        href="/admin/products"
        locale={locale}
        className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft"
      >
        <h2 className="text-lg font-semibold text-emerald-950">{t('products')}</h2>
        <p className="text-sm text-emerald-600">{t('cards.products')}</p>
      </Link>
      <Link
        href="/admin/zones"
        locale={locale}
        className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft"
      >
        <h2 className="text-lg font-semibold text-emerald-950">{t('zones')}</h2>
        <p className="text-sm text-emerald-600">{t('cards.zones')}</p>
      </Link>
      <Link
        href="/admin/promos"
        locale={locale}
        className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft"
      >
        <h2 className="text-lg font-semibold text-emerald-950">{t('promos')}</h2>
        <p className="text-sm text-emerald-600">{t('cards.promos')}</p>
      </Link>
    </div>
  );
}
