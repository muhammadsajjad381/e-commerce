import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi'
import { removeFromCart, updateQty } from '../store/cartSlice'

function Cart() {
  const items = useSelector((state) => state.cart.items)
  const dispatch = useDispatch()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = subtotal > 0 ? 150 : 0
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-base sm:text-lg mb-4">CArt is empty</p>
        <Link
          to="/"
          className="inline-block bg-orange-500 text-white px-6 py-2.5 rounded-md text-sm sm:text-base hover:bg-orange-600 transition"
        >
         Continue Shopping  
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
        My Cart ({items.length})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

   
        <div className="lg:col-span-2 flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 sm:gap-4 bg-white border border-gray-200 rounded-lg p-3 sm:p-4"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-md shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm text-gray-800 line-clamp-2">{item.title}</h3>
                <p className="text-orange-500 font-bold text-sm sm:text-base mt-1">
                  Rs. {item.price.toLocaleString()}
                </p>

                <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                  
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => dispatch(updateQty({ id: item.id, qty: Math.max(1, item.qty - 1) }))}
                      className="p-1.5 sm:p-2 hover:bg-gray-100"
                    >
                      <FiMinus size={12} />
                    </button>
                    <span className="px-3 text-xs sm:text-sm font-medium">{item.qty}</span>
                    <button
                      onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))}
                      className="p-1.5 sm:p-2 hover:bg-gray-100"
                    >
                      <FiPlus size={12} />
                    </button>
                  </div>

          
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="flex items-center gap-1 text-red-500 text-xs sm:text-sm hover:underline"
                  >
                    <FiTrash2 size={14} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

   
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 h-fit">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">Order Summary</h2>

          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-3">
            <span>Shipping</span>
            <span>Rs. {shipping.toLocaleString()}</span>
          </div>

          <div className="border-t border-gray-200 pt-3 flex justify-between text-sm sm:text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>

          <Link
            to="/checkout"
            className="mt-4 block text-center bg-orange-500 text-white py-2.5 sm:py-3 rounded-md text-sm sm:text-base hover:bg-orange-600 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart