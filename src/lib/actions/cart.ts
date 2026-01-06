'use server';

import { revalidatePath } from 'next/cache';

import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function getLocaleFromForm(formData: FormData) {
  const locale = formData.get('locale');
  return typeof locale === 'string' && locale ? locale : 'he';
}

export async function addToCart(formData: FormData) {
  const productId = formData.get('productId');
  const quantityRaw = formData.get('quantity');
  const locale = getLocaleFromForm(formData);

  if (typeof productId !== 'string') {
    return;
  }

  const quantity = typeof quantityRaw === 'string' ? Number(quantityRaw) : 1;
  const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;

  const user = await requireUser(locale);
  const supabase = createSupabaseServerClient();

  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + safeQuantity })
      .eq('id', existing.id);
  } else {
    await supabase.from('cart_items').insert({
      user_id: user.id,
      product_id: productId,
      quantity: safeQuantity
    });
  }

  revalidatePath(`/${locale}/cart`);
}

export async function updateCartItem(formData: FormData) {
  const itemId = formData.get('itemId');
  const quantityRaw = formData.get('quantity');
  const locale = getLocaleFromForm(formData);

  if (typeof itemId !== 'string' || typeof quantityRaw !== 'string') {
    return;
  }

  const quantity = Number(quantityRaw);
  const safeQuantity = Number.isFinite(quantity) ? quantity : 1;
  const user = await requireUser(locale);
  const supabase = createSupabaseServerClient();

  if (safeQuantity <= 0) {
    await supabase.from('cart_items').delete().eq('id', itemId).eq('user_id', user.id);
  } else {
    await supabase
      .from('cart_items')
      .update({ quantity: safeQuantity })
      .eq('id', itemId)
      .eq('user_id', user.id);
  }

  revalidatePath(`/${locale}/cart`);
}

export async function removeCartItem(formData: FormData) {
  const itemId = formData.get('itemId');
  const locale = getLocaleFromForm(formData);

  if (typeof itemId !== 'string') {
    return;
  }

  const user = await requireUser(locale);
  const supabase = createSupabaseServerClient();

  await supabase.from('cart_items').delete().eq('id', itemId).eq('user_id', user.id);

  revalidatePath(`/${locale}/cart`);
}
