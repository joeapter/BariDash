import Button from '@/components/Button';
import { createZone, updateZone } from '@/lib/actions/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AdminZonesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: zones } = await supabase
    .from('delivery_zones')
    .select('id, name_en, name_he, city, fee_ils, min_order_free_ils, estimated_hours, fast_and_free, is_active')
    .order('city');

  return (
    <div className="space-y-6">
      <form action={createZone} className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft">
        <input type="hidden" name="locale" value={locale} />
        <h2 className="text-lg font-semibold text-emerald-950">Add delivery zone</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input name="name_en" placeholder="Name (EN)" className="rounded-2xl border-emerald-200 bg-white px-4 py-2" />
          <input name="name_he" placeholder="Name (HE)" className="rounded-2xl border-emerald-200 bg-white px-4 py-2" />
          <input name="city" placeholder="City" className="rounded-2xl border-emerald-200 bg-white px-4 py-2" />
          <input name="fee_ils" type="number" step="0.01" placeholder="Fee" className="rounded-2xl border-emerald-200 bg-white px-4 py-2" />
          <input
            name="min_order_free_ils"
            type="number"
            step="0.01"
            placeholder="Min order for free"
            className="rounded-2xl border-emerald-200 bg-white px-4 py-2"
          />
          <input
            name="estimated_hours"
            type="number"
            placeholder="Estimated hours"
            className="rounded-2xl border-emerald-200 bg-white px-4 py-2"
          />
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
          <input type="checkbox" name="fast_and_free" />
          Fast &amp; Free
        </label>
        <div className="mt-4">
          <Button type="submit">Create zone</Button>
        </div>
      </form>

      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-emerald-950">Manage zones</h2>
        <div className="mt-4 space-y-4">
          {(zones ?? []).map((zone) => (
            <form
              key={zone.id}
              action={updateZone}
              className="rounded-2xl border border-emerald-100 bg-white/80 p-4"
            >
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="zone_id" value={zone.id} />
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  name="name_en"
                  defaultValue={zone.name_en}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  name="name_he"
                  defaultValue={zone.name_he}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  name="city"
                  defaultValue={zone.city}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  name="fee_ils"
                  type="number"
                  step="0.01"
                  defaultValue={zone.fee_ils}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  name="min_order_free_ils"
                  type="number"
                  step="0.01"
                  defaultValue={zone.min_order_free_ils}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  name="estimated_hours"
                  type="number"
                  defaultValue={zone.estimated_hours}
                  className="rounded-2xl border-emerald-200 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-emerald-700">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="fast_and_free" defaultChecked={zone.fast_and_free} />
                  Fast &amp; Free
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="is_active" defaultChecked={zone.is_active} />
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
