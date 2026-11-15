import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiPackage,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import CategoryDropdown from "./CategoryDropdown";
import MobileDrawer from "./MobileDrawer";
import SearchBar from "./SearchBar";

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const wishlistCount = wishlistItems.length;

  return (
    <header className="w-full shadow-sm sticky top-0 z-50 bg-white">
      <div className="hidden md:block bg-gray-900 text-white text-xs py-1.5 px-4 text-center">
        Free delivery on orders over Rs. 2000
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <button
          className="md:hidden text-gray-700"
          onClick={() => setDrawerOpen(true)}
        >
          <FiMenu size={24} />
        </button>

        <Link
          to="/"
          className="text-xl md:text-2xl font-bold text-orange-500 shrink-0"
        >
          Market<span className="text-gray-900">Hub</span>
        </Link>
        <SearchBar
          placeholder="Search products, brands here..."
          className="hidden md:flex flex-1"
        />

        <button
          className="md:hidden ml-auto text-gray-700"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
        >
          <FiSearch size={22} />
        </button>

        <div className="hidden md:flex items-center gap-5 shrink-0 text-gray-700">
          <Link
            to="/login"
            className="flex flex-col items-center text-xs hover:text-orange-500"
          >
            <FiUser size={20} />
            <span>Login</span>
          </Link>
          <Link
            to="/wishlist"
            className="relative flex flex-col items-center text-xs hover:text-orange-500"
          >
            <FiHeart size={20} />
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/orders"
            className="flex flex-col items-center text-xs hover:text-orange-500"
          >
            <FiPackage size={20} />
            <span>Orders</span>
          </Link>
          <Link
            to="/cart"
            className="relative flex flex-col items-center text-xs hover:text-orange-500"
          >
            <FiShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <Link to="/cart" className="md:hidden relative text-gray-700">
          <FiShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
      {showMobileSearch && (
        <div className="md:hidden px-3 pb-3">
          <SearchBar
            placeholder="Search products..."
            className="flex w-full"
            onSearch={() => setShowMobileSearch(false)}
          />
        </div>
      )}

      <nav className="hidden md:block border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-6 text-sm text-gray-600">
          <CategoryDropdown />
          <Link
            to="/category/electronics"
            className="hover:text-orange-500 whitespace-nowrap py-2"
          >
            Electronics
          </Link>
          <Link
            to="/category/fashion"
            className="hover:text-orange-500 whitespace-nowrap py-2"
          >
            Fashion
          </Link>
          <Link
            to="/category/electronics?sub=mobiles"
            className="hover:text-orange-500 whitespace-nowrap py-2"
          >
            Mobiles
          </Link>
          <Link
            to="/category/home-living"
            className="hover:text-orange-500 whitespace-nowrap py-2"
          >
            Home & Living
          </Link>
          <Link to="/" className="hover:text-orange-500 whitespace-nowrap py-2">
            Sell on MarketHub
          </Link>
        </div>
      </nav>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}

export default Navbar;
