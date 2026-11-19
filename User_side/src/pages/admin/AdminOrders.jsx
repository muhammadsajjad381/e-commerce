import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FiSearch } from 'react-icons/fi'
import { updateOrderStatus } from '../../store/orderSlice'
import { statusFlow, statusStyles } from '../../config/orderStatus'

const tabs = ['all', 'processing', 'shipped', 'delivered', 'cancelled']

function AdminOrders() {
  const orders = useSelector((state) => state.orders.items)
  const dispatch = useDispatch()

  const [filter, setFilter] = useState('all')
  const [term, setTerm] = useState('')

  const query = term.trim().toLowerCase()

  const visibleOrders = orders.filter((order) => {
    const matchesStatus = filter === 'all' || order.status === filter
    const matchesSearch =
      !query ||
      order.id.toLowerCase().includes(query) ||
      order.shippingAddress.fullName.toLowerCase().includes(query)
    return matchesStatus && matchesSearch
  })

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  const handleStatusChange = (order, newStatus) => {
    if (!newStatus) return
    if (newStatus === 'cancelled' && !window.confirm('Cancel this order?')) return
    dispatch(updateOrderStatus({ id: order.id, status: newStatus }))
  }

  return (
    <div>
      {/* Search + filter tabs */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:border-orange-500 sm:max-w-sm">
          <FiSearch size={14} className="text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search by order ID or customer name"
            className="w-full outline-none text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
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
      </div>

      {visibleOrders.length === 0 ? (
        <p className="text-center text-gray-500 text-sm py-12 bg-white border border-gray-200 rounded-lg">
          No orders found.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {visibleOrders.map((order) => {
            const nextOptions = statusFlow[order.status]
            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">

                <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 break-all">{order.id}</p>
                    <p className="text-[11px] sm:text-xs text-gray-500">{formatDate(order.date)}</p>
                  </div>
                  <span className={`text-[11px] sm:text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm mb-3">
                  <div>
                    <p className="text-gray-500 text-[11px]">Customer</p>
                    <p className="text-gray-900">{order.shippingAddress.fullName}</p>
                    <p className="text-gray-500 text-[11px]">{order.shippingAddress.city}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[11px]">Items</p>
                    <p className="text-gray-900">
                      {order.items.reduce((sum, item) => sum + item.qty, 0)} pcs
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[11px]">Payment</p>
                    <p className="text-gray-900 uppercase">{order.paymentMethod}</p>
                    <p className="text-gray-500 text-[11px] capitalize">{order.paymentStatus}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[11px]">Total</p>
                    <p className="font-semibold text-orange-500">Rs. {order.total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  {nextOptions.length > 0 ? (
                    <select
                      value=""
                      onChange={(e) => handleStatusChange(order, e.target.value)}
                      className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-1.5 text-xs sm:text-sm outline-none focus:border-orange-500 bg-white"
                    >
                      <option value="">Update status</option>
                      {nextOptions.map((status) => (
                        <option key={status} value={status} className="capitalize">
                          Mark as {status}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-[11px] sm:text-xs text-gray-400">This order is final and cannot be changed.</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminOrders