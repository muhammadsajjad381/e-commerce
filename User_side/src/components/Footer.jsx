import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10 sm:mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">

         
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3">
              Market<span className="text-orange-500">Hub</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
              Pakistan's marketplace for everyone — buy, sell, anything. New or used, trusted sellers.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition">
                <FiFacebook size={16} />
              </a>
              <a href="#" aria-label="Instagram" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition">
                <FiInstagram size={16} />
              </a>
              <a href="#" aria-label="Twitter" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition">
                <FiTwitter size={16} />
              </a>
              <a href="#" aria-label="YouTube" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition">
                <FiYoutube size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white mb-3">Quick Links</h3>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm">
              <li><Link to="/" className="hover:text-orange-500 transition">Home</Link></li>
              <li><Link to="/" className="hover:text-orange-500 transition">All Categories</Link></li>
              <li><Link to="/" className="hover:text-orange-500 transition">Sell on MarketHub</Link></li>
              <li><Link to="/" className="hover:text-orange-500 transition">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white mb-3">Customer Service</h3>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm">
              <li><Link to="/" className="hover:text-orange-500 transition">Help Center</Link></li>
              <li><Link to="/" className="hover:text-orange-500 transition">Returns & Refunds</Link></li>
              <li><Link to="/" className="hover:text-orange-500 transition">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-orange-500 transition">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white mb-3">Contact Us</h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <FiMapPin size={15} className="mt-0.5 shrink-0 text-orange-500" />
                <span>Faisalabad, Punjab, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone size={15} className="shrink-0 text-orange-500" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail size={15} className="shrink-0 text-orange-500" />
                <span>support@markethub.pk</span>
              </li>
            </ul>
          </div>
        </div>

      
        <div className="border-t border-gray-800 mt-8 sm:mt-10 pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-gray-400 text-center sm:text-left">
          <p>© {new Date().getFullYear()} MarketHub. All rights reserved.</p>
          <p>Made in Pakistan</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer