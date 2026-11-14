import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FiTruck, FiCreditCard, FiSmartphone, FiDollarSign } from 'react-icons/fi'
import { clearCart } from '../store/cartSlice'
import { placeOrder } from '../store/orderSlice'

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery', desc: 'Delivery par payment karein', icon: FiDollarSign },
  { id: 'jazzcash', label: 'JazzCash', desc: 'Mobile wallet se payment', icon: FiSmartphone },
  { id: 'easypaisa', label: 'Easypaisa', desc: 'Mobile wallet se payment', icon: FiSmartphone },
  { id: 'card', label: 'Debit / Credit Card', desc: 'Visa ya Mastercard', icon: FiCreditCard },
]

function Checkout() {
  const items = useSelector((state) => state.cart.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const orderPlacedRef = useRef(false)

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [errors, setErrors] = useState({})

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = subtotal === 0 || subtotal >= 2000 ? 0 : 150
  const total = subtotal + shipping

  
  if (items.length === 0 && !orderPlacedRef.current) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-base sm:text-lg mb-4">Cart must have items to place an order.</p>
        <Link
          to="/"
          className="inline-block bg-orange-500 text-white px-6 py-2.5 rounded-md text-sm sm:text-base hover:bg-orange-600 transition"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Naam zaroori hai'

    const phone = formData.phone.replace(/[\s-]/g, '')
    if (!phone) {
      newErrors.phone = 'Phone number zaroori hai'
    } else if (!/^03\d{9}$/.test(phone)) {
      newErrors.phone = 'Sahi number likhein (03XXXXXXXXX)'
    }

    if (!formData.city.trim()) newErrors.city = 'Shehar ka naam zaroori hai'
    if (formData.address.trim().length < 10) newErrors.address = 'Poora address likhein (kam az kam 10 characters)'

    return newErrors
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()

    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items,
      shippingAddress: {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'unpaid',
      subtotal,
      shipping,
      total,
      status: 'processing',
    }

    orderPlacedRef.current = true
    dispatch(placeOrder(order))
    dispatch(clearCart())
    navigate('/order-success')
  }

  const inputClass = (field) =>
    `w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-orange-500 ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

       
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">

          
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900 mb-4">
              <FiTruck size={18} className="text-orange-500" />
              Shipping Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={inputClass('fullName')}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03XX-XXXXXXX"
                  className={inputClass('phone')}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm text-gray-700 mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Like Lahore, Faisalabad"
                  className={inputClass('city')}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm text-gray-700 mb-1.5">Complete Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Home number, street, colony, etc."
                  className={inputClass('address')}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm text-gray-700 mb-1.5">
                  Order Notes <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="For Delivery"
                  className={inputClass('notes')}
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900 mb-4">
              <FiCreditCard size={18} className="text-orange-500" />
              Payment Method
            </h2>

            <div className="flex flex-col gap-2.5">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                const selected = paymentMethod === method.id
                return (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 border rounded-md p-3 cursor-pointer transition ${
                      selected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selected}
                      onChange={() => setPaymentMethod(method.id)}
                      className="accent-orange-500"
                    />
                    <Icon size={18} className={selected ? 'text-orange-500' : 'text-gray-500'} />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{method.label}</p>
                      <p className="text-[11px] sm:text-xs text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                )
              })}
            </div>

            {paymentMethod !== 'cod' && (
              <p className="mt-3 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-md p-3">
                online will be implemented in future. For now, please select Cash on Delivery.
              </p>
            )}
          </div>
        </div>

        
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 h-fit lg:sticky lg:top-28">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">Order Summary</h2>

          <div className="flex flex-col gap-3 max-h-64 overflow-y-auto mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-800 line-clamp-2">{item.title}</p>
                  <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                </div>
                <p className="text-xs font-medium text-gray-900 shrink-0">
                  Rs. {(item.price * item.qty).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-3">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `Rs. ${shipping.toLocaleString()}`}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-sm sm:text-base font-semibold text-gray-900">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-orange-500 text-white py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-medium hover:bg-orange-600 transition"
          >
            Place Order
          </button>

          <Link to="/cart" className="block text-center text-xs sm:text-sm text-gray-500 hover:text-orange-500 mt-3">
             Back to Cart
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Checkout