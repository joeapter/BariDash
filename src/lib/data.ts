import { createSupabaseServerClient, hasSupabaseEnv } from '@/lib/supabase/server';
import { sampleCategories, sampleProducts } from '@/lib/sample-data';
import { Category, Product } from '@/lib/types';

const productSelect =
  'id, slug, name_en, name_he, brand, description_en, description_he, ingredients_en, ingredients_he, price_ils, sale_price_ils, stock_qty, same_day_eligible, image_url, primary_category_id';

export async function getCategories(): Promise<Category[]> {
  if (!hasSupabaseEnv()) {
    return sampleCategories;
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from('categories').select('*').order('sort_order');

  return (data as Category[]) ?? sampleCategories;
}

export async function getCatalogProducts(categorySlug?: string): Promise<Product[]> {
  if (!hasSupabaseEnv()) {
    if (!categorySlug) return sampleProducts;
    return sampleProducts.filter((product) => product.primary_category_id === categorySlug);
  }

  const supabase = createSupabaseServerClient();
  let query = supabase.from('products').select(productSelect).eq('is_active', true).order('name_en');

  if (categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (!category) {
      return [];
    }

    query = query.eq('primary_category_id', category.id);
  }

  const { data } = await query;
  return (data as Product[]) ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!hasSupabaseEnv()) {
    return sampleProducts.find((product) => product.slug === slug) ?? null;
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from('products')
    .select(productSelect)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  return (data as Product) ?? null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getCatalogProducts();
  return products.slice(0, 4);
}
