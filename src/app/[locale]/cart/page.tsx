import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

import Button, { buttonClasses } from '@/components/Button';
import { removeCartItem, updateCartItem } from '@/lib/actions/cart';
import { getCurrentUser } from '@/lib/auth';
import { formatPrice } from '@/lib/format';
import { localizeField } from '@/lib/localize';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type CartProduct = {
  id: string;
  slug: string;
  name_en: string;
  name_he: string;
  price_ils: number;
  sale_price_ils: number | null;
  image_url: string | null;
  stock_qty: number;
};

type CartItemRow = {
  id: string;
  quantity: number;
  product: CartProduct;
};

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cart' });
  const catalog = await getTranslations({ locale, namespace: 'catalog' });
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-emerald-950">{t('title')}</h1>
        <p className="mt-3 text-emerald-600">{t('empty')}</p>
        <div className="mt-6 flex justify-center">
          <Link href="/account" locale={locale} className={buttonClasses({ variant: 'primary', size: 'lg' })}>
            {t('checkout')}
          </Link>
        </div>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('cart_items')
    .select(
      'id, quantity, product:products(id, slug, name_en, name_he, price_ils, sale_price_ils, image_url, stock_qty)'
    )
    .eq('user_id', user.id)
    .returns<CartItemRow[]>();

  const items = data ?? [];
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.sale_price_ils ?? item.product.price_ils;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-emerald-950">{t('title')}</h1>
      {items.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-emerald-100 bg-white/90 p-8 text-center">
          <p className="text-emerald-600">{t('empty')}</p>
          <Link
            href="/catalog"
            locale={locale}
            className={buttonClasses({ variant: 'secondary', size: 'lg', className: 'mt-4' })}
          >
            {t('continue')}
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {items.map((item) => {
              const name = localizeField(locale, {
                en: item.product.name_en,
                he: item.product.name_he
              });
              const price = item.product.sale_price_ils ?? item.product.price_ils;

              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-emerald-100 bg-white/90 p-4 shadow-soft"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-emerald-950">{name}</p>
                      <p className="text-sm text-emerald-500">{formatPrice(price, locale)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <form action={updateCartItem} className="flex items-center gap-2">
                        <input type="hidden" name="itemId" value={item.id} />
                        <input type="hidden" name="locale" value={locale} />
                        <input
                          type="number"
                          name="quantity"
                          min={0}
                          defaultValue={item.quantity}
                          className="w-20 rounded-full border-emerald-200 bg-white text-emerald-900"
                        />
                        <Button type="submit" variant="ghost" size="sm">
                          {t('update')}
                        </Button>
                      </form>
                      <form action={removeCartItem}>
                        <input type="hidden" name="itemId" value={item.id} />
                        <input type="hidden" name="locale" value={locale} />
                        <Button type="submit" variant="secondary" size="sm">
                          {t('remove')}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="h-fit rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-emerald-950">{t('summary')}</h2>
            <div className="mt-4 flex items-center justify-between text-sm text-emerald-700">
              <span>{t('subtotal')}</span>
              <span>{formatPrice(subtotal, locale)}</span>
            </div>
            <div className="mt-6">
              <Link
                href="/checkout"
                locale={locale}
                className={buttonClasses({ variant: 'primary', size: 'lg', className: 'w-full justify-center' })}
              >
                {t('checkout')}
              </Link>
            </div>
            <p className="mt-3 text-xs text-emerald-500">{catalog('subtitle')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
