# DoorDash Clone - Food Delivery Platform

![App Preview](https://imgix.cosmicjs.com/d75e7860-838f-11f0-8ece-89921cbea84a-photo-1521305916504-4a1121188589-1756331426149.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A modern food delivery platform built with TanStack Start that connects customers with local restaurants. Browse restaurants by cuisine, add items to cart, place orders, and track delivery status in real-time.

## Features

- 🍔 Restaurant discovery and browsing
- 🥘 Dynamic menu items with categories
- 🛒 Shopping cart with quantity management  
- 📦 Order placement and tracking
- 📱 Responsive mobile-first design
- ⭐ Restaurant ratings and reviews
- 🚚 Real-time delivery tracking
- 🎨 Modern, clean UI with food imagery

<!-- CLONE_PROJECT_BUTTON -->

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> Create a DoorDash clone

### Code Generation Prompt

> Build this website using TanStack Start

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Frontend Framework:** TanStack Start (React-based full-stack framework)
- **Styling:** Tailwind CSS with custom design system
- **Content Management:** Cosmic CMS
- **Language:** TypeScript
- **Package Manager:** Bun
- **Deployment:** Vercel/Netlify compatible

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account with the DoorDash clone bucket

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Cosmic credentials:
   ```
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

4. Run the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Cosmic SDK Examples

### Fetching Restaurants

```typescript
import { cosmic } from '@/lib/cosmic'

export async function getRestaurants() {
  try {
    const response = await cosmic.objects
      .find({ type: 'restaurants' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects.filter(restaurant => 
      restaurant.metadata?.is_active
    )
  } catch (error) {
    if (error.status === 404) return []
    throw error
  }
}
```

### Getting Menu Items by Restaurant

```typescript
export async function getMenuItemsByRestaurant(restaurantId: string) {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'menu-items',
        'metadata.restaurant': restaurantId
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects.filter(item => 
      item.metadata?.is_available
    )
  } catch (error) {
    if (error.status === 404) return []
    throw error
  }
}
```

### Creating Orders

```typescript
export async function createOrder(orderData: CreateOrderData) {
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
    })
    
    return response.object
  } catch (error) {
    throw new Error('Failed to create order')
  }
}
```

## Cosmic CMS Integration

This application integrates with the following Cosmic object types:

- **Restaurants** - Restaurant information, cuisine types, delivery details
- **Menu Items** - Food items with prices, descriptions, and availability
- **Categories** - Food categories for filtering and organization
- **Orders** - Customer orders with tracking and status updates

The content structure supports:
- Restaurant management with ratings and delivery information
- Menu item categorization and availability tracking
- Order placement with detailed item information
- Real-time order status updates

## Deployment Options

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in the Vercel dashboard
4. Deploy

### Deploy to Netlify

1. Build the application: `bun run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify settings

### Environment Variables for Production

Set these variables in your hosting platform:

```
COSMIC_BUCKET_SLUG=your-production-bucket-slug
COSMIC_READ_KEY=your-production-read-key
COSMIC_WRITE_KEY=your-production-write-key
```