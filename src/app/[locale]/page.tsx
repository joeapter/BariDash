import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

import ProductCard from '@/components/ProductCard';
import { buttonClasses } from '@/components/Button';
import { getFeaturedProducts } from '@/lib/data';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const hero = await getTranslations({ locale, namespace: 'hero' });
  const pillars = await getTranslations({ locale, namespace: 'pillars' });
  const home = await getTranslations({ locale, namespace: 'home' });
  const products = await getFeaturedProducts();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-emerald-50" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 shadow-sm">
              {hero('badge')}
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            </span>
            <h1 className="text-4xl font-semibold text-emerald-950 md:text-5xl">
              {hero('headline')}
            </h1>
            <p className="text-lg text-emerald-700">{hero('subhead')}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/catalog" locale={locale} className={buttonClasses({ variant: 'primary', size: 'lg' })}>
                {hero('ctaPrimary')}
              </Link>
              <Link href="/fast-and-free" locale={locale} className={buttonClasses({ variant: 'ghost', size: 'lg' })}>
                {hero('ctaSecondary')}
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-emerald-700">
              <span className="rounded-full border border-emerald-200 bg-white/70 px-3 py-1">{home('tags.rbs')}</span>
              <span className="rounded-full border border-emerald-200 bg-white/70 px-3 py-1">{home('tags.freeSameDay')}</span>
              <span className="rounded-full border border-emerald-200 bg-white/70 px-3 py-1">{home('tags.premiumBrands')}</span>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-card">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">{home('fastCard.eyebrow')}</p>
              <p className="mt-3 text-2xl font-semibold text-emerald-950">{home('fastCard.title')}</p>
              <p className="mt-2 text-sm text-emerald-600">{home('fastCard.body')}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4">
                <p className="text-sm font-semibold text-emerald-700">{home('fastHighlights.coldChainTitle')}</p>
                <p className="text-xs text-emerald-600">{home('fastHighlights.coldChainBody')}</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4">
                <p className="text-sm font-semibold text-emerald-700">{home('fastHighlights.verifiedTitle')}</p>
                <p className="text-xs text-emerald-600">{home('fastHighlights.verifiedBody')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-3xl font-semibold text-emerald-950">{pillars('title')}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft">
            <p className="text-lg font-semibold text-emerald-950">{pillars('items.curated.title')}</p>
            <p className="mt-2 text-sm text-emerald-600">{pillars('items.curated.body')}</p>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft">
            <p className="text-lg font-semibold text-emerald-950">{pillars('items.fast.title')}</p>
            <p className="mt-2 text-sm text-emerald-600">{pillars('items.fast.body')}</p>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft">
            <p className="text-lg font-semibold text-emerald-950">{pillars('items.fresh.title')}</p>
            <p className="mt-2 text-sm text-emerald-600">{pillars('items.fresh.body')}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-emerald-950">{home('featuredTitle')}</h2>
          <Link href="/catalog" locale={locale} className="text-sm font-semibold text-emerald-600 hover:text-emerald-800">
            {home('viewAll')}
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
