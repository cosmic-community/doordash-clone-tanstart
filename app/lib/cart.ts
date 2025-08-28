import type { CartItem } from '@/types';

const CART_STORAGE_KEY = 'doordash-cart';

// Get cart items from localStorage
export function getCartItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting cart items:', error);
    return [];
  }
}

// Save cart items to localStorage
export function saveCartItems(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart items:', error);
  }
}

// Add item to cart
export function addToCart(item: Omit<CartItem, 'quantity'>, quantity: number = 1): CartItem[] {
  const currentItems = getCartItems();
  const existingItemIndex = currentItems.findIndex(cartItem => cartItem.id === item.id);
  
  let updatedItems: CartItem[];
  
  if (existingItemIndex >= 0) {
    // Update quantity of existing item
    updatedItems = currentItems.map((cartItem, index) => 
      index === existingItemIndex 
        ? { ...cartItem, quantity: cartItem.quantity + quantity }
        : cartItem
    );
  } else {
    // Add new item to cart
    updatedItems = [...currentItems, { ...item, quantity }];
  }
  
  saveCartItems(updatedItems);
  return updatedItems;
}

// Update item quantity in cart
export function updateCartItemQuantity(itemId: string, quantity: number): CartItem[] {
  const currentItems = getCartItems();
  
  let updatedItems: CartItem[];
  
  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    updatedItems = currentItems.filter(item => item.id !== itemId);
  } else {
    // Update quantity
    updatedItems = currentItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );
  }
  
  saveCartItems(updatedItems);
  return updatedItems;
}

// Remove item from cart
export function removeFromCart(itemId: string): CartItem[] {
  const currentItems = getCartItems();
  const updatedItems = currentItems.filter(item => item.id !== itemId);
  
  saveCartItems(updatedItems);
  return updatedItems;
}

// Clear entire cart
export function clearCart(): void {
  saveCartItems([]);
}

// Calculate cart totals
export function calculateCartTotals(items: CartItem[]) {
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Get delivery fee from the restaurant (assuming all items are from same restaurant)
  const deliveryFee = items.length > 0 ? items[0].restaurant.delivery_fee : 0;
  
  // Calculate tax (assuming 8.5% tax rate)
  const tax = subtotal * 0.085;
  
  const total = subtotal + deliveryFee + tax;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    deliveryFee: Math.round(deliveryFee * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
    itemCount: items.reduce((count, item) => count + item.quantity, 0)
  };
}

// Check if cart has items from different restaurants
export function hasMultipleRestaurants(items: CartItem[]): boolean {
  if (items.length <= 1) return false;
  
  const restaurantIds = new Set(items.map(item => item.restaurant.id));
  return restaurantIds.size > 1;
}

// Get restaurant from cart items
export function getCartRestaurant(items: CartItem[]) {
  return items.length > 0 ? items[0].restaurant : null;
}