import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FiSearch, FiEye, FiTrash2, FiBox } from 'react-icons/fi'
import { deleteProduct } from '../../store/productSlice'

function AdminProducts() {
  const products = useSelector((state) => state.products.items)
  const dispatch = useDispatch()

  const [term, setTerm] = useState('')
  const [sellerFilter, setSellerFilter] = useState('all')

  const sellers = [...new Set(products.map((p) => p.seller))]
  const query = term.trim().toLowerCase()

  const visibleProducts = products.filter((p) => {
    const matchesSeller = sellerFilter === 'all' || p.seller === sellerFilter
    const matchesSearch = !query || p.title.toLowerCase().includes(query)
    return matchesSeller && matchesSearch
  })

  const handleDelete = (product) => {
    if (window.confirm(`Remove "${product.title}" from the marketplace?`)) {
      dispatch(deleteProduct(product.id))
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:border-orange-500 sm:w-72">
          <FiSearch size={14} className="text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search products"
            className="w-full outline-none text-sm"
          />
        </div>

        <select
          value={sellerFilter}
          onChange={(e) => setSellerFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-orange-500 bg-white sm:w-56"
        >
          <option value="all">All sellers</option>
          {sellers.map((seller) => (
            <option key={seller} value={seller}>{seller}</option>
          ))}
        </select>
      </div>

      <p className="text-xs sm:text-sm text-gray-500 mb-3">
        Showing {visibleProducts.length} of {products.length} products
      </p>

      {visibleProducts.length === 0 ? (
        <div className="text-center py-14 bg-white border border-gray-200 rounded-lg">
          <FiBox size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No products found.</p>
        </div>
      ) : (
        <ul className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {visibleProducts.map((product) => (
            <li key={product.id} className="flex items-center gap-3 p-3 sm:p-4">
              <img
                src={product.image}
                alt={product.title}
                className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded border border-gray-200 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1">{product.title}</p>
                <p className="text-[11px] sm:text-xs text-gray-500">
                  {product.seller} <span className="mx-1">|</span>
                  <span className="capitalize">{product.category}</span>
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs sm:text-sm font-semibold text-orange-500">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  <span className={`text-[11px] ${product.stock <= 5 ? 'text-red-500' : 'text-gray-500'}`}>
                    Stock: {product.stock}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Link
                  to={`/product/${product.id}`}
                  title="View"
                  className="p-2 text-gray-500 hover:text-orange-500 hover:bg-gray-50 rounded"
                >
                  <FiEye size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(product)}
                  title="Remove"
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-50 rounded"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AdminProducts