import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi'
import { removeFromWishlist } from '../store/wishlistSlice'
import { addToCart } from '../store/cartSlice'

function Wishlist() {
  const items = useSelector((state) => state.wishlist.items)
  const dispatch = useDispatch()

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      qty: 1,
    }))
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <FiHeart size={40} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-base sm:text-lg mb-4"> WishList is empty</p>
        <Link
          to="/"
          className="inline-block bg-orange-500 text-white px-6 py-2.5 rounded-md text-sm sm:text-base hover:bg-orange-600 transition"
        >
          Products 
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
        My Wishlist ({items.length})
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition"
          >
            <Link to={`/product/${item.id}`} className="block relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-36 sm:h-44 md:h-48 object-cover"
              />
              <button
                onClick={(e) => {
                  e.preventDefault()
                  dispatch(removeFromWishlist(item.id))
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow hover:bg-red-50"
              >
                <FiTrash2 size={16} className="text-red-500" />
              </button>
            </Link>

            <div className="p-2.5 sm:p-3">
              <Link to={`/product/${item.id}`}>
                <h3 className="text-xs sm:text-sm text-gray-800 line-clamp-2 min-h-[2.2rem] sm:min-h-[2.5rem]">
                  {item.title}
                </h3>
              </Link>

              <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
                <span className="text-orange-500 font-bold text-sm sm:text-base">
                  Rs. {item.price.toLocaleString()}
                </span>
                {item.oldPrice && (
                  <span className="text-gray-400 text-xs line-through">
                    Rs. {item.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleAddToCart(item)}
                className="mt-2 w-full flex items-center justify-center gap-1.5 bg-gray-900 text-white text-xs sm:text-sm py-1.5 sm:py-2 rounded hover:bg-orange-500 transition"
              >
                <FiShoppingCart size={14} />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist