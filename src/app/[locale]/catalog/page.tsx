import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

import ProductCard from '@/components/ProductCard';
import { getCatalogProducts, getCategories } from '@/lib/data';
import { localizeField } from '@/lib/localize';

type CatalogPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: { category?: string };
};

export default async function CatalogPage({ params, searchParams }: CatalogPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'catalog' });
  const categories = await getCategories();
  const activeCategory = searchParams?.category ?? null;
  const products = await getCatalogProducts(activeCategory ?? undefined);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-emerald-950">{t('title')}</h1>
          <p className="text-emerald-600">{t('subtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm text-emerald-700 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">{t('filters')}</span>
          <Link
            href="/catalog"
            locale={locale}
            className={`rounded-full px-3 py-1 transition ${
              !activeCategory ? 'bg-brand-600 text-white' : 'hover:bg-emerald-50'
            }`}
          >
            {t('all')}
          </Link>
          {categories.map((category) => {
            const label = localizeField(locale, { en: category.name_en, he: category.name_he });
            const isActive = activeCategory === category.slug;

            return (
              <Link
                key={category.id}
                href={{ pathname: '/catalog', query: { category: category.slug } }}
                locale={locale}
                className={`rounded-full px-3 py-1 transition ${
                  isActive ? 'bg-brand-600 text-white' : 'hover:bg-emerald-50'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </div>
  );
}
