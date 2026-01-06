'use client';

import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

import LocaleSwitcher from '@/components/LocaleSwitcher';

export default function SiteHeader() {
  const t = useTranslations('nav');

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-emerald-950 transition hover:text-emerald-700"
        >
          BariDash Israel
        </Link>
        <div className="hidden items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-emerald-900 md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          {t('fastDelivery')}
        </div>
        <nav className="ms-auto flex items-center gap-4 text-sm font-medium text-emerald-900">
          <Link href="/catalog" className="transition hover:text-emerald-600">
            {t('catalog')}
          </Link>
          <Link href="/account" className="transition hover:text-emerald-600">
            {t('account')}
          </Link>
          <Link href="/cart" className="transition hover:text-emerald-600">
            {t('cart')}
          </Link>
          <Link href="/admin" className="transition hover:text-emerald-600">
            {t('admin')}
          </Link>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}
