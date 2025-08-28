import { createBucketClient } from '@cosmicjs/sdk';
import type { Restaurant, MenuItem, Category, Order, CreateOrderData, CosmicResponse } from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
});

// Helper function for error handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Get all restaurants
export async function getRestaurants(): Promise<Restaurant[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'restaurants' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const restaurants = (response.objects as Restaurant[])
      .filter(restaurant => restaurant.metadata?.is_active)
      .sort((a, b) => (b.metadata?.rating || 0) - (a.metadata?.rating || 0));
    
    return restaurants;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch restaurants');
  }
}

// Get restaurant by slug
export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'restaurants',
      slug
    }).depth(1);
    
    const restaurant = response.object as Restaurant;
    
    if (!restaurant || !restaurant.metadata?.is_active) {
      return null;
    }
    
    return restaurant;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch restaurant');
  }
}

// Get menu items by restaurant
export async function getMenuItemsByRestaurant(restaurantId: string): Promise<MenuItem[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'menu-items',
        'metadata.restaurant': restaurantId
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const menuItems = (response.objects as MenuItem[])
      .filter(item => item.metadata?.is_available)
      .sort((a, b) => a.title.localeCompare(b.title));
    
    return menuItems;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch menu items');
  }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const categories = (response.objects as Category[])
      .sort((a, b) => a.title.localeCompare(b.title));
    
    return categories;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch categories');
  }
}

// Get restaurants by category
export async function getRestaurantsByCategory(categorySlug: string): Promise<Restaurant[]> {
  try {
    // First get the category
    const categoryResponse = await cosmic.objects.findOne({
      type: 'categories',
      slug: categorySlug
    });
    
    const category = categoryResponse.object as Category;
    
    // Get menu items for this category
    const menuItemsResponse = await cosmic.objects
      .find({ 
        type: 'menu-items',
        'metadata.category': category.id
      })
      .props(['id', 'metadata'])
      .depth(1);
    
    const menuItems = menuItemsResponse.objects as MenuItem[];
    
    // Get unique restaurant IDs from menu items
    const restaurantIds = [...new Set(menuItems.map(item => item.metadata?.restaurant?.id))];
    
    // Get restaurants
    const restaurants = await getRestaurants();
    
    // Filter restaurants that have items in this category
    return restaurants.filter(restaurant => 
      restaurantIds.includes(restaurant.id)
    );
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch restaurants by category');
  }
}

// Create a new order
export async function createOrder(orderData: CreateOrderData): Promise<Order> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'orders',
      title: `Order #${orderData.order_number}`,
      metadata: {
        order_number: orderData.order_number,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        delivery_address: orderData.delivery_address,
        restaurant: orderData.restaurant_id,
        order_items: orderData.items,
        subtotal: orderData.subtotal,
        delivery_fee: orderData.delivery_fee,
        tax: orderData.tax,
        total_amount: orderData.total_amount,
        status: 'placed',
        order_date: new Date().toISOString().split('T')[0],
        special_instructions: orderData.special_instructions || ''
      }
    });
    
    return response.object as Order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'orders',
      id: orderId
    }).depth(1);
    
    return response.object as Order;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch order');
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
  try {
    const response = await cosmic.objects.updateOne(orderId, {
      metadata: {
        status: status
      }
    });
    
    return response.object as Order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
}

// Search restaurants by name
export async function searchRestaurants(query: string): Promise<Restaurant[]> {
  try {
    const restaurants = await getRestaurants();
    
    return restaurants.filter(restaurant =>
      restaurant.metadata?.name.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.metadata?.cuisine_type?.value.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    throw new Error('Failed to search restaurants');
  }
}