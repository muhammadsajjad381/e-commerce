import { useSelector } from 'react-redux'
import { FiUsers } from 'react-icons/fi'

function AdminSellers() {
  const products = useSelector((state) => state.products.items)
  const orders = useSelector((state) => state.orders.items)

  // Build one summary row per seller
  const sellerMap = {}
  products.forEach((product) => {
    if (!sellerMap[product.seller]) {
      sellerMap[product.seller] = { name: product.seller, products: 0, lowStock: 0, units: 0, revenue: 0 }
    }
    sellerMap[product.seller].products += 1
    if (product.stock <= 5) sellerMap[product.seller].lowStock += 1
  })

  const productsById = new Map(products.map((p) => [p.id, p]))

  orders
    .filter((order) => order.status !== 'cancelled')
    .forEach((order) => {
      order.items.forEach((item) => {
        const product = productsById.get(item.id)
        if (product && sellerMap[product.seller]) {
          sellerMap[product.seller].units += item.qty
          sellerMap[product.seller].revenue += item.price * item.qty
        }
      })
    })

  const sellers = Object.values(sellerMap).sort((a, b) => b.revenue - a.revenue)

  if (sellers.length === 0) {
    return (
      <div className="text-center py-14 bg-white border border-gray-200 rounded-lg">
        <FiUsers size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 text-sm">No sellers yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
      <table className="w-full text-left text-xs sm:text-sm min-w-[560px]">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium">Seller</th>
            <th className="px-4 py-3 font-medium">Products</th>
            <th className="px-4 py-3 font-medium">Low stock</th>
            <th className="px-4 py-3 font-medium">Units sold</th>
            <th className="px-4 py-3 font-medium text-right">Revenue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sellers.map((seller) => (
            <tr key={seller.name}>
              <td className="px-4 py-3 font-medium text-gray-900">{seller.name}</td>
              <td className="px-4 py-3 text-gray-600">{seller.products}</td>
              <td className={`px-4 py-3 ${seller.lowStock > 0 ? 'text-red-500' : 'text-gray-600'}`}>
                {seller.lowStock}
              </td>
              <td className="px-4 py-3 text-gray-600">{seller.units}</td>
              <td className="px-4 py-3 text-right font-semibold text-orange-500">
                Rs. {seller.revenue.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminSellers