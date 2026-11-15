import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { cancelOrder } from '../store/orderSlice'

const statusStyles = {
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

const paymentLabels = {
  cod: 'Cash on Delivery',
  jazzcash: 'JazzCash',
  easypaisa: 'Easypaisa',
  card: 'Debit / Credit Card',
}

const tabs = ['all', 'processing', 'shipped', 'delivered', 'cancelled']

function Orders() {
  const orders = useSelector((state) => state.orders.items)
  const dispatch = useDispatch()

  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((order) => order.status === filter)

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

  const handleCancel = (id) => {
    if (window.confirm('Order cancel?')) {
      dispatch(cancelOrder(id))
    }
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <FiPackage size={40} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-base sm:text-lg mb-4">start shopping to see your orders here</p>
        <Link
          to="/"
          className="inline-block bg-orange-500 text-white px-6 py-2.5 rounded-md text-sm sm:text-base hover:bg-orange-600 transition"
        >
          Shopping 
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-4">
        My Orders ({orders.length})
      </h1>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm capitalize whitespace-nowrap border transition ${
              filter === tab
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-600 border-gray-300 hover:border-orange-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-center text-gray-500 text-sm py-10">
          Dont have any {filter} orders yet.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {filteredOrders.map((order) => {
          const isOpen = expandedId === order.id
          return (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">

              {/* Header */}
              <div className="flex items-start justify-between gap-3 flex-wrap p-3 sm:p-4 border-b border-gray-100">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 break-all">{order.id}</p>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                    Placed on {formatDate(order.date)}
                  </p>
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                    statusStyles[order.status]
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Item thumbnails + total */}
              <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
                <div className="flex items-center gap-2 overflow-hidden">
                  {order.items.slice(0, 4).map((item) => (
                    <img
                      key={item.id}
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded border border-gray-200 shrink-0"
                    />
                  ))}
                  {order.items.length > 4 && (
                    <span className="text-xs text-gray-500 shrink-0">+{order.items.length - 4} more</span>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] sm:text-xs text-gray-500">Total</p>
                  <p className="text-sm sm:text-base font-bold text-orange-500">
                    Rs. {order.total.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between gap-3 px-3 sm:px-4 pb-3 sm:pb-4">
                <button
                  onClick={() => setExpandedId(isOpen ? null : order.id)}
                  className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 hover:text-orange-500"
                >
                  {isOpen ? 'Hide Details' : 'View Details'}
                  {isOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                </button>

                {order.status === 'processing' && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="text-xs sm:text-sm text-red-500 border border-red-300 px-3 py-1.5 rounded-md hover:bg-red-50 transition"
                  >
                    Cancel Order
                  </button>
                )}
              </div>

              {/* Expanded details */}
              {isOpen && (
                <div className="border-t border-gray-100 bg-gray-50 p-3 sm:p-4 text-xs sm:text-sm text-gray-700">

                  <h3 className="font-semibold text-gray-900 mb-2">Items</h3>
                  <div className="flex flex-col gap-2 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-10 h-10 object-cover rounded shrink-0"
                        />
                        <p className="flex-1 min-w-0 line-clamp-1">{item.title}</p>
                        <p className="text-gray-500 shrink-0">x{item.qty}</p>
                        <p className="font-medium shrink-0">
                          Rs. {(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Shipping Address</h3>
                      <p>{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.phone}</p>
                      <p>
                        {order.shippingAddress.address}, {order.shippingAddress.city}
                      </p>
                      {order.shippingAddress.notes && (
                        <p className="text-gray-500 mt-1">Note: {order.shippingAddress.notes}</p>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Payment</h3>
                      <p>{paymentLabels[order.paymentMethod]}</p>
                      <p className="capitalize text-gray-500">Status: {order.paymentStatus}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>Rs. {order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{order.shipping === 0 ? 'Free' : `Rs. ${order.shipping.toLocaleString()}`}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-gray-900">
                      <span>Total</span>
                      <span>Rs. {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Orders