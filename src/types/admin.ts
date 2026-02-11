export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category: string;
  subcategory: string | null;
  occasion: string[] | null;
  images: string[];
  sizes: string[];
  colors: string[];
  fabric: string | null;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  status: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  shipping_address: ShippingAddress | null;
  billing_address: ShippingAddress | null;
  payment_intent_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  quantity: number;
  size: string | null;
  color: string | null;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface Customer {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  orders_count?: number;
  total_spent?: number;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export const PRODUCT_CATEGORIES = [
  "Wedding",
  "Party Wear",
  "Festival",
  "Evening Gowns",
  "Cocktail Dresses",
];

export const PRODUCT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const PRODUCT_COLORS = [
  "White",
  "Ivory",
  "Champagne",
  "Gold",
  "Silver",
  "Black",
  "Navy",
  "Burgundy",
  "Blush",
  "Royal Blue",
];
