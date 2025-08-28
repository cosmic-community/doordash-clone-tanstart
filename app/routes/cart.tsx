import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react'
import { getCartItems, updateCartItemQuantity, removeFromCart, calculateCartTotals, clearCart } from '@/lib/cart'
import { createOrder } from '@/lib/cosmic'
import type { CartItem } from '@/types'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [orderData, setOrderData] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    specialInstructions: ''
  })

  useEffect(() => {
    setCartItems(getCartItems())
  }, [])

  const cartTotals = calculateCartTotals(cartItems)

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    const updatedItems = updateCartItemQuantity(itemId, newQuantity)
    setCartItems(updatedItems)
  }

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = removeFromCart(itemId)
    setCartItems(updatedItems)
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (cartItems.length === 0) return
    if (!orderData.customerName || !orderData.customerPhone || !orderData.deliveryAddress) {
      alert('Please fill in all required fields')
      return
    }

    setIsLoading(true)

    try {
      const restaurant = cartItems[0].restaurant
      const orderNumber = `ORD-${Date.now()}`

      const order = await createOrder({
        order_number: orderNumber,
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        delivery_address: orderData.deliveryAddress,
        restaurant_id: restaurant.id,
        items: cartItems.map(item => ({
          item_name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        })),
        subtotal: cartTotals.subtotal,
        delivery_fee: cartTotals.deliveryFee,
        tax: cartTotals.tax,
        total_amount: cartTotals.total,
        special_instructions: orderData.specialInstructions
      })

      clearCart()
      
      // Redirect to order confirmation
      router.navigate({
        to: '/order-confirmation',
        search: { orderId: order.id }
      })
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
          <Link 
            to="/"
            className="btn btn-primary"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        to="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to restaurants
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Order</h1>
          
          {/* Restaurant Info */}
          {cartItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-card p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                From {cartItems[0].restaurant.name}
              </h3>
              <p className="text-sm text-gray-600">
                Delivery fee: ${cartItems[0].restaurant.delivery_fee.toFixed(2)}
              </p>
            </div>
          )}

          {/* Cart Items List */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-start space-x-4">
                  {item.image && (
                    <img
                      src={`${item.image}?w=100&h=100&fit=crop&auto=format,compress`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-primary-500 font-semibold">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <span className="font-medium">{item.quantity}</span>
                    
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 text-red-600 ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Checkout */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-card p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            {/* Order Totals */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${cartTotals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>${cartTotals.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${cartTotals.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${cartTotals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Information Form */}
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={orderData.customerName}
                  onChange={(e) => setOrderData({...orderData, customerName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  className="input"
                  value={orderData.customerPhone}
                  onChange={(e) => setOrderData({...orderData, customerPhone: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  required
                  rows={3}
                  className="input resize-none"
                  value={orderData.deliveryAddress}
                  onChange={(e) => setOrderData({...orderData, deliveryAddress: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions
                </label>
                <textarea
                  rows={2}
                  className="input resize-none"
                  placeholder="Any special requests..."
                  value={orderData.specialInstructions}
                  onChange={(e) => setOrderData({...orderData, specialInstructions: e.target.value})}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary"
              >
                {isLoading ? 'Placing Order...' : `Place Order - $${cartTotals.total.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}