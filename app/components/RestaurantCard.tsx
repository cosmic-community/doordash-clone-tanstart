import { Link } from '@tanstack/react-router'
import { Star, Clock, DollarSign } from 'lucide-react'
import type { Restaurant } from '@/types'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { metadata } = restaurant

  return (
    <Link 
      to="/restaurant/$slug" 
      params={{ slug: restaurant.slug }}
      className="card group block overflow-hidden"
    >
      {/* Restaurant Image */}
      <div className="aspect-[4/3] overflow-hidden">
        {metadata?.restaurant_image ? (
          <img
            src={`${metadata.restaurant_image.imgix_url}?w=400&h=300&fit=crop&auto=format,compress`}
            alt={metadata?.name || restaurant.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      {/* Restaurant Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-500 transition-colors">
            {metadata?.name || restaurant.title}
          </h3>
          {metadata?.rating && (
            <div className="flex items-center text-sm">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="font-medium">{metadata.rating}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {metadata?.description || 'Delicious food delivered fresh to your door.'}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{metadata?.delivery_time}</span>
          </div>
          
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>${metadata?.delivery_fee?.toFixed(2)} delivery</span>
          </div>
        </div>

        {/* Cuisine Type Badge */}
        <div className="mt-3">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
            {metadata?.cuisine_type?.value}
          </span>
        </div>

        {/* Minimum Order */}
        {metadata?.minimum_order && (
          <div className="mt-2 text-xs text-gray-500">
            Min. order ${metadata.minimum_order}
          </div>
        )}
      </div>
    </Link>
  )
}