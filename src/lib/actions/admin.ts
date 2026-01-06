'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const IMAGE_BUCKET = 'product-images';

function getLocale(formData: FormData) {
  const locale = formData.get('locale');
  return typeof locale === 'string' && locale ? locale : 'he';
}

function getImageFile(formData: FormData) {
  const file = formData.get('image_file');
  if (!(file instanceof File)) return null;
  return file.size > 0 ? file : null;
}

function getImageExtension(file: File) {
  const fromName = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;
  const fromType = file.type.split('/').pop()?.toLowerCase() ?? '';
  if (fromType && /^[a-z0-9]+$/.test(fromType)) return fromType;
  return 'jpg';
}

async function uploadProductImage(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  productId: string,
  file: File
) {
  const ext = getImageExtension(file);
  const path = `products/${productId}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, buffer, {
    contentType: file.type || `image/${ext}`,
    cacheControl: '3600',
    upsert: true
  });

  if (error) {
    return null;
  }

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl ?? null;
}

function toNumber(value: FormDataEntryValue | null, fallback = 0) {
  if (typeof value !== 'string') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function updateOrderStatus(formData: FormData) {
  const locale = getLocale(formData);
  await requireAdmin(locale);

  const orderId = formData.get('orderId');
  const status = formData.get('status');

  if (typeof orderId !== 'string' || typeof status !== 'string') {
    return;
  }

  const supabase = await createSupabaseServerClient();
  await supabase.from('orders').update({ status }).eq('id', orderId);

  revalidatePath(`/${locale}/admin/orders`);
}

export async function createProduct(formData: FormData) {
  const locale = getLocale(formData);
  await requireAdmin(locale);

  const nameEn = String(formData.get('name_en') ?? '').trim();
  const nameHe = String(formData.get('name_he') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();
  const brand = String(formData.get('brand') ?? '').trim();
  const imageUrl = String(formData.get('image_url') ?? '').trim();
  const imageFile = getImageFile(formData);
  const price = toNumber(formData.get('price_ils'));
  const salePrice = toNumber(formData.get('sale_price_ils'));
  const stockQty = Math.max(0, Math.floor(toNumber(formData.get('stock_qty'), 0)));
  const primaryCategoryId = String(formData.get('primary_category_id') ?? '').trim();

  if (!nameEn || !nameHe || !slug) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  const { data: created } = await supabase
    .from('products')
    .insert({
      name_en: nameEn,
      name_he: nameHe,
      slug,
      brand: brand || null,
      image_url: imageUrl || null,
      price_ils: price,
      sale_price_ils: salePrice || null,
      stock_qty: stockQty,
      primary_category_id: primaryCategoryId || null,
      same_day_eligible: true,
      is_active: true
    })
    .select('id')
    .single();

  if (created && imageFile) {
    const uploadedUrl = await uploadProductImage(supabase, created.id, imageFile);
    if (uploadedUrl) {
      await supabase.from('products').update({ image_url: uploadedUrl }).eq('id', created.id);
    }
  }

  revalidatePath(`/${locale}/admin/products`);
}

export async function updateProduct(formData: FormData) {
  const locale = getLocale(formData);
  await requireAdmin(locale);

  const productId = formData.get('product_id');

  if (typeof productId !== 'string') {
    return;
  }

  const imageUrl = String(formData.get('image_url') ?? '').trim();
  const imageFile = getImageFile(formData);

  const supabase = await createSupabaseServerClient();
  const updates = {
    name_en: String(formData.get('name_en') ?? '').trim(),
    name_he: String(formData.get('name_he') ?? '').trim(),
    brand: String(formData.get('brand') ?? '').trim(),
    image_url: imageUrl || null,
    price_ils: toNumber(formData.get('price_ils')),
    sale_price_ils: toNumber(formData.get('sale_price_ils')) || null,
    stock_qty: Math.max(0, Math.floor(toNumber(formData.get('stock_qty'), 0))),
    same_day_eligible: formData.get('same_day_eligible') === 'on',
    is_active: formData.get('is_active') === 'on'
  };

  if (imageFile) {
    const uploadedUrl = await uploadProductImage(supabase, productId, imageFile);
    if (uploadedUrl) {
      updates.image_url = uploadedUrl;
    }
  }

  await supabase.from('products').update(updates).eq('id', productId);

  revalidatePath(`/${locale}/admin/products`);
}

export async function createZone(formData: FormData) {
  const locale = getLocale(formData);
  await requireAdmin(locale);

  const nameEn = String(formData.get('name_en') ?? '').trim();
  const nameHe = String(formData.get('name_he') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  const fee = toNumber(formData.get('fee_ils'));
  const minFree = toNumber(formData.get('min_order_free_ils'));
  const hours = Math.max(1, Math.floor(toNumber(formData.get('estimated_hours'), 5)));
  const fastAndFree = formData.get('fast_and_free') === 'on';

  if (!nameEn || !nameHe || !city) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  await supabase.from('delivery_zones').insert({
    name_en: nameEn,
    name_he: nameHe,
    city,
    fee_ils: fee,
    min_order_free_ils: minFree,
    estimated_hours: hours,
    fast_and_free: fastAndFree,
    is_active: true
  });

  revalidatePath(`/${locale}/admin/zones`);
}

export async function updateZone(formData: FormData) {
  const locale = getLocale(formData);
  await requireAdmin(locale);

  const zoneId = formData.get('zone_id');
  if (typeof zoneId !== 'string') {
    return;
  }

  const supabase = await createSupabaseServerClient();
  await supabase
    .from('delivery_zones')
    .update({
      name_en: String(formData.get('name_en') ?? '').trim(),
      name_he: String(formData.get('name_he') ?? '').trim(),
      city: String(formData.get('city') ?? '').trim(),
      fee_ils: toNumber(formData.get('fee_ils')),
      min_order_free_ils: toNumber(formData.get('min_order_free_ils')),
      estimated_hours: Math.max(1, Math.floor(toNumber(formData.get('estimated_hours'), 5))),
      fast_and_free: formData.get('fast_and_free') === 'on',
      is_active: formData.get('is_active') === 'on'
    })
    .eq('id', zoneId);

  revalidatePath(`/${locale}/admin/zones`);
}

export async function createPromo(formData: FormData) {
  const locale = getLocale(formData);
  await requireAdmin(locale);

  const code = String(formData.get('code') ?? '').trim().toUpperCase();
  const descriptionEn = String(formData.get('description_en') ?? '').trim();
  const descriptionHe = String(formData.get('description_he') ?? '').trim();
  const discountType = String(formData.get('discount_type') ?? 'percent');
  const discountValue = toNumber(formData.get('discount_value'));
  const minOrder = toNumber(formData.get('min_order_ils'));

  if (!code) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  await supabase.from('promos').insert({
    code,
    description_en: descriptionEn,
    description_he: descriptionHe,
    discount_type: discountType,
    discount_value: discountValue,
    min_order_ils: minOrder,
    is_active: true
  });

  revalidatePath(`/${locale}/admin/promos`);
}

export async function updatePromo(formData: FormData) {
  const locale = getLocale(formData);
  await requireAdmin(locale);

  const promoId = formData.get('promo_id');
  if (typeof promoId !== 'string') {
    return;
  }

  const supabase = await createSupabaseServerClient();
  await supabase
    .from('promos')
    .update({
      code: String(formData.get('code') ?? '').trim().toUpperCase(),
      description_en: String(formData.get('description_en') ?? '').trim(),
      description_he: String(formData.get('description_he') ?? '').trim(),
      discount_type: String(formData.get('discount_type') ?? 'percent'),
      discount_value: toNumber(formData.get('discount_value')),
      min_order_ils: toNumber(formData.get('min_order_ils')),
      is_active: formData.get('is_active') === 'on'
    })
    .eq('id', promoId);

  revalidatePath(`/${locale}/admin/promos`);
}
