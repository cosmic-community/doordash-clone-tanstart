import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ShoppingCart, MapPin, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getCartItems, calculateCartTotals } from '@/lib/cart'
import type { CartItem } from '@/types'
import '../global.css'

function RootComponent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    // Load cart items from localStorage
    setCartItems(getCartItems())
    
    // Listen for cart updates
    const handleStorageChange = () => {
      setCartItems(getCartItems())
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const cartTotals = calculateCartTotals(cartItems)

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>DoorDash Clone - Food Delivery</title>
        <script src="/dashboard-console-capture.js" />
      </head>
      <body>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link 
                  to="/"
                  className="flex items-center space-x-2 text-primary-500 font-bold text-xl"
                >
                  <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">D</span>
                  </div>
                  <span>DoorDash Clone</span>
                </Link>

                {/* Delivery Address */}
                <div className="hidden md:flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Downtown, CA 90210</span>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-lg mx-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search restaurants..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      onFocus={() => setIsSearchOpen(true)}
                      onBlur={() => setIsSearchOpen(false)}
                    />
                  </div>
                </div>

                {/* Cart */}
                <Link 
                  to="/cart"
                  className="relative flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:block">Cart</span>
                  {cartTotals.itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartTotals.itemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main>
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 text-white mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">DoorDash Clone</h3>
                  <p className="text-gray-400 text-sm">
                    Your favorite food, delivered fast and fresh to your doorstep.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Company</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><Link to="/about" className="hover:text-white">About</Link></li>
                    <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
                    <li><Link to="/help" className="hover:text-white">Help</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">For Restaurants</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white">Partner with us</a></li>
                    <li><a href="#" className="hover:text-white">Restaurant portal</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Support</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white">Contact us</a></li>
                    <li><a href="#" className="hover:text-white">FAQ</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                <p>&copy; 2024 DoorDash Clone. Built with Cosmic CMS.</p>
              </div>
            </div>
          </footer>
        </div>
        <TanStackRouterDevtools />
      </body>
    </html>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})