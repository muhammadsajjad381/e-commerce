import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'

function ProductCard({ product }) {
  const dispatch = useDispatch()

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      qty: 1,
    }))
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition group">
      <Link to={`/product/${product.id}`} className="block relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-36 sm:h-44 md:h-48 object-cover"
        />
        {product.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded">
            -{product.discount}%
          </span>
        )}
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition"
        >
          <FiHeart size={16} className="text-gray-600" />
        </button>
      </Link>

      <div className="p-2.5 sm:p-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-xs sm:text-sm text-gray-800 line-clamp-2 min-h-[2.2rem] sm:min-h-[2.5rem]">
            {product.title}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
          <span className="text-orange-500 font-bold text-sm sm:text-base">
            Rs. {product.price.toLocaleString()}
          </span>
          {product.oldPrice && (
            <span className="text-gray-400 text-xs line-through">
              Rs. {product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-2 w-full flex items-center justify-center gap-1.5 bg-gray-900 text-white text-xs sm:text-sm py-1.5 sm:py-2 rounded hover:bg-orange-500 transition"
        >
          <FiShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard