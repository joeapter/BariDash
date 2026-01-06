import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

import { requireAdmin } from '@/lib/auth';

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  await requireAdmin(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-emerald-950">{t('title')}</h1>
          <p className="text-sm text-emerald-600">{t('subtitle')}</p>
        </div>
        <nav className="flex flex-wrap gap-2 text-sm font-semibold">
          <Link
            href="/admin/orders"
            locale={locale}
            className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1"
          >
            {t('orders')}
          </Link>
          <Link
            href="/admin/products"
            locale={locale}
            className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1"
          >
            {t('products')}
          </Link>
          <Link
            href="/admin/zones"
            locale={locale}
            className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1"
          >
            {t('zones')}
          </Link>
          <Link
            href="/admin/promos"
            locale={locale}
            className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1"
          >
            {t('promos')}
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
