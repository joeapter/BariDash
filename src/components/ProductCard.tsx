import Image from 'next/image';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

import Button from '@/components/Button';
import { addToCart } from '@/lib/actions/cart';
import { formatPrice } from '@/lib/format';
import { localizeField } from '@/lib/localize';
import { Product } from '@/lib/types';

export default async function ProductCard({ product, locale }: { product: Product; locale: string }) {
  const t = await getTranslations({ locale, namespace: 'catalog' });
  const name = localizeField(locale, { en: product.name_en, he: product.name_he });
  const price = product.sale_price_ils ?? product.price_ils;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-soft">
      <Link href={`/product/${product.slug}`} locale={locale} className="relative aspect-[4/3] w-full">
        <Image
          src={product.image_url || 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80'}
          alt={name}
          fill
          className="object-cover"
        />
        {product.same_day_eligible && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-900/80 px-3 py-1 text-xs font-semibold text-white">
            5h
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-500">{product.brand}</p>
          <Link href={`/product/${product.slug}`} locale={locale} className="mt-2 block text-lg font-semibold text-emerald-950">
            {name}
          </Link>
        </div>
        <div className="flex items-center gap-2 text-base font-semibold text-emerald-950">
          <span>{formatPrice(price, locale)}</span>
          {product.sale_price_ils && (
            <span className="text-sm font-medium text-emerald-400 line-through">
              {formatPrice(product.price_ils, locale)}
            </span>
          )}
        </div>
        <form action={addToCart} className="mt-auto">
          <input type="hidden" name="productId" value={product.id} />
          <input type="hidden" name="locale" value={locale} />
          <Button type="submit" className="w-full" disabled={product.stock_qty <= 0}>
            {product.stock_qty > 0 ? t('add') : t('soldOut')}
          </Button>
        </form>
      </div>
    </div>
  );
}
