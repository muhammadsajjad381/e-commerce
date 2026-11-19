import { createSlice } from '@reduxjs/toolkit'
import { statusFlow } from '../config/orderStatus'

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
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload
      const order = state.items.find((o) => o.id === id)
      if (!order) return
      if (!statusFlow[order.status].includes(status)) return

      order.status = status

      if (status === 'delivered' && order.paymentMethod === 'cod') {
        order.paymentStatus = 'paid'
      }

      saveOrders(state.items)
    },
  },
})

export const { placeOrder, cancelOrder, updateOrderStatus } = orderSlice.actions
export default orderSlice.reducer