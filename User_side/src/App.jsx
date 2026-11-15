import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import { Routes, Route } from 'react-router-dom'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import Register from './pages/Register'
import SearchResults from './pages/SearchResults'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Category from './pages/Category'
import Orders from './pages/Orders'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/checkout" element={<Checkout />} />
<Route path="/order-success" element={<OrderSuccess />} />
<Route path="/orders" element={<Orders />} />
<Route path="/category/:slug" element={<Category />} />
       </Routes>
       <Footer />
      
      
    </>
  )
}

export default App