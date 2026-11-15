import { Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FiCheckCircle } from 'react-icons/fi'

const paymentLabels = {
  cod: 'Cash on Delivery',
  jazzcash: 'JazzCash',
  easypaisa: 'Easypaisa',
  card: 'Debit / Credit Card',
}

function OrderSuccess() {
  const orders = useSelector((state) => state.orders.items)
  const order = orders[0]  

  if (!order) return <Navigate to="/" replace />

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
      <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-8 text-center">
        <FiCheckCircle size={56} className="mx-auto text-green-500 mb-4" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Order Placed Successfully</h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-6">
          Thank you, {order.shippingAddress.fullName}. Your order is being processed.
        </p>

        <div className="text-left bg-gray-50 border border-gray-200 rounded-md p-4 text-xs sm:text-sm text-gray-700 flex flex-col gap-2 mb-6">
          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Order ID</span>
            <span className="font-medium break-all text-right">{order.id}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Payment</span>
            <span className="font-medium">{paymentLabels[order.paymentMethod]}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Deliver to</span>
            <span className="font-medium text-right">
              {order.shippingAddress.address}, {order.shippingAddress.city}
            </span>
          </div>
          <div className="flex justify-between gap-3 border-t border-gray-200 pt-2 mt-1">
            <span className="text-gray-500">Total</span>
            <span className="font-semibold text-orange-500">Rs. {order.total.toLocaleString()}</span>
          </div>
        </div>

        <Link
          to="/"
          className="inline-block bg-orange-500 text-white px-6 py-2.5 rounded-md text-sm sm:text-base hover:bg-orange-600 transition"
        >
          Continue Shopping
        </Link>
        <Link
  to="/orders"
  className="inline-block border border-gray-300 text-gray-700 px-6 py-2.5 rounded-md text-sm sm:text-base hover:border-orange-500 hover:text-orange-500 transition ml-2"
>
  My Orders
</Link>
      </div>
    </div>
  )
}

export default OrderSuccess