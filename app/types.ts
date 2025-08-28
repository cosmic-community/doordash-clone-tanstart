// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Restaurant type with metadata
export interface Restaurant extends CosmicObject {
  type: 'restaurants';
  metadata: {
    name: string;
    description?: string;
    cuisine_type: {
      key: string;
      value: string;
    };
    address: string;
    phone?: string;
    delivery_fee: number;
    minimum_order: number;
    delivery_time: string;
    restaurant_image?: {
      url: string;
      imgix_url: string;
    };
    rating?: number;
    is_active: boolean;
  };
}

// Menu item type with metadata
export interface MenuItem extends CosmicObject {
  type: 'menu-items';
  metadata: {
    name: string;
    description?: string;
    price: number;
    restaurant: Restaurant;
    category: Category;
    food_image?: {
      url: string;
      imgix_url: string;
    };
    is_available: boolean;
    calories?: number;
    ingredients?: string;
  };
}

// Category type with metadata
export interface Category extends CosmicObject {
  type: 'categories';
  metadata: {
    name: string;
    description?: string;
  };
}

// Order type with metadata
export interface Order extends CosmicObject {
  type: 'orders';
  metadata: {
    order_number: string;
    customer_name: string;
    customer_phone: string;
    delivery_address: string;
    restaurant: Restaurant;
    order_items: OrderItem[];
    subtotal: number;
    delivery_fee: number;
    tax: number;
    total_amount: number;
    status: {
      key: OrderStatus;
      value: string;
    };
    order_date: string;
    special_instructions?: string;
  };
}

// Order item interface
export interface OrderItem {
  item_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// Order status type literals matching content model exactly
export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';

// Cart item interface for local state
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  restaurant: {
    id: string;
    name: string;
    delivery_fee: number;
  };
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Create order data interface
export interface CreateOrderData {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  restaurant_id: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total_amount: number;
  special_instructions?: string;
}

// Type guards for runtime validation
export function isRestaurant(obj: CosmicObject): obj is Restaurant {
  return obj.type === 'restaurants';
}

export function isMenuItem(obj: CosmicObject): obj is MenuItem {
  return obj.type === 'menu-items';
}

export function isCategory(obj: CosmicObject): obj is Category {
  return obj.type === 'categories';
}

export function isOrder(obj: CosmicObject): obj is Order {
  return obj.type === 'orders';
}

// Utility types
export type OptionalMetadata<T> = Partial<T['metadata']>;
export type RestaurantWithMenu = Restaurant & { menuItems: MenuItem[] };