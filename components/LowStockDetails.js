'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useShop } from '@/contexts/ShopContext'
import { 
  ArrowLeft, 
  AlertTriangle, 
  Package, 
  TrendingDown,
  Edit,
  ShoppingCart,
  Loader2,
  Eye,
  ExternalLink
} from 'lucide-react'
import { formatLargeNumber } from '@/lib/formatter'

export default function LowStockDetails() {
  const { currentShop } = useShop()
  const [lowStockItems, setLowStockItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    if (currentShop) {
      fetchLowStockData()
    }
  }, [currentShop])

  async function fetchLowStockData() {
    try {
      setLoading(true)
      
      // Fetch low stock items
      const response = await fetch(`/api/items?shopId=${currentShop.id}&lowStock=true&limit=100`)
      if (!response.ok) throw new Error('Failed to fetch low stock data')
      
      const data = await response.json()
      setLowStockItems(data.items || [])
      
      // Calculate stats
      const totalValue = data.items.reduce((sum, item) => 
        sum + (item.stockQuantity * parseFloat(item.sellingPrice)), 0
      )
      const totalCost = data.items.reduce((sum, item) => 
        sum + (item.stockQuantity * parseFloat(item.purchasePrice)), 0
      )
      const totalNeeded = data.items.reduce((sum, item) => 
        sum + Math.max(0, item.minStockLevel - item.stockQuantity), 0
      )
      const restockCost = data.items.reduce((sum, item) => 
        sum + (Math.max(0, item.minStockLevel - item.stockQuantity) * parseFloat(item.purchasePrice)), 0
      )
      
      setStats({
        totalItems: data.items.length,
        totalValue,
        totalCost,
        totalNeeded,
        restockCost
      })
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getCriticalityLevel = (item) => {
    const ratio = item.stockQuantity / item.minStockLevel
    if (ratio <= 0) return { level: 'critical', color: 'red', text: 'Out of Stock' }
    if (ratio <= 0.25) return { level: 'critical', color: 'red', text: 'Critical' }
    if (ratio <= 0.5) return { level: 'warning', color: 'orange', text: 'Very Low' }
    return { level: 'low', color: 'yellow', text: 'Low Stock' }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link 
            href="/dashboard"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            Low Stock Analysis
          </h1>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-red-800">Error loading data</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Link 
              href="/dashboard"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              Low Stock Analysis
            </h1>
          </div>
          <p className="text-lg text-gray-600 ml-14">
            Items requiring immediate attention and restocking
          </p>
        </div>
        <div className="mt-6 lg:mt-0">
          <Link
            href="/inventory"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 hover:scale-105"
          >
            <Package className="h-5 w-5 mr-2" />
            Manage Inventory
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-red-100 to-red-200 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalItems}</div>
              <div className="text-sm text-gray-600">Items Low Stock</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalNeeded}</div>
              <div className="text-sm text-gray-600">Units Needed</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
              <TrendingDown className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {formatLargeNumber(`KSH ${stats.totalValue?.toFixed(2) || '0.00'}`)}
              </div>
              <div className="text-sm text-gray-600">Current Value</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl">
              <ShoppingCart className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {formatLargeNumber(`KSH ${stats.restockCost?.toFixed(2) || '0.00'}`)}
              </div>
              <div className="text-sm text-gray-600">Restock Cost</div>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Items */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Low Stock Items</h3>
          </div>
        </div>

        {lowStockItems.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All items are well stocked!</h3>
            <p className="text-gray-600">No items require immediate restocking at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {/* Header Row */}
            <div className="hidden md:grid md:grid-cols-7 gap-4 px-6 py-4 bg-gray-50/50 text-sm font-semibold text-gray-700">
              <div className="col-span-2">Product</div>
              <div className="text-center">Current Stock</div>
              <div className="text-center">Min Level</div>
              <div className="text-center">Status</div>
              <div className="text-center">Restock Cost</div>
              <div className="text-center">Actions</div>
            </div>

            {lowStockItems.map((item) => {
              const criticality = getCriticalityLevel(item)
              const needed = Math.max(0, item.minStockLevel - item.stockQuantity)
              const restockCost = needed * parseFloat(item.purchasePrice)

              return (
                <div key={item.id} className="p-6">
                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        <p className="text-sm text-gray-500">Category: {item.category}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium bg-${criticality.color}-100 text-${criticality.color}-800`}>
                        {criticality.text}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                      <div>
                        <div className="text-sm text-gray-500">Current Stock</div>
                        <div className="font-semibold text-gray-900">{item.stockQuantity}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Min Level</div>
                        <div className="font-semibold text-gray-900">{item.minStockLevel}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Need to Order</div>
                        <div className="font-semibold text-red-600">{needed} units</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Restock Cost</div>
                        <div className="font-semibold text-green-600">KSH {restockCost.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-3 border-t border-gray-100">
                      <Link
                        href={`/inventory/${item.id}`}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                      <Link
                        href={`/inventory/${item.id}`}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-200"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Update Stock
                      </Link>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-7 gap-4 items-center">
                    <div className="col-span-2">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        item.stockQuantity === 0 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {item.stockQuantity}
                      </span>
                    </div>
                    <div className="text-center font-medium text-gray-900">
                      {item.minStockLevel}
                    </div>
                    <div className="text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${criticality.color}-100 text-${criticality.color}-800`}>
                        {criticality.text}
                      </span>
                    </div>
                    <div className="text-center font-semibold text-green-600">
                      KSH {restockCost.toFixed(2)}
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Link
                          href={`/inventory/${item.id}`}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                        <Link
                          href={`/inventory/${item.id}`}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}