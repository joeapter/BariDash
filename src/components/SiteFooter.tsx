import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

export default async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'brand' });
  const nav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <footer className="border-t border-emerald-100 bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-emerald-900 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-base font-semibold text-emerald-950">{t('name')}</p>
          <p className="text-emerald-700">{t('tagline')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-emerald-700">
          <Link href="/catalog" locale={locale} className="transition hover:text-emerald-900">
            {nav('catalog')}
          </Link>
          <Link href="/fast-and-free" locale={locale} className="transition hover:text-emerald-900">
            {nav('fastDelivery')}
          </Link>
          <Link href="/account" locale={locale} className="transition hover:text-emerald-900">
            {nav('account')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
