import { useState } from 'react'
import { FiGrid, FiPackage, FiShoppingBag, FiUsers } from 'react-icons/fi'
import AdminOverview from './AdminOverview'
import AdminOrders from './AdminOrders'
import AdminProducts from './AdminProducts'
import AdminSellers from './AdminSellers'

const tabs = [
  { id: 'overview', label: 'Overview', icon: FiGrid },
  { id: 'orders', label: 'Orders', icon: FiPackage },
  { id: 'products', label: 'Products', icon: FiShoppingBag },
  { id: 'sellers', label: 'Sellers', icon: FiUsers },
]

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">Admin Panel</h1>
        <p className="text-xs sm:text-sm text-gray-500">Manage the whole marketplace from one place</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 sm:mb-6 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-t-md text-xs sm:text-sm whitespace-nowrap border-b-2 transition ${
                active
                  ? 'border-orange-500 text-orange-500 font-medium'
                  : 'border-transparent text-gray-600 hover:text-orange-500'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'overview' && <AdminOverview />}
      {activeTab === 'orders' && <AdminOrders />}
      {activeTab === 'products' && <AdminProducts />}
      {activeTab === 'sellers' && <AdminSellers />}
    </div>
  )
}

export default AdminPanel