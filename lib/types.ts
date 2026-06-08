export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: ProductCategory;
  collection?: string;
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  isCustomizable: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export type ProductCategory =
  | "t-shirts"
  | "hoodies"
  | "sweaters"
  | "matching-sets"
  | "kids"
  | "caps"
  | "summer-tees"
  | "customized"
  | "med-wear";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size: string;
  color: ProductColor;
  customText?: string;
  customPlacement?: string;
  overridePrice?: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  createdAt: string;
  isCustom: boolean;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "in-production";

export type PaymentMethod = "card" | "cod" | "whatsapp" | "omt";

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zip?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  text: string;
  photoUrl?: string;
  instagramHandle?: string;
  createdAt: string;
  approved: boolean;
}
