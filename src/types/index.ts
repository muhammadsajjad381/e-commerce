
export interface AttributeValue {
  value: string;
  label: string;
  hex?: string;        
  imageUrl?: string; 
}


export interface ProductAttribute {
  name: string;       
  values: AttributeValue[];
}


export interface ProductVariant {
  _id: string;
  sku: string;
  attributes: Record<string, string>; 
  price: number;
  compareAtPrice?: number;            
  stock: number;
  reserved: number;                   
  available: number;                  
  imageUrl?: string;                  
  weight?: number;                   \

/** Full product document */
export interface Product {
  _id: string;
  slug: string;
  title: string;
  description: string;
  vendor: Vendor;
  category: Category;
  tags: string[];
  images: string[];
  thumbnail: string;
  attributes: ProductAttribute[];
  variants: ProductVariant[];
  basePrice: number;                  // Lowest variant price
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isPublished: boolean;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}
export type OrderStatus =
  | 'pending'
  | 'payment_confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderTimeline {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string | null;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface OrderItem {
  product: Pick<Product, '_id' | 'title' | 'thumbnail' | 'slug'>;
  variant: Pick<ProductVariant, '_id' | 'sku' | 'attributes'>;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: Pick<User, '_id' | 'name' | 'email'>;
  vendor: Pick<Vendor, '_id' | 'storeName'>;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  timeline: OrderTimeline[];
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'stripe' | 'cod' | 'wallet';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export type UserRole = 'customer' | 'vendor' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Vendor {
  _id: string;
  user: string;
  storeName: string;
  storeLogo?: string;
  storeBanner?: string;
  description?: string;
  rating: number;
  totalSales: number;
  isVerified: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  parentCategory?: string;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
  units: number;
}

export interface VendorMetrics {
  totalRevenue: number;
  revenueChange: number;   // % change vs previous period
  totalOrders: number;
  ordersChange: number;
  avgOrderValue: number;
  conversionRate: number;
  lowStockProducts: number;
  pendingFulfillment: number;
  revenueChart: RevenueDataPoint[];
  topProducts: Array<{ product: Product; revenue: number; units: number }>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  search?: string;
  category?: string;
  tags?: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  attributes?: Record<string, string[]>;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
  page?: number;
  limit?: number;
}

export interface UIState {
  cartOpen: boolean;
  searchOpen: boolean;
  mobileNavOpen: boolean;
  theme: 'dark' | 'light';
}
