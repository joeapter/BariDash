import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

import Button, { buttonClasses } from '@/components/Button';
import { startCheckout } from '@/lib/actions/checkout';
import { getCurrentUser } from '@/lib/auth';
import { formatPrice } from '@/lib/format';
import { localizeField } from '@/lib/localize';
import { meshulamConfigured } from '@/lib/meshulam';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type CheckoutCartProduct = {
  name_en: string;
  name_he: string;
  price_ils: number;
  sale_price_ils: number | null;
};

type CheckoutCartItemRow = {
  id: string;
  quantity: number;
  product: CheckoutCartProduct;
};

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'checkout' });
  const cart = await getTranslations({ locale, namespace: 'cart' });
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-emerald-950">{t('title')}</h1>
        <p className="mt-3 text-emerald-600">{t('required')}</p>
        <div className="mt-6 flex justify-center">
          <Link href="/account" locale={locale} className={buttonClasses({ variant: 'primary', size: 'lg' })}>
            {cart('checkout')}
          </Link>
        </div>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('cart_items')
    .select('id, quantity, product:products(name_en, name_he, price_ils, sale_price_ils)')
    .eq('user_id', user.id)
    .returns<CheckoutCartItemRow[]>();

  const items = data ?? [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-emerald-950">{t('title')}</h1>
        <p className="mt-3 text-emerald-600">{cart('empty')}</p>
        <div className="mt-6 flex justify-center">
          <Link href="/catalog" locale={locale} className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
            {cart('continue')}
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.sale_price_ils ?? item.product.price_ils;
    return sum + price * item.quantity;
  }, 0);

  const paymentReady = meshulamConfigured();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-emerald-950">{t('title')}</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <form action={startCheckout} className="space-y-5 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft">
          <input type="hidden" name="locale" value={locale} />
          <div>
            <label className="text-sm font-medium text-emerald-900">{t('fullName')}</label>
            <input
              name="fullName"
              required
              className="mt-2 w-full rounded-2xl border-emerald-200 bg-white px-4 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-emerald-900">{t('phone')}</label>
            <input
              name="phone"
              required
              className="mt-2 w-full rounded-2xl border-emerald-200 bg-white px-4 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-emerald-900">{t('address')}</label>
            <input
              name="line1"
              required
              className="mt-2 w-full rounded-2xl border-emerald-200 bg-white px-4 py-2"
              placeholder={t('addressPlaceholder')}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-emerald-900">{t('apartment')}</label>
            <input
              name="line2"
              className="mt-2 w-full rounded-2xl border-emerald-200 bg-white px-4 py-2"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-emerald-900">{t('city')}</label>
              <input
                name="city"
                required
                defaultValue="Ramat Beit Shemesh"
                className="mt-2 w-full rounded-2xl border-emerald-200 bg-white px-4 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-emerald-900">{t('notes')}</label>
            <input
              name="notes"
              className="mt-2 w-full rounded-2xl border-emerald-200 bg-white px-4 py-2"
              placeholder={t('notesPlaceholder')}
            />
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {t('fastDeliveryNote')}
          </div>
          <Button type="submit" size="lg" disabled={!paymentReady} className="w-full">
            {t('placeOrder')}
          </Button>
          {!paymentReady && (
            <p className="text-xs text-amber-700">
              {t('missingPayment')}
            </p>
          )}
        </form>
        <div className="h-fit rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-emerald-950">{cart('summary')}</h2>
          <div className="mt-4 space-y-3 text-sm text-emerald-700">
            {items.map((item) => {
              const name = localizeField(locale, {
                en: item.product.name_en,
                he: item.product.name_he
              });
              const price = item.product.sale_price_ils ?? item.product.price_ils;
              return (
                <div key={name} className="flex items-center justify-between">
                  <span>
                    {name} × {item.quantity}
                  </span>
                  <span>{formatPrice(price * item.quantity, locale)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-emerald-100 pt-4 text-sm font-semibold text-emerald-900">
            <span>{cart('subtotal')}</span>
            <span>{formatPrice(subtotal, locale)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
