
import { createSlice } from '@reduxjs/toolkit'
import { dummyProducts } from '../data/products'

const loadProducts = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('products'))
    return Array.isArray(saved) ? saved : dummyProducts
  } catch {
    return dummyProducts
  }
}


const saveProducts = (items) => {
  try {
    localStorage.setItem('products', JSON.stringify(items))
  } catch {
    console.warn('Storage is full. Use smaller or fewer images.')
  }
}

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: loadProducts(),
  },
  reducers: {
    addProduct: (state, action) => {
      state.items.unshift(action.payload)
      saveProducts(state.items)
    },

    updateProduct: (state, action) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
        saveProducts(state.items)
      }
    },

    deleteProduct: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload)
      saveProducts(state.items)
    },
  },
})

export const { addProduct, updateProduct, deleteProduct } = productSlice.actions
export default productSlice.reducer