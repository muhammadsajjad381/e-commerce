import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import { Routes, Route } from 'react-router-dom'
import Cart from './pages/Cart'

import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
       </Routes>
       <Footer />
      
      
    </>
  )
}

export default App