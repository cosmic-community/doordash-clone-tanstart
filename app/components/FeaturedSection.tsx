import { Link } from '@tanstack/react-router'
import { Star, Clock } from 'lucide-react'
import type { Restaurant } from '@/types'

interface FeaturedSectionProps {
  restaurants: Restaurant[]
}

export function FeaturedSection({ restaurants }: FeaturedSectionProps) {
  if (restaurants.length === 0) return null

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Restaurants</h2>
        <Link 
          to="/"
          className="text-primary-500 hover:text-primary-600 font-medium text-sm"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {restaurants.map((restaurant, index) => {
          const { metadata } = restaurant
          
          return (
            <Link
              key={restaurant.id}
              to="/restaurant/$slug"
              params={{ slug: restaurant.slug }}
              className={`card group overflow-hidden ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className={`relative overflow-hidden ${
                index === 0 ? 'h-80' : 'h-48'
              }`}>
                {metadata?.restaurant_image ? (
                  <img
                    src={`${metadata.restaurant_image.imgix_url}?w=${index === 0 ? 600 : 300}&h=${index === 0 ? 320 : 192}&fit=crop&auto=format,compress`}
                    alt={metadata?.name || restaurant.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                
                {/* Featured Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Featured
                  </span>
                </div>

                {/* Rating */}
                {metadata?.rating && (
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 mr-1" />
                    <span className="text-xs font-medium">{metadata.rating}</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-500 transition-colors mb-2">
                  {metadata?.name || restaurant.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {metadata?.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{metadata?.delivery_time}</span>
                  </div>
                  <span>${metadata?.delivery_fee?.toFixed(2)} delivery</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}