import { createSlice } from '@reduxjs/toolkit'

const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || []

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: savedWishlist,
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload
      const exists = state.items.find((item) => item.id === product.id)

      if (exists) {
        state.items = state.items.filter((item) => item.id !== product.id)
      } else {
        state.items.push(product)
      }

      localStorage.setItem('wishlist', JSON.stringify(state.items))
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      localStorage.setItem('wishlist', JSON.stringify(state.items))
    },
  },
})

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer