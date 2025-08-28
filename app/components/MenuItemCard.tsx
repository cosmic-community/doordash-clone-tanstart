import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { MenuItem } from '@/types'

interface MenuItemCardProps {
  menuItem: MenuItem
  onAddToCart: (quantity: number) => void
}

export function MenuItemCard({ menuItem, onAddToCart }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { metadata } = menuItem

  const handleAddToCart = async () => {
    setIsAdding(true)
    onAddToCart(quantity)
    
    // Brief feedback animation
    setTimeout(() => {
      setIsAdding(false)
      setQuantity(1) // Reset quantity
    }, 500)
  }

  if (!metadata?.is_available) {
    return (
      <div className="card p-6 opacity-50">
        <div className="flex items-start space-x-4">
          {metadata?.food_image && (
            <img
              src={`${metadata.food_image.imgix_url}?w=120&h=120&fit=crop&auto=format,compress`}
              alt={metadata?.name || menuItem.title}
              className="w-20 h-20 object-cover rounded-lg grayscale"
            />
          )}
          
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-2">
              {metadata?.name || menuItem.title}
            </h4>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {metadata?.description}
            </p>
            <p className="text-red-500 font-medium text-sm">Currently unavailable</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6 hover:shadow-card-hover transition-shadow">
      <div className="flex items-start space-x-4">
        {metadata?.food_image && (
          <img
            src={`${metadata.food_image.imgix_url}?w=240&h=240&fit=crop&auto=format,compress`}
            alt={metadata?.name || menuItem.title}
            className="w-24 h-24 object-cover rounded-lg"
          />
        )}
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-900">
              {metadata?.name || menuItem.title}
            </h4>
            <span className="text-primary-500 font-semibold text-lg ml-4">
              ${metadata?.price?.toFixed(2)}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {metadata?.description}
          </p>

          {/* Additional Info */}
          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
            {metadata?.calories && (
              <span>{metadata.calories} cal</span>
            )}
            {metadata?.ingredients && (
              <span className="line-clamp-1">
                {metadata.ingredients.split(',').slice(0, 3).join(', ')}
                {metadata.ingredients.split(',').length > 3 && '...'}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label htmlFor={`quantity-${menuItem.id}`} className="text-sm text-gray-600">
                Qty:
              </label>
              <select
                id={`quantity-${menuItem.id}`}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isAdding
                  ? 'bg-green-500 text-white'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{isAdding ? 'Added!' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}