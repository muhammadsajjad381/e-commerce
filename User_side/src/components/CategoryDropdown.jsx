import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'
import { categories } from '../data/categories'

function CategoryDropdown() {
  const [open, setOpen] = useState(false)
  const [activeSlug, setActiveSlug] = useState(categories[0].slug)

  const activeCategory = categories.find((c) => c.slug === activeSlug)

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
          
          <ul className="w-52 border-r border-gray-100">
            {categories.map((cat) => (
              <li key={cat.slug} onMouseEnter={() => setActiveSlug(cat.slug)}>
                <Link
                  to={`/category/${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                    activeSlug === cat.slug
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                  <FiChevronRight size={14} />
                </Link>
              </li>
            ))}
          </ul>

          <ul className="w-52 p-2">
            {activeCategory.subcategories.map((sub) => (
              <li key={sub.slug}>
                <Link
                  to={`/category/${activeCategory.slug}?sub=${sub.slug}`}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-gray-50 rounded"
                >
                  {sub.name}
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