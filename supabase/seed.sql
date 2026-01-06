insert into public.categories (slug, name_en, name_he, sort_order)
values
  ('vitamins', 'Vitamins', 'ויטמינים', 1),
  ('minerals', 'Minerals', 'מינרלים', 2),
  ('herbal', 'Herbal', 'צמחי מרפא', 3),
  ('omega', 'Omega 3', 'אומגה 3', 4),
  ('probiotics', 'Probiotics', 'פרוביוטיקה', 5),
  ('protein', 'Protein', 'חלבון', 6)
on conflict (slug) do nothing;

insert into public.products (
  slug,
  name_en,
  name_he,
  brand,
  description_en,
  description_he,
  ingredients_en,
  ingredients_he,
  price_ils,
  sale_price_ils,
  stock_qty,
  same_day_eligible,
  primary_category_id,
  image_url,
  is_active
)
values
  (
    'daily-multi',
    'Daily Multi Essentials',
    'מולטי ויטמין יומי',
    'Nordic Roots',
    'Complete daily multivitamin with methylated B-complex.',
    'מולטי ויטמין יומי מלא עם קומפלקס B מתילטי.',
    'Vitamin A, C, D3, E, B6, B12, Folate, Zinc.',
    'ויטמין A, C, D3, E, B6, B12, חומצה פולית, אבץ.',
    149,
    129,
    42,
    true,
    (select id from public.categories where slug = 'vitamins'),
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'vitamin-d3-k2',
    'Vitamin D3 + K2 Balance',
    'ויטמין D3 עם K2',
    'Sunwise',
    'Immune and bone support with synergistic D3 + K2.',
    'תמיכה חיסונית ועצמות עם שילוב D3 ו-K2.',
    'Vitamin D3 2000 IU, Vitamin K2 MK-7.',
    'ויטמין D3 2000 יחב״ל, ויטמין K2 MK-7.',
    89,
    null,
    65,
    true,
    (select id from public.categories where slug = 'vitamins'),
    'https://images.unsplash.com/photo-1550572017-edd951aa8f7e?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'magnesium-glycinate',
    'Magnesium Glycinate Calm',
    'מגנזיום גליצינאט',
    'MineralCraft',
    'Gentle, highly absorbable magnesium for relaxation.',
    'מגנזיום עדין ונספג היטב להרפיה.',
    'Magnesium (bisglycinate) 200mg.',
    'מגנזיום (ביסגליצינאט) 200 מ״ג.',
    119,
    105,
    38,
    true,
    (select id from public.categories where slug = 'minerals'),
    'https://images.unsplash.com/photo-1616671276441-2f2cf1e7b1a2?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'omega-3-pure',
    'Omega-3 Pure Strength',
    'אומגה 3 עוצמתי',
    'BlueCurrent',
    'Triple-tested fish oil with high EPA/DHA.',
    'שמן דגים בבדיקות איכות עם EPA/DHA גבוהים.',
    'Fish oil concentrate, natural lemon flavor.',
    'ריכוז שמן דגים, טעם לימון טבעי.',
    159,
    null,
    27,
    true,
    (select id from public.categories where slug = 'omega'),
    'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'probiotic-20b',
    'Probiotic 20B CFU',
    'פרוביוטיקה 20 מיליארד',
    'FloraLab',
    'Daily gut support with 10 diverse strains.',
    'תמיכה יומית במערכת העיכול עם 10 זנים שונים.',
    'Lactobacillus, Bifidobacterium blends.',
    'לקטובצילוס, ביפידובקטריום.',
    139,
    119,
    50,
    true,
    (select id from public.categories where slug = 'probiotics'),
    'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'ashwagandha-balance',
    'Ashwagandha Balance',
    'אשווגנדה איזון',
    'Adaptogenica',
    'Adaptogenic support for stress and focus.',
    'תמיכה אדפטוגנית ללחץ וריכוז.',
    'KSM-66 Ashwagandha extract.',
    'תמצית אשווגנדה KSM-66.',
    112,
    98,
    41,
    true,
    (select id from public.categories where slug = 'herbal'),
    'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'collagen-peptides',
    'Collagen Peptides',
    'קולגן פפטידים',
    'GlowForm',
    'Unflavored collagen for skin, hair, and joints.',
    'קולגן ללא טעם לעור, שיער ומפרקים.',
    'Hydrolyzed collagen peptides.',
    'פפטידי קולגן הידרוליזה.',
    189,
    169,
    19,
    true,
    (select id from public.categories where slug = 'protein'),
    'https://images.unsplash.com/photo-1505576633757-0ac1084af824?auto=format&fit=crop&w=800&q=80',
    true
  )
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_he = excluded.name_he,
  brand = excluded.brand,
  description_en = excluded.description_en,
  description_he = excluded.description_he,
  ingredients_en = excluded.ingredients_en,
  ingredients_he = excluded.ingredients_he,
  price_ils = excluded.price_ils,
  sale_price_ils = excluded.sale_price_ils,
  stock_qty = excluded.stock_qty,
  same_day_eligible = excluded.same_day_eligible,
  primary_category_id = excluded.primary_category_id,
  image_url = excluded.image_url,
  is_active = excluded.is_active;

insert into public.delivery_zones (city, name_en, name_he, fee_ils, min_order_free_ils, fast_and_free, estimated_hours)
select 'Ramat Beit Shemesh', 'Ramat Beit Shemesh', 'רמת בית שמש', 0, 0, true, 5
where not exists (
  select 1 from public.delivery_zones where city = 'Ramat Beit Shemesh'
);

insert into public.promos (code, description_en, description_he, discount_type, discount_value, min_order_ils, is_active)
select 'FIRST10', '10% off first order', '10% הנחה להזמנה ראשונה', 'percent', 10, 150, true
where not exists (
  select 1 from public.promos where code = 'FIRST10'
);
