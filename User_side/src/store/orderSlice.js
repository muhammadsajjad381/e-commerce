import { createSlice } from '@reduxjs/toolkit'

const savedOrders = JSON.parse(localStorage.getItem('orders')) || []

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: savedOrders,
  },
  reducers: {
    placeOrder: (state, action) => {
      state.items.unshift(action.payload)  
      localStorage.setItem('orders', JSON.stringify(state.items))
    },
  },
})

export const { placeOrder } = orderSlice.actions
export default orderSlice.reducer