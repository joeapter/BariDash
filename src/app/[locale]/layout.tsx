import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { locales } from '@/i18n';
import { bodyFont, displayFont } from '@/lib/fonts';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

import '../globals.css';

export const metadata: Metadata = {
  title: 'BariDash Israel',
  description: 'Same-day supplements and vitamins in Ramat Beit Shemesh.'
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const direction = locale === 'he' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction}>
      <body className={`${bodyFont.variable} ${displayFont.variable} bg-leaf-gradient text-slate-900`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="min-h-screen bg-herb-pattern bg-[length:140px_140px]">
            <div className="min-h-screen backdrop-blur-[1px]">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter locale={locale} />
            </div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
