import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiX, FiSearch, FiUser, FiHeart, FiChevronDown, FiChevronRight } from 'react-icons/fi'
import SearchBar from './SearchBar'
import { categories } from '../data/categories'

function MobileDrawer({ open, onClose }) {
  const [expanded, setExpanded] = useState(null)

  return (
    <>
  
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-60 md:hidden"
          onClick={onClose}
        />
      )}

     
      <div
        className={`fixed top-0 left-0 h-full w-[80%] bg-white z-70 shadow-xl transform transition-transform duration-300 md:hidden overflow-y-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
  
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span className="text-lg font-bold text-orange-500">
            Market<span className="text-gray-900">Hub</span>
          </span>
          <button onClick={onClose}>
            <FiX size={22} />
          </button>
        </div>
<div className="p-4 border-b border-gray-200">
  <SearchBar placeholder="Search products..." className="flex" onSearch={onClose} />
</div>

        
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-6">
          <Link to="/login" onClick={onClose} className="flex flex-col items-center text-xs text-gray-700">
            <FiUser size={20} />
            Login
          </Link>
          <Link to="/wishlist" onClick={onClose} className="flex flex-col items-center text-xs text-gray-700">
            <FiHeart size={20} />
            Wishlist
          </Link>
        </div>

        <div className="p-2">
          {categories.map((cat) => (
            <div key={cat.name} className="border-b border-gray-100">
              <button
                onClick={() => setExpanded(expanded === cat.name ? null : cat.name)}
                className="w-full flex items-center justify-between px-3 py-3 text-sm text-gray-800"
              >
                {cat.name}
                {expanded === cat.name ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
              </button>
             {expanded === cat.name && (
  <ul className="pb-2">
    <li>
      <Link
        to={`/category/${cat.slug}`}
        onClick={onClose}
        className="block px-6 py-2 text-sm text-orange-500"
      >
        All {cat.name}
      </Link>
    </li>
    {cat.subcategories.map((sub) => (
      <li key={sub.slug}>
        <Link
          to={`/category/${cat.slug}?sub=${sub.slug}`}
          onClick={onClose}
          className="block px-6 py-2 text-sm text-gray-600"
        >
          {sub.name}
        </Link>
      </li>
    ))}
  </ul>
)}
            </div>
          ))}
          <Link
            to="/seller/dashboard"
            onClick={onClose}
            className="block px-3 py-3 text-sm text-orange-500 font-medium"
          >
            Sell on MarketHub
          </Link>
        </div>
      </div>
    </>
  )
}

export default MobileDrawer