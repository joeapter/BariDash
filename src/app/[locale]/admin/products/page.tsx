import Button from '@/components/Button';
import { createProduct, updateProduct } from '@/lib/actions/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AdminProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: products } = await supabase
    .from('products')
    .select(
      'id, name_en, name_he, brand, image_url, price_ils, sale_price_ils, stock_qty, same_day_eligible, is_active'
    )
    .order('name_en');

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name_en, name_he')
    .order('name_en');

  return (
    <div className="space-y-6">
      <form
        action={createProduct}
        encType="multipart/form-data"
        className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft"
      >
        <input type="hidden" name="locale" value={locale} />
        <h2 className="text-lg font-semibold text-emerald-950">Add product</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input name="name_en" placeholder="Name (EN)" className="rounded-2xl border-emerald-200 bg-white px-4 py-2" />
          <input name="name_he" placeholder="Name (HE)" className="rounded-2xl border-emerald-200 bg-white px-4 py-2" />
          <input name="slug" placeholder="slug" className="rounded-2xl border-emerald-200 bg-white px-4 py-2" />
          <input name="brand" placeholder="Brand" className="rounded-2xl border-emerald-200 bg-white px-4 py-2" />
          <input
            name="image_url"
            placeholder="Image URL (optional)"
            className="rounded-2xl border-emerald-200 bg-white px-4 py-2 md:col-span-2"
          />
          <input
            type="file"
            name="image_file"
            accept="image/*"
            className="rounded-2xl border-emerald-200 bg-white px-4 py-2 md:col-span-2"
          />
          <input
            name="price_ils"
            type="number"
            step="0.01"
            placeholder="Price"
            className="rounded-2xl border-emerald-200 bg-white px-4 py-2"
          />
          <input
            name="sale_price_ils"
            type="number"
            step="0.01"
            placeholder="Sale price"
            className="rounded-2xl border-emerald-200 bg-white px-4 py-2"
          />
          <input
            name="stock_qty"
            type="number"
            placeholder="Stock"
            className="rounded-2xl border-emerald-200 bg-white px-4 py-2"
          />
          <select name="primary_category_id" className="rounded-2xl border-emerald-200 bg-white px-4 py-2">
            <option value="">Category</option>
            {(categories ?? []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name_en}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-3 text-xs text-emerald-600">
          Upload an image or paste a public https URL. Uploads will override the URL.
        </p>
        <div className="mt-4">
          <Button type="submit" variant="primary">
            Create product
          </Button>
        </div>
      </form>

      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-emerald-950">Manage products</h2>
        <div className="mt-4 space-y-4">
          {(products ?? []).map((product) => (
            <form
              key={product.id}
              action={updateProduct}
              encType="multipart/form-data"
              className="rounded-2xl border border-emerald-100 bg-white/80 p-4"
            >
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="product_id" value={product.id} />
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  name="name_en"
                  defaultValue={product.name_en}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  name="name_he"
                  defaultValue={product.name_he}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  name="brand"
                  defaultValue={product.brand ?? ''}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  name="image_url"
                  defaultValue={product.image_url ?? ''}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm md:col-span-2"
                  placeholder="Image URL (optional)"
                />
                <input
                  type="file"
                  name="image_file"
                  accept="image/*"
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm md:col-span-2"
                />
                <input
                  name="price_ils"
                  type="number"
                  step="0.01"
                  defaultValue={product.price_ils}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  name="sale_price_ils"
                  type="number"
                  step="0.01"
                  defaultValue={product.sale_price_ils ?? ''}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  name="stock_qty"
                  type="number"
                  defaultValue={product.stock_qty}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-emerald-700">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="same_day_eligible" defaultChecked={product.same_day_eligible} />
                  Same-day eligible
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="is_active" defaultChecked={product.is_active} />
                  Active
                </label>
                <Button type="submit" variant="ghost" size="sm">
                  Save
                </Button>
              </div>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
