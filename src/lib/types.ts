export type Category = {
  id: string;
  slug: string;
  name_en: string;
  name_he: string;
  sort_order: number | null;
};

export type Product = {
  id: string;
  slug: string;
  name_en: string;
  name_he: string;
  brand: string | null;
  description_en: string | null;
  description_he: string | null;
  ingredients_en: string | null;
  ingredients_he: string | null;
  price_ils: number;
  sale_price_ils: number | null;
  stock_qty: number;
  same_day_eligible: boolean;
  image_url: string | null;
  primary_category_id: string | null;
};

export type CartItem = {
  id: string;
  quantity: number;
  product: Product;
};

export type OrderItem = {
  id: string;
  product_name_en: string;
  product_name_he: string;
  unit_price_ils: number;
  quantity: number;
  line_total_ils: number;
};

export type Order = {
  id: string;
  status: string;
  subtotal_ils: number;
  delivery_fee_ils: number;
  discount_ils: number;
  total_ils: number;
  delivery_type: string;
  delivery_eta: string | null;
  created_at: string;
};
