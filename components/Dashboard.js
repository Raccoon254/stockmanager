'use client'

import { useState, useEffect } from 'react'
import { 
  Coins,
  Package, 
  ShoppingCart, 
  AlertTriangle,
  TrendingUp,
  Star,
  Clock,
  ArrowUpRight
} from 'lucide-react'

function formatLargeNumber(value) {
if (typeof value !== 'number') {
  // Check if it's a string with KSH prefix
  if (typeof value === 'string' && value.toUpperCase().includes('KSH')) {
    const numericValue = parseFloat(value.toUpperCase().replace('KSH', '').trim())
    if (isNaN(numericValue)) return value

    // Format the number
    let formattedValue
    if (numericValue >= 1e9) formattedValue = `${(numericValue / 1e9).toFixed(1)}B`
    else if (numericValue >= 1e6) formattedValue = `${(numericValue / 1e6).toFixed(1)}M`
    else if (numericValue >= 1e3) formattedValue = `${(numericValue / 1e3).toFixed(1)}K`
    else formattedValue = numericValue.toString()

    // Add KSH prefix back
    return `KSH ${formattedValue}`
  }
  return value
}
if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`
if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`
return value.toString()
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const response = await fetch('/api/dashboard')
        if (!response.ok) throw new Error('Failed to fetch dashboard data')
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm h-32"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-red-800">Error loading dashboard</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Inventory Value',
      value: `KSH ${stats?.totalInventoryValue?.toFixed(2) || '0.00'}`,
      icon: Package,
      gradient: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/25',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      name: "Today's Sales",
      value: `KSH ${Number(stats?.todaySales || 0).toFixed(2)}`,
      icon: Coins,
      gradient: 'from-green-500 to-emerald-500',
      shadowColor: 'shadow-green-500/25',
      bgGradient: 'from-green-50 to-emerald-50',
    },
    {
      name: 'Sales Count Today',
      value: stats?.todaySalesCount || 0,
      icon: ShoppingCart,
      gradient: 'from-purple-500 to-violet-500',
      shadowColor: 'shadow-purple-500/25',
      bgGradient: 'from-purple-50 to-violet-50',
    },
    {
      name: 'Low Stock Items',
      value: stats?.lowStockItemsCount || 0,
      icon: AlertTriangle,
      gradient: 'from-red-500 to-rose-500',
      shadowColor: 'shadow-red-500/25',
      bgGradient: 'from-red-50 to-rose-50',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div 
            key={card.name} 
            className={`group relative bg-gradient-to-br ${card.bgGradient} backdrop-blur-sm rounded-2xl p-6 shadow-lg ${card.shadowColor} hover:shadow-xl hover:shadow-${card.shadowColor.split('/')[0]}/30 transition-all duration-300 hover:scale-105 border border-white/20`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {card.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-4">
                  {formatLargeNumber(card.value)}
                </p>
              </div>
              <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-r ${card.gradient} shadow-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>View details</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Top Selling Items
                </h3>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                This Week
              </span>
            </div>
          </div>
          <div className="px-6 py-6">
            {stats?.topSellingItems && stats.topSellingItems.length > 0 ? (
              <div className="space-y-4">
                {stats.topSellingItems.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                        index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-700' :
                        'bg-gradient-to-r from-gray-300 to-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.quantitySold} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        #{index + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No sales data available</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Recent Sales
              </h3>
            </div>
          </div>
          <div className="px-6 py-6">
            {stats?.recentSales && stats.recentSales.length > 0 ? (
              <div className="space-y-4">
                {stats.recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {sale.customerName || 'Walk-in Customer'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(sale.createdAt).toLocaleDateString()} • {sale.itemCount} items
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600">
                        ${(Number(sale.total) || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent sales</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Quick Overview
              </h3>
            </div>
          </div>
        </div>
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats?.totalItems || 0}
              </div>
              <div className="text-sm font-medium text-gray-600">Total Items in Stock</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ${Number(stats?.totalSalesThisMonth || 0).toFixed(2)}
              </div>
              <div className="text-sm font-medium text-gray-600">Sales This Month</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats?.lowStockItemsCount || 0}
              </div>
              <div className="text-sm font-medium text-gray-600">Items Need Restocking</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}