// app/routes/restaurant.$slug.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, Clock, Star, MapPin, Phone } from 'lucide-react'
import { getRestaurantBySlug, getMenuItemsByRestaurant } from '@/lib/cosmic'
import { MenuItemCard } from '@/components/MenuItemCard'
import { addToCart } from '@/lib/cart'
import type { MenuItem } from '@/types'

export const Route = createFileRoute('/restaurant/$slug')({
  loader: async ({ params }) => {
    const restaurant = await getRestaurantBySlug(params.slug)
    if (!restaurant) {
      throw new Error('Restaurant not found')
    }
    
    const menuItems = await getMenuItemsByRestaurant(restaurant.id)
    return { restaurant, menuItems }
  },
  component: RestaurantPage,
})

function RestaurantPage() {
  const { restaurant, menuItems } = Route.useLoaderData()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Group menu items by category
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const categoryName = item.metadata?.category?.metadata?.name || 'Other'
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  const categories = Object.keys(groupedMenuItems)
  const displayItems = selectedCategory 
    ? groupedMenuItems[selectedCategory] || []
    : menuItems

  const handleAddToCart = (menuItem: MenuItem, quantity: number = 1) => {
    const cartItem = {
      id: menuItem.id,
      name: menuItem.metadata?.name || menuItem.title,
      price: menuItem.metadata?.price || 0,
      image: menuItem.metadata?.food_image?.imgix_url,
      restaurant: {
        id: restaurant.id,
        name: restaurant.metadata?.name || restaurant.title,
        delivery_fee: restaurant.metadata?.delivery_fee || 0
      }
    }
    
    addToCart(cartItem, quantity)
    
    // Dispatch custom event to update cart counter
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        to="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to restaurants
      </Link>

      {/* Restaurant Header */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden mb-8">
        {restaurant.metadata?.restaurant_image && (
          <div className="h-64 md:h-80 overflow-hidden">
            <img
              src={`${restaurant.metadata.restaurant_image.imgix_url}?w=1200&h=400&fit=crop&auto=format,compress`}
              alt={restaurant.metadata?.name || restaurant.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {restaurant.metadata?.name || restaurant.title}
              </h1>
              <p className="text-gray-600 mb-4">
                {restaurant.metadata?.description}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                {restaurant.metadata?.rating && (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{restaurant.metadata.rating}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{restaurant.metadata?.delivery_time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{restaurant.metadata?.address}</span>
                </div>
                {restaurant.metadata?.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    <span>{restaurant.metadata.phone}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Delivery Fee</div>
                <div className="text-lg font-semibold text-gray-900">
                  ${restaurant.metadata?.delivery_fee?.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Minimum ${restaurant.metadata?.minimum_order}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category} ({groupedMenuItems[category].length})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {selectedCategory ? selectedCategory : 'Menu'}
        </h2>

        {displayItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No menu items available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayItems.map((menuItem) => (
              <MenuItemCard
                key={menuItem.id}
                menuItem={menuItem}
                onAddToCart={(quantity) => handleAddToCart(menuItem, quantity)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}