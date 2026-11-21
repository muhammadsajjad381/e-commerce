import mongoose from 'mongoose'
import crypto from 'crypto'
import { Order } from './order.model.js'
import { Product } from '../products/product.model.js'
import { ApiError } from '../../utils/ApiError.js'
import { statusFlow, SHIPPING_FEE, FREE_SHIPPING_FROM } from '../../config/orderStatus.js'

const MAX_QTY_PER_ITEM = 10

const generateOrderNumber = () =>
  `ORD-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Puts stock back for a list of order lines
async function restock(lines) {
  await Promise.all(
    lines.map((line) => Product.updateOne({ _id: line.product }, { $inc: { stock: line.qty } }))
  )
}

async function findOrderOrFail(id) {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(404, 'Order not found')
  const order = await Order.findById(id)
  if (!order) throw new ApiError(404, 'Order not found')
  return order
}

export async function createOrder(user, { items, shippingAddress, paymentMethod }) {
  // 1. Merge duplicate lines (the same product sent twice becomes one line)
  const wanted = new Map()
  for (const { productId, qty } of items) {
    wanted.set(productId, (wanted.get(productId) || 0) + qty)
  }
  for (const qty of wanted.values()) {
    if (qty > MAX_QTY_PER_ITEM) {
      throw new ApiError(400, `You can order at most ${MAX_QTY_PER_ITEM} units of one product`)
    }
  }

  // 2. Load the real products. Prices always come from the database.
  const ids = [...wanted.keys()]
  const products = await Product.find({ _id: { $in: ids }, isActive: true })
  if (products.length !== ids.length) {
    throw new ApiError(400, 'One or more products are no longer available')
  }

  const lines = products.map((product) => {
    if (product.seller.equals(user._id)) {
      throw new ApiError(400, 'You cannot buy your own product')
    }
    return {
      product: product._id,
      seller: product.seller,
      title: product.title,
      price: product.price,
      qty: wanted.get(product.id),
      image: product.images[0],
    }
  })

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0)
  const shippingFee = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE

  // 3. Reserve stock. The condition "stock >= qty" and the decrement happen in ONE
  //    atomic database operation, so two buyers can never both take the last item.
  const reserved = []
  try {
    for (const line of lines) {
      const result = await Product.updateOne(
        { _id: line.product, isActive: true, stock: { $gte: line.qty } },
        { $inc: { stock: -line.qty } }
      )
      if (result.modifiedCount !== 1) {
        throw new ApiError(409, `Not enough stock for "${line.title}"`)
      }
      reserved.push(line)
    }

    // 4. Create the order
    return await Order.create({
      orderNumber: generateOrderNumber(),
      buyer: user._id,
      items: lines,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      total: subtotal + shippingFee,
      statusHistory: [{ status: 'processing', by: user._id }],
    })
  } catch (err) {
    // Anything failed: give back what was already reserved
    await restock(reserved)
    throw err
  }
}

export async function listMyOrders(user) {
  return Order.find({ buyer: user._id }).sort({ createdAt: -1 }).limit(100)
}

export async function getOrder(user, id) {
  const order = await findOrderOrFail(id)
  // Other people's orders return 404, so their existence is not revealed
  if (user.role !== 'admin' && !order.buyer.equals(user._id)) {
    throw new ApiError(404, 'Order not found')
  }
  return order
}

// Moves an order to a new status safely
async function transition(order, newStatus, actor) {
  if (!statusFlow[order.status].includes(newStatus)) {
    throw new ApiError(400, `An order cannot move from ${order.status} to ${newStatus}`)
  }

  const update = {
    status: newStatus,
    $push: { statusHistory: { status: newStatus, by: actor._id, at: new Date() } },
  }

  // Cash on delivery is paid when the parcel is handed over
  if (newStatus === 'delivered' && order.paymentMethod === 'cod') {
    update.paymentStatus = 'paid'
  }

  // The filter includes the status we read earlier, so if someone else changed the order
  // in the meantime, this update matches nothing instead of overwriting their change
  const updated = await Order.findOneAndUpdate(
    { _id: order._id, status: order.status },
    update,
    { new: true }
  )
  if (!updated) {
    throw new ApiError(409, 'This order was just updated by someone else. Refresh and try again.')
  }

  // Only the request that actually won the cancel restocks, so stock is never added twice
  if (newStatus === 'cancelled') await restock(updated.items)

  return updated
}

export async function cancelOrder(user, id) {
  const order = await getOrder(user, id)

  if (user.role !== 'admin' && order.status !== 'processing') {
    throw new ApiError(400, 'Only orders that are still processing can be cancelled')
  }

  return transition(order, 'cancelled', user)
}

export async function updateOrderStatus(admin, id, status) {
  const order = await findOrderOrFail(id)
  return transition(order, status, admin)
}

export async function listAllOrders(q) {
  const filter = {}
  if (q.status) filter.status = q.status

  if (q.q) {
    const pattern = new RegExp(escapeRegex(q.q), 'i')
    filter.$or = [{ orderNumber: pattern }, { 'shippingAddress.fullName': pattern }]
  }

  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((q.page - 1) * q.limit)
      .limit(q.limit)
      .populate('buyer', 'name email'),
    Order.countDocuments(filter),
  ])

  return {
    items,
    pagination: { page: q.page, limit: q.limit, total, pages: Math.ceil(total / q.limit) },
  }
}

// A seller sees only the lines that belong to them
export async function listSellerOrders(user) {
  const orders = await Order.find({ 'items.seller': user._id }).sort({ createdAt: -1 }).limit(100)

  return orders.map((order) => {
    const items = order.items.filter((item) => item.seller.equals(user._id))
    return {
      _id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      shippingAddress: order.shippingAddress,
      items,
      sellerTotal: items.reduce((sum, item) => sum + item.price * item.qty, 0),
    }
  })
}