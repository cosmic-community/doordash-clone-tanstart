import { Clock, CheckCircle, Truck, Package, XCircle, AlertCircle } from 'lucide-react'
import type { OrderStatus } from '@/types'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig = {
    'placed': {
      label: 'Order Placed',
      icon: Clock,
      className: 'bg-blue-100 text-blue-800'
    },
    'confirmed': {
      label: 'Confirmed',
      icon: CheckCircle,
      className: 'bg-green-100 text-green-800'
    },
    'preparing': {
      label: 'Preparing',
      icon: Package,
      className: 'bg-yellow-100 text-yellow-800'
    },
    'ready': {
      label: 'Ready for Pickup',
      icon: AlertCircle,
      className: 'bg-orange-100 text-orange-800'
    },
    'out-for-delivery': {
      label: 'Out for Delivery',
      icon: Truck,
      className: 'bg-purple-100 text-purple-800'
    },
    'delivered': {
      label: 'Delivered',
      icon: CheckCircle,
      className: 'bg-green-100 text-green-800'
    },
    'cancelled': {
      label: 'Cancelled',
      icon: XCircle,
      className: 'bg-red-100 text-red-800'
    }
  }

  const config = statusConfig[status] || statusConfig['placed']
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      <Icon className="w-4 h-4 mr-2" />
      {config.label}
    </span>
  )
}