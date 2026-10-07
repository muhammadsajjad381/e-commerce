import { createSlice } from '@reduxjs/toolkit'

const savedCart = JSON.parse(localStorage.getItem('cart')) || []

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: savedCart,
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload
      const existing = state.items.find((item) => item.id === product.id)

      if (existing) {
        existing.qty += product.qty
      } else {
        state.items.push(product)
      }

      localStorage.setItem('cart', JSON.stringify(state.items))
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      localStorage.setItem('cart', JSON.stringify(state.items))
    },

    updateQty: (state, action) => {
      const { id, qty } = action.payload
      const item = state.items.find((item) => item.id === id)
      if (item) item.qty = qty
      localStorage.setItem('cart', JSON.stringify(state.items))
    },

    clearCart: (state) => {
      state.items = []
      localStorage.setItem('cart', JSON.stringify([]))
    },
  },
})

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions
export default cartSlice.reducer