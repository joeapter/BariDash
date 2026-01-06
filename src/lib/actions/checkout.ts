'use server';

import { redirect } from 'next/navigation';

import { requireUser } from '@/lib/auth';
import { calculateDeliveryEta } from '@/lib/delivery';
import { createMeshulamSession, meshulamConfigured } from '@/lib/meshulam';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type CheckoutCartProduct = {
  id: string;
  name_en: string;
  name_he: string;
  price_ils: number;
  sale_price_ils: number | null;
  same_day_eligible: boolean;
};

type CheckoutCartItemRow = {
  id: string;
  quantity: number;
  product: CheckoutCartProduct;
};

function getLocaleFromForm(formData: FormData) {
  const locale = formData.get('locale');
  return typeof locale === 'string' && locale ? locale : 'he';
}

export async function startCheckout(formData: FormData) {
  const locale = getLocaleFromForm(formData);
  const user = await requireUser(locale);
  const supabase = await createSupabaseServerClient();

  const fullName = String(formData.get('fullName') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const line1 = String(formData.get('line1') ?? '').trim();
  const line2 = String(formData.get('line2') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  const notes = String(formData.get('notes') ?? '').trim();

  if (!fullName || !phone || !line1 || !city) {
    redirect(`/${locale}/checkout?missing=1`);
  }

  const { data: cartItems } = await supabase
    .from('cart_items')
    .select(
      'id, quantity, product:products(id, name_en, name_he, price_ils, sale_price_ils, same_day_eligible)'
    )
    .eq('user_id', user.id)
    .returns<CheckoutCartItemRow[]>();

  if (!cartItems || cartItems.length === 0) {
    redirect(`/${locale}/cart`);
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.sale_price_ils ?? item.product.price_ils;
    return sum + price * item.quantity;
  }, 0);

  const { data: zone } = await supabase
    .from('delivery_zones')
    .select('*')
    .ilike('city', city)
    .eq('is_active', true)
    .maybeSingle();

  let deliveryFee = zone?.fee_ils ?? 0;
  if (zone && zone.min_order_free_ils && subtotal >= zone.min_order_free_ils) {
    deliveryFee = 0;
  }

  const total = subtotal + deliveryFee;
  const eta = calculateDeliveryEta(new Date(), zone?.estimated_hours ?? 5);
  const deliveryType = zone?.fast_and_free ? 'fast_and_free' : 'same_day';

  const { data: address } = await supabase
    .from('addresses')
    .insert({
      user_id: user.id,
      full_name: fullName,
      phone,
      line1,
      line2,
      city,
      notes,
      is_default: true
    })
    .select('id')
    .single();

  const { data: order } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'pending_payment',
      subtotal_ils: subtotal,
      delivery_fee_ils: deliveryFee,
      discount_ils: 0,
      total_ils: total,
      delivery_zone_id: zone?.id ?? null,
      delivery_type: deliveryType,
      delivery_eta: eta.toISOString(),
      address_id: address?.id ?? null
    })
    .select('id')
    .single();

  if (!order) {
    redirect(`/${locale}/checkout?error=order`);
  }

  const orderItems = cartItems.map((item) => {
    const price = item.product.sale_price_ils ?? item.product.price_ils;
    return {
      order_id: order.id,
      product_id: item.product.id,
      product_name_en: item.product.name_en,
      product_name_he: item.product.name_he,
      unit_price_ils: price,
      quantity: item.quantity,
      line_total_ils: price * item.quantity
    };
  });

  await supabase.from('order_items').insert(orderItems);
  await supabase.from('cart_items').delete().eq('user_id', user.id);

  if (!meshulamConfigured()) {
    redirect(`/${locale}/checkout/pending?orderId=${order.id}`);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const session = await createMeshulamSession({
    orderId: order.id,
    amount: total,
    customer: {
      name: fullName,
      email: user.email ?? '',
      phone
    },
    successUrl: `${siteUrl}/${locale}/checkout/success?orderId=${order.id}`,
    cancelUrl: `${siteUrl}/${locale}/checkout/pending?orderId=${order.id}`,
    webhookUrl: `${siteUrl}/api/meshulam/webhook`
  });

  if (!session) {
    redirect(`/${locale}/checkout/pending?orderId=${order.id}`);
  }

  await supabase
    .from('orders')
    .update({ payment_provider: 'meshulam', payment_reference: session.reference ?? null })
    .eq('id', order.id);

  redirect(session.paymentUrl);
}
