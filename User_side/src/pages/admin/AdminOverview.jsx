import { useSelector } from 'react-redux'
import { FiDollarSign, FiPackage, FiClock, FiShoppingBag, FiAlertTriangle, FiUsers } from 'react-icons/fi'
import { statusStyles } from '../../config/orderStatus'

const statuses = ['processing', 'shipped', 'delivered', 'cancelled']

const barColors = {
  processing: 'bg-yellow-400',
  shipped: 'bg-blue-400',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-400',
}

function AdminOverview() {
  const orders = useSelector((state) => state.orders.items)
  const products = useSelector((state) => state.products.items)

  const revenue = orders
    .filter((order) => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0)

  const sellerCount = new Set(products.map((p) => p.seller)).size
  const lowStock = products.filter((p) => p.stock <= 5).length
  const pendingCount = orders.filter((o) => o.status === 'processing').length

  const stats = [
    { label: 'Revenue', value: `Rs. ${revenue.toLocaleString()}`, icon: FiDollarSign },
    { label: 'Total Orders', value: orders.length, icon: FiPackage },
    { label: 'Awaiting Action', value: pendingCount, icon: FiClock },
    { label: 'Products', value: products.length, icon: FiShoppingBag },
    { label: 'Low / Out of Stock', value: lowStock, icon: FiAlertTriangle },
    { label: 'Sellers', value: sellerCount, icon: FiUsers },
  ]

  const maxCount = orders.length || 1

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="flex flex-col gap-4 sm:gap-6">

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] sm:text-xs text-gray-500">{stat.label}</span>
                <Icon size={16} className="text-orange-500" />
              </div>
              <p className="text-base sm:text-xl font-bold text-gray-900 break-words">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* Status breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">Orders by Status</h2>
          <div className="flex flex-col gap-3">
            {statuses.map((status) => {
              const count = orders.filter((o) => o.status === status).length
              return (
                <div key={status}>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="capitalize text-gray-600">{status}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColors[status]}`}
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">Recent Orders</h2>

          {orders.length === 0 ? (
            <p className="text-xs sm:text-sm text-gray-500 py-6 text-center">No orders have been placed yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {orders.slice(0, 5).map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="text-[11px] text-gray-500">{formatDate(order.date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">
                      Rs. {order.total.toLocaleString()}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminOverview