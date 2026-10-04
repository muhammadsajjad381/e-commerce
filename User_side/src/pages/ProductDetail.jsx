import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiStar, FiMinus, FiPlus, FiTruck, FiShield } from 'react-icons/fi'
import { dummyProducts } from '../data/products'

function ProductDetail() {
  const { id } = useParams()
  const product = dummyProducts.find((p) => p.id === Number(id))

  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        <p className="text-gray-600">Product nahi mila.</p>
        <Link to="/" className="text-orange-500 hover:underline">Home pe wapis jayein</Link>
      </div>
    )
  }

  const increaseQty = () => {
    if (qty < product.stock) setQty(qty + 1)
  }
  const decreaseQty = () => {
    if (qty > 1) setQty(qty - 1)
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

      {/* Breadcrumb */}
      <div className="text-xs sm:text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-orange-500">Home</Link> / {product.title}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

        {/* LEFT: Images */}
        <div>
          <div className="w-full aspect-square bg-white border border-gray-200 rounded-lg overflow-hidden mb-3">
            <img
              src={product.images[activeImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-md overflow-hidden border-2 ${
                  activeImage === idx ? 'border-orange-500' : 'border-gray-200'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Info */}
        <div>
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 text-yellow-500">
              <FiStar fill="currentColor" size={16} />
              <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500">({product.reviews} reviews)</span>
            <span className="text-xs sm:text-sm text-gray-400">|</span>
            <span className="text-xs sm:text-sm text-gray-500">Sold by {product.seller}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4 flex-wrap">
            <span className="text-2xl sm:text-3xl font-bold text-orange-500">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.oldPrice && (
              <>
                <span className="text-gray-400 line-through text-sm sm:text-base">
                  Rs. {product.oldPrice.toLocaleString()}
                </span>
                <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600 mb-5 leading-relaxed">
            {product.description}
          </p>

          {/* Stock */}
          <p className="text-sm mb-4">
            Stock:{' '}
            <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-500'}>
              {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </span>
          </p>

          {/* Quantity selector */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button onClick={decreaseQty} className="p-2 hover:bg-gray-100">
                <FiMinus size={14} />
              </button>
              <span className="px-4 text-sm font-medium">{qty}</span>
              <button onClick={increaseQty} className="p-2 hover:bg-gray-100">
                <FiPlus size={14} />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 sm:py-3 rounded-md text-sm sm:text-base hover:bg-orange-500 transition">
              <FiShoppingCart size={18} />
              Add to Cart
            </button>
            <button className="p-2.5 sm:p-3 border border-gray-300 rounded-md hover:border-orange-500 hover:text-orange-500 transition">
              <FiHeart size={20} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-col gap-2 text-xs sm:text-sm text-gray-600 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2">
              <FiTruck size={16} className="text-orange-500" />
              Fast delivery across Pakistan
            </div>
            <div className="flex items-center gap-2">
              <FiShield size={16} className="text-orange-500" />
              100% genuine product guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail