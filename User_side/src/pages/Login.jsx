import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password')
      return
    }

   
    console.log('Login data:', formData)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10 sm:py-16">
      <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-8 shadow-sm">

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 text-center">
          Login to <span className="text-orange-500">MarketHub</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 text-center mb-6">
          Back into account to continue shopping or sell your products
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs sm:text-sm px-3 py-2 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          
          <div>
            <label className="block text-xs sm:text-sm text-gray-700 mb-1.5">Email</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-orange-500">
              <FiMail size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
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

          <div className="text-right">
            <Link to="/" className="text-xs sm:text-sm text-orange-500 hover:underline">
              forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2.5 rounded-md text-sm sm:text-base font-medium hover:bg-orange-600 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
          don't have an account?{' '}
          <Link to="/register" className="text-orange-500 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login