import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { getRestaurants, getCategories } from '@/lib/cosmic'
import { RestaurantCard } from '@/components/RestaurantCard'
import { CategoryFilter } from '@/components/CategoryFilter'
import { FeaturedSection } from '@/components/FeaturedSection'
import type { Restaurant, Category } from '@/types'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [restaurants, categories] = await Promise.all([
      getRestaurants(),
      getCategories()
    ])
    return { restaurants, categories }
  },
  component: HomePage,
})

function HomePage() {
  const { restaurants, categories } = Route.useLoaderData()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(restaurants)

  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug)
    
    if (!categorySlug) {
      setFilteredRestaurants(restaurants)
      return
    }

    // Filter restaurants based on their menu items' categories
    const filtered = restaurants.filter(restaurant => {
      // This is a simplified filter - in a real app you'd query menu items by category
      // For demo purposes, we'll filter by cuisine type matching category name
      const category = categories.find(cat => cat.slug === categorySlug)
      if (!category) return false
      
      return restaurant.metadata?.cuisine_type?.value.toLowerCase() === category.metadata?.name.toLowerCase()
    })
    
    setFilteredRestaurants(filtered)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Your favorite food,
          <span className="text-primary-500 block">delivered to you</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover local restaurants and get your favorite meals delivered fast.
        </p>
      </div>

      {/* Featured Section */}
      <FeaturedSection restaurants={restaurants.slice(0, 3)} />

      {/* Category Filter */}
      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Restaurants Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCategory ? `${categories.find(c => c.slug === selectedCategory)?.metadata?.name} Restaurants` : 'All Restaurants'}
          </h2>
          <span className="text-gray-500">
            {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {selectedCategory 
                ? `No restaurants found for ${categories.find(c => c.slug === selectedCategory)?.metadata?.name}`
                : 'No restaurants found'
              }
            </p>
            {selectedCategory && (
              <button
                onClick={() => handleCategoryChange(null)}
                className="mt-4 text-primary-500 hover:text-primary-600 font-medium"
              >
                Show all restaurants
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}