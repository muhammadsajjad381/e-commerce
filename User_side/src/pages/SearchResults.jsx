import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import { dummyProducts } from '../data/products'

function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('q') || '').trim()
  const [sort, setSort] = useState('relevance')

  // Query ko words mein todein: "wireless headphones" -> ["wireless", "headphones"]
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)

  let results = dummyProducts.filter((product) => {
    const text = `${product.title} ${product.description || ''}`.toLowerCase()
    return words.every((word) => text.includes(word))
  })

  if (sort === 'price-low') {
    results = [...results].sort((a, b) => a.price - b.price)
  } else if (sort === 'price-high') {
    results = [...results].sort((a, b) => b.price - a.price)
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

      <div className="flex items-center justify-between flex-wrap gap-3 mb-4 sm:mb-6">
        <h1 className="text-base sm:text-xl font-semibold text-gray-900">
          Results for "<span className="text-orange-500">{query}</span>"
          <span className="text-xs sm:text-sm text-gray-500 font-normal ml-2">
            ({results.length} found)
          </span>
        </h1>

        {results.length > 1 && (
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-xs sm:text-sm outline-none focus:border-orange-500"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        )}
      </div>

      {results.length === 0 ? (
        <div className="text-center py-16">
          <FiSearch size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-base sm:text-lg mb-1">Koi product nahi mila.</p>
          <p className="text-gray-400 text-xs sm:text-sm mb-5">
            Kisi aur keyword se try karein ya spelling check karein.
          </p>
          <Link
            to="/"
            className="inline-block bg-orange-500 text-white px-6 py-2.5 rounded-md text-sm sm:text-base hover:bg-orange-600 transition"
          >
            Home Pe Wapis Jayein
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchResults