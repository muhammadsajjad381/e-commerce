import * as service from './order.service.js'

export const create = async (req, res) => {
  const order = await service.createOrder(req.user, req.body)
  res.status(201).json({ success: true, data: { order } })
}

export const mine = async (req, res) => {
  const orders = await service.listMyOrders(req.user)
  res.json({ success: true, data: { orders } })
}

export const getOne = async (req, res) => {
  const order = await service.getOrder(req.user, req.params.id)
  res.json({ success: true, data: { order } })
}

export const cancel = async (req, res) => {
  const order = await service.cancelOrder(req.user, req.params.id)
  res.json({ success: true, data: { order } })
}

export const setStatus = async (req, res) => {
  const order = await service.updateOrderStatus(req.user, req.params.id, req.body.status)
  res.json({ success: true, data: { order } })
}

export const listAll = async (req, res) => {
  const { items, pagination } = await service.listAllOrders(req.validated.query)
  res.json({ success: true, data: { orders: items, pagination } })
}

export const sellerOrders = async (req, res) => {
  const orders = await service.listSellerOrders(req.user)
  res.json({ success: true, data: { orders } })
}