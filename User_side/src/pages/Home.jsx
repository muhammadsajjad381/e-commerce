import ProductCard from '../components/ProductCard'

// Dummy data - baad mein ye backend API se aayega
const dummyProducts = [
  { id: 1, title: 'Wireless Bluetooth Headphones Over-Ear', price: 2499, oldPrice: 3999, discount: 37, image: 'https://picsum.photos/seed/p1/300/300' },
  { id: 2, title: 'Men\'s Casual Cotton Shirt', price: 1299, image: 'https://picsum.photos/seed/p2/300/300' },
  { id: 3, title: 'Smart Watch Fitness Tracker', price: 3599, oldPrice: 4999, discount: 28, image: 'https://picsum.photos/seed/p3/300/300' },
  { id: 4, title: 'Stainless Steel Kitchen Knife Set', price: 1899, image: 'https://picsum.photos/seed/p4/300/300' },
  { id: 5, title: 'Leather Handbag for Women', price: 2899, oldPrice: 3499, discount: 17, image: 'https://picsum.photos/seed/p5/300/300' },
  { id: 6, title: 'Gaming Mouse RGB Wired', price: 1499, image: 'https://picsum.photos/seed/p6/300/300' },
  { id: 7, title: 'Ceramic Coffee Mug Set of 6', price: 999, image: 'https://picsum.photos/seed/p7/300/300' },
  { id: 8, title: 'Running Shoes for Men', price: 3299, oldPrice: 4299, discount: 23, image: 'https://picsum.photos/seed/p8/300/300' },
]

const categories = [
  { name: 'Electronics', icon: '📱' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Home & Living', icon: '🏠' },
  { name: 'Vehicles', icon: '🚗' },
  { name: 'Beauty', icon: '💄' },
  { name: 'Sports', icon: '⚽' },
]

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-xl p-6 sm:p-10 md:p-14 text-white mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2">
          Buy, Sell, Anything
        </h1>
        <p className="text-sm sm:text-base opacity-90 mb-4">
          Pakistan's marketplace for everyone — new, used, anything.
        </p>
        <button className="bg-white text-orange-500 font-semibold text-sm sm:text-base px-5 sm:px-6 py-2 sm:py-2.5 rounded-md hover:bg-gray-100 transition">
          Shop Now
        </button>
      </div>

      {/* Categories quick links */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-orange-500 hover:shadow-sm transition cursor-pointer"
          >
            <span className="text-2xl sm:text-3xl mb-1">{cat.icon}</span>
            <span className="text-[11px] sm:text-xs text-gray-700 text-center">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Featured Products</h2>
        <a href="#" className="text-orange-500 text-xs sm:text-sm hover:underline">View All</a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {dummyProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </div>
  )
}

export default Home