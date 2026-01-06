import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

import { buttonClasses } from '@/components/Button';

export default async function PendingPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams?: { orderId?: string };
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'checkout' });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold text-emerald-950">{t('pendingTitle')}</h1>
      <p className="mt-3 text-emerald-600">{t('pendingBody')}</p>
      {searchParams?.orderId && (
        <p className="mt-2 text-sm text-emerald-500">Order ID: {searchParams.orderId}</p>
      )}
      <div className="mt-6 flex justify-center">
        <Link href="/account" locale={locale} className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
          {t('pendingCta')}
        </Link>
      </div>
    </div>
  );
}
