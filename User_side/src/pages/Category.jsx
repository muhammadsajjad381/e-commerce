import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { FiFilter, FiSearch } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import {useSelector} from 'react-redux'
import { categories } from '../data/categories'

const defaultFilters = { minPrice: '', maxPrice: '', conditions: [], minRating: 0 }

function CategoryContent({ slug }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeSub = searchParams.get('sub') || ''

  const [filters, setFilters] = useState(defaultFilters)
  const [sort, setSort] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)

  const category = categories.find((c) => c.slug === slug)
const products = useSelector((state) => state.products.items)
  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-3">Category not found.</p>
        <Link to="/" className="text-orange-500 hover:underline">
          Go back to home
        </Link>
      </div>
    )
  }

  const selectSub = (subSlug) => {
    setSearchParams(subSlug ? { sub: subSlug } : {})
  }

  const toggleCondition = (value) => {
    setFilters((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(value)
        ? prev.conditions.filter((c) => c !== value)
        : [...prev.conditions, value],
    }))
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
    setSort('relevance')
    selectSub('')
  }

  const countInSub = (subSlug) =>
    products.filter((p) => p.category === slug && p.subcategory === subSlug).length

  let results = products.filter((p) => {
    if (p.category !== slug) return false
    if (activeSub && p.subcategory !== activeSub) return false
    if (filters.minPrice !== '' && p.price < Number(filters.minPrice)) return false
    if (filters.maxPrice !== '' && p.price > Number(filters.maxPrice)) return false
    if (filters.conditions.length > 0 && !filters.conditions.includes(p.condition)) return false
    if ((p.rating || 0) < filters.minRating) return false
    return true
  })

  if (sort === 'price-low') {
    results = [...results].sort((a, b) => a.price - b.price)
  } else if (sort === 'price-high') {
    results = [...results].sort((a, b) => b.price - a.price)
  } else if (sort === 'rating') {
    results = [...results].sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }

  const activeFilterCount =
    (filters.minPrice !== '' ? 1 : 0) +
    (filters.maxPrice !== '' ? 1 : 0) +
    filters.conditions.length +
    (filters.minRating > 0 ? 1 : 0) +
    (activeSub ? 1 : 0)

  const activeSubName = category.subcategories.find((s) => s.slug === activeSub)?.name

  const filterPanel = (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-5">

      {/* Subcategories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Subcategory</h3>
        <ul className="flex flex-col gap-1 text-sm">
          <li>
            <button
              onClick={() => selectSub('')}
              className={`w-full text-left px-2 py-1.5 rounded ${
                !activeSub ? 'bg-orange-50 text-orange-500 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All {category.name}
            </button>
          </li>
          {category.subcategories.map((sub) => (
            <li key={sub.slug}>
              <button
                onClick={() => selectSub(sub.slug)}
                className={`w-full flex justify-between px-2 py-1.5 rounded ${
                  activeSub === sub.slug
                    ? 'bg-orange-50 text-orange-500 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{sub.name}</span>
                <span className="text-xs text-gray-400">{countInSub(sub.slug)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Price (Rs.)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm outline-none focus:border-orange-500"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Condition</h3>
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          {['new', 'used'].map((value) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer capitalize">
              <input
                type="checkbox"
                checked={filters.conditions.includes(value)}
                onChange={() => toggleCondition(value)}
                className="accent-orange-500"
              />
              {value}
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Minimum Rating</h3>
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          {[
            { value: 0, label: 'Any rating' },
            { value: 3, label: '3 stars and above' },
            { value: 4, label: '4 stars and above' },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="minRating"
                checked={filters.minRating === option.value}
                onChange={() => setFilters({ ...filters, minRating: option.value })}
                className="accent-orange-500"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="text-sm text-red-500 border border-red-300 py-2 rounded-md hover:bg-red-50 transition"
        >
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

      {/* Breadcrumb */}
      <div className="text-xs sm:text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-orange-500">Home</Link> /{' '}
        <Link to={`/category/${slug}`} onClick={() => selectSub('')} className="hover:text-orange-500">
          {category.name}
        </Link>
        {activeSubName && <> / {activeSubName}</>}
      </div>


      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">
          {activeSubName || category.name}
          <span className="text-xs sm:text-sm text-gray-500 font-normal ml-2">
            ({results.length} {results.length === 1 ? 'product' : 'products'})
          </span>
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-1.5 border border-gray-300 rounded-md px-3 py-1.5 text-xs sm:text-sm text-gray-700"
          >
            <FiFilter size={14} />
            Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-xs sm:text-sm outline-none focus:border-orange-500"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

     
      {showFilters && <div className="lg:hidden mb-4">{filterPanel}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">

     
        <aside className="hidden lg:block lg:col-span-1 h-fit lg:sticky lg:top-28">
          {filterPanel}
        </aside>

        <div className="lg:col-span-3">
          {results.length === 0 ? (
            <div className="text-center py-16">
              <FiSearch size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-base sm:text-lg mb-1">No products match your filters.</p>
              <p className="text-gray-400 text-xs sm:text-sm mb-5">Try changing or clearing the filters.</p>
              <button
                onClick={clearFilters}
                className="bg-orange-500 text-white px-6 py-2.5 rounded-md text-sm hover:bg-orange-600 transition"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Wrapper: the key makes React reset all filters when the category changes
function Category() {
  const { slug } = useParams()
  return <CategoryContent key={slug} slug={slug} />
}

export default Category