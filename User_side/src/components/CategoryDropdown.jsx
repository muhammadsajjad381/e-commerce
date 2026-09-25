import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'

const categories = [
  {
    name: 'Electronics',
    subcategories: ['Mobiles', 'Laptops', 'Cameras', 'Accessories'],
  },
  {
    name: 'Fashion',
    subcategories: ["Men's Wear", "Women's Wear", 'Kids', 'Footwear'],
  },
  {
    name: 'Home & Living',
    subcategories: ['Furniture', 'Kitchen', 'Decor', 'Bedding'],
  },
  {
    name: 'Vehicles',
    subcategories: ['Cars', 'Bikes', 'Spare Parts'],
  },
]

function CategoryDropdown() {
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(categories[0].name)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 hover:text-orange-500 whitespace-nowrap py-2">
        All Categories
        <FiChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute top-full left-0 flex bg-white shadow-lg border border-gray-200 rounded-md overflow-hidden z-50">
      
          <ul className="w-48 border-r border-gray-100">
            {categories.map((cat) => (
              <li
                key={cat.name}
                onMouseEnter={() => setActiveCategory(cat.name)}
                className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer ${
                  activeCategory === cat.name
                    ? 'bg-orange-50 text-orange-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cat.name}
                <FiChevronRight size={14} />
              </li>
            ))}
          </ul>

          
          <ul className="w-48 p-2">
            {categories
              .find((c) => c.name === activeCategory)
              ?.subcategories.map((sub) => (
                <li key={sub}>
                  <Link
                    to="/"
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-gray-50 rounded"
                  >
                    {sub}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CategoryDropdown