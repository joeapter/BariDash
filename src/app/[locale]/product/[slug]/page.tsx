import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Button from '@/components/Button';
import { addToCart } from '@/lib/actions/cart';
import { getProductBySlug } from '@/lib/data';
import { formatPrice } from '@/lib/format';
import { localizeField } from '@/lib/localize';

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'product' });
  const catalog = await getTranslations({ locale, namespace: 'catalog' });
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const name = localizeField(locale, { en: product.name_en, he: product.name_he });
  const description = localizeField(locale, {
    en: product.description_en ?? undefined,
    he: product.description_he ?? undefined
  });
  const ingredients = localizeField(locale, {
    en: product.ingredients_en ?? undefined,
    he: product.ingredients_he ?? undefined
  });
  const price = product.sale_price_ils ?? product.price_ils;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-soft">
          <Image
            src={product.image_url || 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80'}
            alt={name}
            fill
            className="object-cover"
          />
          {product.same_day_eligible && (
            <div className="absolute left-4 top-4 rounded-full bg-emerald-900/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              {t('delivery')}
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-500">{product.brand}</p>
            <h1 className="mt-3 text-3xl font-semibold text-emerald-950 md:text-4xl">{name}</h1>
          </div>
          <div className="flex items-center gap-3 text-xl font-semibold text-emerald-950">
            <span>{formatPrice(price, locale)}</span>
            {product.sale_price_ils && (
              <span className="text-sm font-medium text-emerald-400 line-through">
                {formatPrice(product.price_ils, locale)}
              </span>
            )}
          </div>
          <p className="text-base text-emerald-700">{description}</p>

          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 text-sm text-emerald-700">
            <p className="font-semibold text-emerald-900">{t('ingredients')}</p>
            <p className="mt-1">{ingredients}</p>
          </div>

          <form action={addToCart} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="locale" value={locale} />
            <Button type="submit" size="lg" disabled={product.stock_qty <= 0}>
              {product.stock_qty > 0 ? catalog('add') : catalog('soldOut')}
            </Button>
            {product.same_day_eligible && (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
                {t('sameDay')}
              </span>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
