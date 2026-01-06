import { getTranslations } from 'next-intl/server';

export default async function FastAndFreePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'fast' });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-emerald-950">{t('title')}</h1>
        <p className="mt-3 text-emerald-600">{t('subtitle')}</p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft">
          <p className="text-lg font-semibold text-emerald-950">{t('steps.order.title')}</p>
          <p className="mt-2 text-sm text-emerald-600">{t('steps.order.body')}</p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft">
          <p className="text-lg font-semibold text-emerald-950">{t('steps.pack.title')}</p>
          <p className="mt-2 text-sm text-emerald-600">{t('steps.pack.body')}</p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft">
          <p className="text-lg font-semibold text-emerald-950">{t('steps.deliver.title')}</p>
          <p className="mt-2 text-sm text-emerald-600">{t('steps.deliver.body')}</p>
        </div>
      </div>
    </div>
  );
}
