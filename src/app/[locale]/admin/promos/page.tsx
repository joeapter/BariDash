import Button from '@/components/Button';
import { createPromo, updatePromo } from '@/lib/actions/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const DISCOUNT_TYPES = ['percent', 'amount'];

export default async function AdminPromosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: promos } = await supabase
    .from('promos')
    .select('id, code, description_en, description_he, discount_type, discount_value, min_order_ils, is_active')
    .order('code');

  return (
    <div className="space-y-6">
      <form action={createPromo} className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft">
        <input type="hidden" name="locale" value={locale} />
        <h2 className="text-lg font-semibold text-emerald-950">Add promo</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input name="code" placeholder="CODE" className="rounded-2xl border-emerald-200 bg-white px-4 py-2" />
          <select name="discount_type" className="rounded-2xl border-emerald-200 bg-white px-4 py-2">
            {DISCOUNT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            name="discount_value"
            type="number"
            step="0.01"
            placeholder="Discount value"
            className="rounded-2xl border-emerald-200 bg-white px-4 py-2"
          />
          <input
            name="min_order_ils"
            type="number"
            step="0.01"
            placeholder="Min order"
            className="rounded-2xl border-emerald-200 bg-white px-4 py-2"
          />
          <input
            name="description_en"
            placeholder="Description (EN)"
            className="rounded-2xl border-emerald-200 bg-white px-4 py-2"
          />
          <input
            name="description_he"
            placeholder="Description (HE)"
            className="rounded-2xl border-emerald-200 bg-white px-4 py-2"
          />
        </div>
        <div className="mt-4">
          <Button type="submit">Create promo</Button>
        </div>
      </form>

      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-emerald-950">Manage promos</h2>
        <div className="mt-4 space-y-4">
          {(promos ?? []).map((promo) => (
            <form
              key={promo.id}
              action={updatePromo}
              className="rounded-2xl border border-emerald-100 bg-white/80 p-4"
            >
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="promo_id" value={promo.id} />
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  name="code"
                  defaultValue={promo.code}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                />
                <select
                  name="discount_type"
                  defaultValue={promo.discount_type}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                >
                  {DISCOUNT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <input
                  name="discount_value"
                  type="number"
                  step="0.01"
                  defaultValue={promo.discount_value}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  name="min_order_ils"
                  type="number"
                  step="0.01"
                  defaultValue={promo.min_order_ils}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  name="description_en"
                  defaultValue={promo.description_en ?? ''}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  name="description_he"
                  defaultValue={promo.description_he ?? ''}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-emerald-700">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="is_active" defaultChecked={promo.is_active} />
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
