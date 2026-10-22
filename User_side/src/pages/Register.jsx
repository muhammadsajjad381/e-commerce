import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiShoppingBag } from 'react-icons/fi'

function Register() {
  const [role, setRole] = useState('buyer')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    shopName: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.password) {
      setError('Fields with * are required')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (role === 'seller' && !formData.shopName) {
      setError('Shop Name is required for sellers')
      return
    }

    console.log('Register data:', { ...formData, role })
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10 sm:py-16">
      <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-8 shadow-sm">

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 text-center">
          Create <span className="text-orange-500">MarketHub</span> Account
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 text-center mb-6">
          Buyer or Seller
        </p>

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-2 mb-5 bg-gray-100 p-1 rounded-md">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded text-xs sm:text-sm font-medium transition ${
              role === 'buyer' ? 'bg-white text-orange-500 shadow' : 'text-gray-500'
            }`}
          >
            <FiUser size={14} />
            Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded text-xs sm:text-sm font-medium transition ${
              role === 'seller' ? 'bg-white text-orange-500 shadow' : 'text-gray-500'
            }`}
          >
            <FiShoppingBag size={14} />
            Seller
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs sm:text-sm px-3 py-2 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        
          <div>
            <label className="block text-xs sm:text-sm text-gray-700 mb-1.5">Full Name</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-orange-500">
              <FiUser size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Apna naam likhein"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          
          {role === 'seller' && (
            <div>
              <label className="block text-xs sm:text-sm text-gray-700 mb-1.5">Shop Name</label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-orange-500">
                <FiShoppingBag size={16} className="text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  placeholder="Aapki dukaan ka naam"
                  className="w-full outline-none text-sm"
                />
              </div>
            </div>
          )}

          
          <div>
            <label className="block text-xs sm:text-sm text-gray-700 mb-1.5">Email</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-orange-500">
              <FiMail size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="aapka@email.com"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

     
          <div>
            <label className="block text-xs sm:text-sm text-gray-700 mb-1.5">Phone Number</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-orange-500">
              <FiPhone size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="03XX-XXXXXXX"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-gray-700 mb-1.5">Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-orange-500">
              <FiLock size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full outline-none text-sm"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <FiEyeOff size={16} className="text-gray-400" />
                ) : (
                  <FiEye size={16} className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm text-gray-700 mb-1.5">Confirm Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-orange-500">
              <FiLock size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2.5 rounded-md text-sm sm:text-base font-medium hover:bg-orange-600 transition mt-1"
          >
            {role === 'seller' ? 'Create Seller Account' : 'Create Buyer Account'}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
          Already account hai?{' '}
          <Link to="/login" className="text-orange-500 font-medium hover:underline">
            Login 
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register