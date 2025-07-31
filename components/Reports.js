'use client'

import {useState, useEffect} from 'react'
import { useShop } from '@/contexts/ShopContext'
import {
    BarChart3,
    TrendingUp,
    Coins,
    Package,
    Calendar,
    Download,
    AlertTriangle,
    Star,
    Target,
    BarChart,
    Users,
    Percent,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    ShoppingCart,
    Store
} from 'lucide-react'
import {formatLargeNumber} from "@/lib/formatter";

export default function Reports() {
    const { currentShop } = useShop()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dateRange, setDateRange] = useState('thisMonth')

    useEffect(() => {
        fetchReportData()
    }, [currentShop, dateRange])

    async function fetchReportData() {
        if (!currentShop) return
        
        try {
            setLoading(true)
            const response = await fetch(`/api/dashboard?shopId=${currentShop.id}`)
            if (!response.ok) throw new Error('Failed to fetch report data')

            const data = await response.json()
            setStats(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const reportCards = [
        {
            title: 'Total Revenue (Month)',
            value: `KSH ${stats?.totalSalesThisMonth ? Number(stats.totalSalesThisMonth).toFixed(2) : '0.00'}`,
            icon: DollarSign,
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-50 to-emerald-50',
            description: 'Revenue generated this month',
            change: 12.5 // This would come from API comparison
        },
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: ShoppingCart,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50',
            description: 'Orders completed this month',
            change: 8.2
        },
        {
            title: 'Average Order Value',
            value: `KSH ${stats?.averageOrderValue ? Number(stats.averageOrderValue).toFixed(2) : '0.00'}`,
            icon: Target,
            gradient: 'from-purple-500 to-violet-500',
            bgGradient: 'from-purple-50 to-violet-50',
            description: 'Average value per order',
            change: -2.1
        },
        {
            title: 'Profit Margin',
            value: `${stats?.profitMargins?.margin || 0}%`,
            icon: Percent,
            gradient: 'from-yellow-500 to-orange-500',
            bgGradient: 'from-yellow-50 to-orange-50',
            description: 'Overall profit margin',
            change: 3.7
        },
        {
            title: 'Inventory Value',
            value: `KSH ${stats?.totalInventoryValue?.toFixed(2) || '0.00'}`,
            icon: Package,
            gradient: 'from-indigo-500 to-blue-500',
            bgGradient: 'from-indigo-50 to-blue-50',
            description: 'Current inventory value',
            change: 5.3
        },
        {
            title: 'Low Stock Alerts',
            value: stats?.lowStockItemsCount || 0,
            icon: AlertTriangle,
            gradient: 'from-red-500 to-rose-500',
            bgGradient: 'from-red-50 to-rose-50',
            description: 'Items requiring restocking',
            change: -15.2
        }
    ]

    if (error) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                        Reports & Analytics
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Business insights and performance metrics
                    </p>
                </div>

                <div
                    className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start">
                        <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0"/>
                        <div className="ml-3">
                            <h3 className="text-sm font-semibold text-red-800">Error loading reports</h3>
                            <p className="mt-1 text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Shop Header */}
            {stats?.shop && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                                    <Store className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{stats.shop.name}</h2>
                                    <p className="text-gray-600">Detailed Analytics Report</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-semibold text-gray-900">
                                    KSH {Number(stats.totalSalesThisYear || 0).toFixed(0)}
                                </div>
                                <div className="text-sm text-gray-500">Annual Revenue</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                        Reports & Analytics
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Comprehensive business insights and performance metrics
                    </p>
                </div>
                <div className="mt-6 lg:mt-0 flex items-center space-x-4">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                        <option value="thisWeek">This Week</option>
                        <option value="thisMonth">This Month</option>
                        <option value="lastMonth">Last Month</option>
                        <option value="thisYear">This Year</option>
                    </select>
                    <button
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                        <Download className="h-4 w-4 mr-2"/>
                        Export
                    </button>
                </div>
            </div>

            {/* Enhanced Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportCards.map((card, index) => (
                    <div
                        key={card.title}
                        className={`group relative bg-gradient-to-br ${card.bgGradient} backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105`}
                    >
                        {loading ? (
                            <div className="animate-pulse">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                                    <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                                </div>
                                <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
                                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 mb-2">
                                            {card.title}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mb-1">
                                            {formatLargeNumber(card.value)}
                                        </p>
                                        <div className="flex items-center mb-2">
                                            {card.change >= 0 ? (
                                                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                                            ) : (
                                                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                                            )}
                                            <span className={`text-sm font-medium ${card.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {Math.abs(card.change).toFixed(1)}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {card.description}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-r ${card.gradient} shadow-lg`}>
                                        <card.icon className="h-6 w-6 text-white"/>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Selling Items */}
                <div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                                    <Star className="h-5 w-5 text-white"/>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Top Performing Products
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-6">
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="animate-pulse flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                                            <div className="h-4 bg-gray-300 rounded w-32"></div>
                                        </div>
                                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                                    </div>
                                ))}
                            </div>
                        ) : stats?.topSellingItems && stats.topSellingItems.length > 0 ? (
                            <div className="space-y-4">
                                {stats.topSellingItems.map((item, index) => (
                                    <div key={item.id}
                                         className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
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
                                            <div className="text-lg font-semibold text-green-600">
                                                KSH {(item.revenue || 0).toFixed(2)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Revenue
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Star className="h-12 w-12 text-gray-300 mx-auto mb-4"/>
                                <p className="text-gray-500">No sales data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl">
                                <TrendingUp className="h-5 w-5 text-white"/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">
                                Recent Sales Activity
                            </h3>
                        </div>
                    </div>
                    <div className="px-6 py-6">
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                                            <div className="h-4 bg-gray-300 rounded w-16"></div>
                                        </div>
                                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : stats?.recentSales && stats.recentSales.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recentSales.map((sale) => (
                                    <div key={sale.id}
                                         className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
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
                                            KSH {Number(sale.total).toFixed(2)}
                                          </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4"/>
                                <p className="text-gray-500">No recent sales</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sales Trend Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                <div className="px-6 py-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl">
                            <BarChart3 className="h-5 w-5 text-white"/>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Sales Trend (Last 7 Days)
                        </h3>
                    </div>
                </div>
                <div className="px-6 py-6">
                    {stats?.salesTrend && stats.salesTrend.length > 0 ? (
                        <div className="space-y-4">
                            {stats.salesTrend.map((day, index) => (
                                <div key={day.date} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-sm font-medium text-gray-600 w-20">
                                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </div>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                                            <div 
                                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                                style={{ 
                                                    width: `${Math.max(5, (Number(day.sales) / Math.max(...stats.salesTrend.map(d => Number(d.sales)))) * 100)}%` 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        KSH {Number(day.sales).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4"/>
                            <p className="text-gray-500">No sales data available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                <div className="px-6 py-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl">
                            <PieChart className="h-5 w-5 text-white"/>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Business Performance
                        </h3>
                    </div>
                </div>
                <div className="px-6 py-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="text-center animate-pulse">
                                    <div className="h-8 bg-gray-300 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                                <div className="text-2xl font-bold text-blue-600 mb-2">
                                    {stats?.inventoryTurnover || 0}x
                                </div>
                                <div className="text-sm font-medium text-gray-600">Inventory Turnover</div>
                                <div className="text-xs text-gray-500 mt-1">Monthly rate</div>
                            </div>

                            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                                <div className="text-2xl font-bold text-green-600 mb-2">
                                    KSH {((stats?.totalSalesThisMonth || 0) / 30).toFixed(0)}
                                </div>
                                <div className="text-sm font-medium text-gray-600">Daily Average</div>
                                <div className="text-xs text-gray-500 mt-1">Revenue per day</div>
                            </div>

                            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                                <div className="text-2xl font-bold text-purple-600 mb-2">
                                    {stats?.profitMargins?.margin || 0}%
                                </div>
                                <div className="text-sm font-medium text-gray-600">Profit Margin</div>
                                <div className="text-xs text-gray-500 mt-1">Current inventory</div>
                            </div>

                            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                                <div className="text-2xl font-bold text-orange-600 mb-2">
                                    {((stats?.lowStockItemsCount || 0) / (stats?.totalItems || 1) * 100).toFixed(0)}%
                                </div>
                                <div className="text-sm font-medium text-gray-600">Stock Alert Rate</div>
                                <div className="text-xs text-gray-500 mt-1">Items needing restock</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Low Stock Alerts */}
            {stats?.lowStockDetails && stats.lowStockDetails.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                    <div className="px-6 py-6 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl">
                                <AlertTriangle className="h-5 w-5 text-white"/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">
                                Critical Stock Alerts
                            </h3>
                        </div>
                    </div>
                    <div className="px-6 py-6">
                        <div className="space-y-4">
                            {stats.lowStockDetails.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                                    <div className="flex items-center space-x-3">
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-500">{item.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-red-600">
                                            {item.stockQuantity}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Min: {item.minStockLevel}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">Ready to take action?</h3>
                    <p className="text-blue-100 mb-6">
                        Use these insights to optimize your inventory and boost sales performance
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/inventory"
                            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-all duration-200"
                        >
                            <Package className="h-5 w-5 mr-2"/>
                            Manage Inventory
                        </a>
                        <a
                            href="/sales/new"
                            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-400 transition-all duration-200"
                        >
                            <Coins className="h-5 w-5 mr-2"/>
                            Record New Sale
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}