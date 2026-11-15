import { createSlice } from '@reduxjs/toolkit'

const savedOrders = JSON.parse(localStorage.getItem('orders')) || []

const saveOrders = (items) => localStorage.setItem('orders', JSON.stringify(items))

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: savedOrders,
  },
  reducers: {
    placeOrder: (state, action) => {
      state.items.unshift(action.payload)
      saveOrders(state.items)
    },

    cancelOrder: (state, action) => {
      const order = state.items.find((o) => o.id === action.payload)
     
      if (order && order.status === 'processing') {
        order.status = 'cancelled'
        saveOrders(state.items)
      }
    },
  },
})

export const { placeOrder, cancelOrder } = orderSlice.actions
export default orderSlice.reducer