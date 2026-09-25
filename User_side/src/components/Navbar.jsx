import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown } from 'react-icons/fi'
import CategoryDropdown from './CategoryDropdown'
import MobileDrawer from './MobileDrawer'

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <header className="w-full shadow-sm sticky top-0 z-50 bg-white">
      
      <div className="hidden md:block bg-gray-900 text-white text-xs py-1.5 px-4 text-center">
        Free delivery on orders over Rs. 2000
      </div>

     
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        
        <button
          className="md:hidden text-gray-700"
          onClick={() => setDrawerOpen(true)}
        >
          <FiMenu size={24} />
        </button>

        
        <Link to="/" className="text-xl md:text-2xl font-bold text-orange-500 shrink-0">
          Market<span className="text-gray-900">Hub</span>
        </Link>

        <div className="hidden md:flex flex-1 items-center border border-gray-300 rounded-md overflow-hidden">
          <input
            type="text"
            placeholder="Search products, brands and more..."
            className="w-full px-4 py-2 outline-none text-sm"
          />
          <button className="bg-orange-500 text-white px-4 py-2 hover:bg-orange-600 transition">
            <FiSearch size={18} />
          </button>
        </div>

        <button className="md:hidden ml-auto text-gray-700">
          <FiSearch size={22} />
        </button>

        <div className="hidden md:flex items-center gap-5 shrink-0 text-gray-700">
          <Link to="/login" className="flex flex-col items-center text-xs hover:text-orange-500">
            <FiUser size={20} />
            <span>Login</span>
          </Link>
          <Link to="/wishlist" className="flex flex-col items-center text-xs hover:text-orange-500">
            <FiHeart size={20} />
            <span>Wishlist</span>
          </Link>
          <Link to="/cart" className="relative flex flex-col items-center text-xs hover:text-orange-500">
            <FiShoppingCart size={20} />
            <span>Cart</span>
            <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </Link>
        </div>

        <Link to="/cart" className="md:hidden relative text-gray-700">
          <FiShoppingCart size={22} />
          <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            0
          </span>
        </Link>
      </div>

      <nav className="hidden md:block border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-6 text-sm text-gray-600">
          <CategoryDropdown />
          <Link to="/" className="hover:text-orange-500 whitespace-nowrap py-2">Electronics</Link>
          <Link to="/" className="hover:text-orange-500 whitespace-nowrap py-2">Fashion</Link>
          <Link to="/" className="hover:text-orange-500 whitespace-nowrap py-2">Mobiles</Link>
          <Link to="/" className="hover:text-orange-500 whitespace-nowrap py-2">Home & Living</Link>
          <Link to="/" className="hover:text-orange-500 whitespace-nowrap py-2">Sell on MarketHub</Link>
        </div>
      </nav>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  )
}

export default Navbar