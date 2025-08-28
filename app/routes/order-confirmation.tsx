import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react'
import { getOrderById } from '@/lib/cosmic'
import { OrderStatusBadge } from '@/components/OrderStatusBadge'
import type { OrderStatus } from '@/types'

export const Route = createFileRoute('/order-confirmation')({
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: search.orderId as string,
  }),
  loader: async ({ search }) => {
    const order = await getOrderById(search.orderId)
    if (!order) {
      throw new Error('Order not found')
    }
    return { order }
  },
  component: OrderConfirmationPage,
})

function OrderConfirmationPage() {
  const { order } = Route.useLoaderData()

  const statusMessages: Record<OrderStatus, string> = {
    'placed': 'Your order has been placed successfully!',
    'confirmed': 'Your order has been confirmed by the restaurant.',
    'preparing': 'Your order is being prepared.',
    'ready': 'Your order is ready for pickup!',
    'out-for-delivery': 'Your order is on the way!',
    'delivered': 'Your order has been delivered!',
    'cancelled': 'Your order has been cancelled.'
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-600">
          {statusMessages[order.metadata?.status?.key as OrderStatus]}
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-xl shadow-card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Order #{order.metadata?.order_number}
            </h2>
            <p className="text-gray-600">Placed on {order.metadata?.order_date}</p>
          </div>
          <OrderStatusBadge status={order.metadata?.status?.key as OrderStatus} />
        </div>

        {/* Restaurant Information */}
        <div className="border-b pb-6 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">From</h3>
          <div className="flex items-start space-x-4">
            {order.metadata?.restaurant?.metadata?.restaurant_image && (
              <img
                src={`${order.metadata.restaurant.metadata.restaurant_image.imgix_url}?w=100&h=100&fit=crop&auto=format,compress`}
                alt={order.metadata?.restaurant?.metadata?.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div>
              <h4 className="font-medium text-gray-900">
                {order.metadata?.restaurant?.metadata?.name}
              </h4>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{order.metadata?.restaurant?.metadata?.address}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Phone className="w-4 h-4 mr-1" />
                <span>{order.metadata?.restaurant?.metadata?.phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Clock className="w-4 h-4 mr-1" />
                <span>Est. delivery: {order.metadata?.restaurant?.metadata?.delivery_time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="border-b pb-6 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Delivery Details</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Customer:</span> {order.metadata?.customer_name}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {order.metadata?.customer_phone}
            </div>
            <div>
              <span className="font-medium">Address:</span>
              <div className="mt-1 whitespace-pre-line">{order.metadata?.delivery_address}</div>
            </div>
            {order.metadata?.special_instructions && (
              <div>
                <span className="font-medium">Special Instructions:</span>
                <div className="mt-1">{order.metadata.special_instructions}</div>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="border-b pb-6 mb-6">
          <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.metadata?.order_items?.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-gray-100 rounded text-sm flex items-center justify-center mr-3">
                    {item.quantity}
                  </span>
                  <span className="text-gray-900">{item.item_name}</span>
                </div>
                <span className="font-medium">${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Total */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${order.metadata?.subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>${order.metadata?.delivery_fee?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${order.metadata?.tax?.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${order.metadata?.total_amount?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="text-center space-y-4">
        <Link 
          to="/"
          className="btn btn-primary"
        >
          Order More Food
        </Link>
        <div>
          <p className="text-sm text-gray-600">
            Need help with your order? Contact support at{' '}
            <a href="tel:(555) 123-4567" className="text-primary-500 hover:text-primary-600">
              (555) 123-4567
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}