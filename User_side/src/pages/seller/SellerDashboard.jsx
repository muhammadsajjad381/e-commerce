import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, FiBox, FiTrendingUp, FiDollarSign, FiAlertTriangle } from 'react-icons/fi'
import { deleteProduct } from '../../store/productSlice'
import { CURRENT_SELLER } from '../../config/seller'

function StockBadge({ stock }) {
  if (stock === 0) {
    return <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-600">Out of stock</span>
  }
  if (stock <= 5) {
    return <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Low stock: {stock}</span>
  }
  return <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">In stock: {stock}</span>
}

function SellerDashboard() {
  const dispatch = useDispatch()
  const allProducts = useSelector((state) => state.products.items)
  const orders = useSelector((state) => state.orders.items)
  const [term, setTerm] = useState('')

  const myProducts = allProducts.filter((p) => p.seller === CURRENT_SELLER)
  const myIds = new Set(myProducts.map((p) => p.id))

  // Sales: count items from non-cancelled orders that belong to this seller
  let unitsSold = 0
  let revenue = 0
  orders
    .filter((order) => order.status !== 'cancelled')
    .forEach((order) => {
      order.items.forEach((item) => {
        if (myIds.has(item.id)) {
          unitsSold += item.qty
          revenue += item.price * item.qty
        }
      })
    })

  const lowStockCount = myProducts.filter((p) => p.stock <= 5).length

  const visibleProducts = myProducts.filter((p) =>
    p.title.toLowerCase().includes(term.trim().toLowerCase())
  )

  const handleDelete = (product) => {
    if (window.confirm(`Delete "${product.title}"? This cannot be undone.`)) {
      dispatch(deleteProduct(product.id))
    }
  }

  const stats = [
    { label: 'My Products', value: myProducts.length, icon: FiBox },
    { label: 'Units Sold', value: unitsSold, icon: FiTrendingUp },
    { label: 'Revenue', value: `Rs. ${revenue.toLocaleString()}`, icon: FiDollarSign },
    { label: 'Low / Out of Stock', value: lowStockCount, icon: FiAlertTriangle },
  ]

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">Seller Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500">Store: {CURRENT_SELLER}</p>
        </div>
        <Link
          to="/seller/products/new"
          className="flex items-center gap-1.5 bg-orange-500 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-600 transition"
        >
          <FiPlus size={16} />
          Add Product
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] sm:text-xs text-gray-500">{stat.label}</span>
                <Icon size={16} className="text-orange-500" />
              </div>
              <p className="text-base sm:text-xl font-bold text-gray-900 break-words">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Product list */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between flex-wrap gap-3 p-3 sm:p-4 border-b border-gray-100">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900">My Products</h2>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 w-full sm:w-64 focus-within:border-orange-500">
            <FiSearch size={14} className="text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search my products"
              className="w-full outline-none text-sm"
            />
          </div>
        </div>

        {myProducts.length === 0 ? (
          <div className="text-center py-14 px-4">
            <FiBox size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm sm:text-base mb-4">You have not listed any products yet.</p>
            <Link
              to="/seller/products/new"
              className="inline-block bg-orange-500 text-white px-5 py-2 rounded-md text-sm hover:bg-orange-600 transition"
            >
              Add Your First Product
            </Link>
          </div>
        ) : visibleProducts.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-10">No products match your search.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visibleProducts.map((product) => (
              <li key={product.id} className="flex items-center gap-3 p-3 sm:p-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded border border-gray-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-900 font-medium line-clamp-1">{product.title}</p>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <span className="text-xs sm:text-sm text-orange-500 font-semibold">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-gray-400 capitalize">{product.condition}</span>
                    <StockBadge stock={product.stock} />
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  <Link
                    to={`/product/${product.id}`}
                    title="View"
                    className="p-2 text-gray-500 hover:text-orange-500 hover:bg-gray-50 rounded"
                  >
                    <FiEye size={16} />
                  </Link>
                  <Link
                    to={`/seller/products/${product.id}/edit`}
                    title="Edit"
                    className="p-2 text-gray-500 hover:text-blue-500 hover:bg-gray-50 rounded"
                  >
                    <FiEdit2 size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(product)}
                    title="Delete"
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
    </div>
  )
}

export default SellerDashboard