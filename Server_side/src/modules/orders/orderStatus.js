
export const statusFlow = {
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
}

export const SHIPPING_FEE = 150
export const FREE_SHIPPING_FROM = 2000