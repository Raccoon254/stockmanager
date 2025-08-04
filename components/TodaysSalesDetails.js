'use client'

import {useState, useEffect} from 'react'
import Link from 'next/link'
import {useShop} from '@/contexts/ShopContext'
import {
    ArrowLeft,
    TrendingUp,
    ShoppingCart,
    Coins,
    Clock,
    Loader2,
    Eye,
    User,
    Calendar,
    BarChart3,
    Plus, BarChart
} from 'lucide-react'
import {formatLargeNumber} from '@/lib/formatter'
import SalesTrendChart from '@/components/SalesTrendChart'

export default function TodaysSalesDetails() {
    const {currentShop} = useShop()
    const [salesData, setSalesData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [stats, setStats] = useState({})
    const [hourlyData, setHourlyData] = useState([])

    useEffect(() => {
        if (currentShop) {
            fetchTodaysSalesData()
        }
    }, [currentShop])

    async function fetchTodaysSalesData() {
        try {
            setLoading(true)

            const today = new Date().toISOString().split('T')[0]
            const response = await fetch(`/api/sales?shopId=${currentShop.id}&startDate=${today}&endDate=${today}&limit=100&sortBy=createdAt&sortOrder=desc`)

            if (!response.ok) throw new Error('Failed to fetch today\'s sales data')

            const data = await response.json()
            const sales = data.sales || []
            setSalesData(sales)

            // Calculate stats
            const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.total), 0)
            const totalProfit = sales.reduce((sum, sale) => {
                return sum + sale.saleItems.reduce((itemSum, saleItem) => {
                    const profit = (parseFloat(saleItem.unitPrice) - parseFloat(saleItem.item.purchasePrice)) * saleItem.quantity
                    return itemSum + profit
                }, 0)
            }, 0)
            const totalItems = sales.reduce((sum, sale) =>
                sum + sale.saleItems.reduce((itemSum, saleItem) => itemSum + saleItem.quantity, 0), 0
            )
            const averageOrderValue = sales.length > 0 ? totalSales / sales.length : 0
            const totalDiscount = sales.reduce((sum, sale) => sum + parseFloat(sale.discount || 0), 0)

            // Payment method breakdown
            const paymentMethods = sales.reduce((acc, sale) => {
                acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + 1
                return acc
            }, {})

            // Hourly breakdown
            const hourlyBreakdown = Array.from({length: 24}, (_, hour) => ({
                hour,
                sales: 0,
                revenue: 0,
                transactions: 0
            }))

            sales.forEach(sale => {
                const hour = new Date(sale.createdAt).getHours()
                hourlyBreakdown[hour].transactions += 1
                hourlyBreakdown[hour].revenue += parseFloat(sale.total)
                hourlyBreakdown[hour].sales += sale.saleItems.reduce((sum, item) => sum + item.quantity, 0)
            })

            setHourlyData(hourlyBreakdown.filter(h => h.transactions > 0))

            setStats({
                totalSales,
                totalProfit,
                totalItems,
                transactionCount: sales.length,
                averageOrderValue,
                totalDiscount,
                profitMargin: totalSales > 0 ? ((totalProfit / totalSales) * 100) : 0,
                paymentMethods,
                peakHour: hourlyBreakdown.reduce((max, hour) =>
                    hour.revenue > max.revenue ? hour : max
                )
            })

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const formatTime = (hour) => {
        const period = hour >= 12 ? 'PM' : 'AM'
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
        return `${displayHour}:00 ${period}`
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600"/>
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
                            <ArrowLeft className="h-5 w-5"/>
                        </Link>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                            Today's Sales Analysis
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 ml-14">
                        Detailed breakdown of today's sales performance - {new Date().toLocaleDateString()}
                    </p>
                </div>
                <div className="mt-6 lg:mt-0">
                    <Link
                        href="/sales/new"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl shadow-md shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-200 hover:scale-105"
                    >
                        <Plus className="h-5 w-5 mr-2"/>
                        New Sale
                    </Link>
                </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
                            <Coins className="h-6 w-6 text-green-600"/>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {formatLargeNumber(`KSH ${stats.totalSales?.toFixed(2) || '0.00'}`)}
                            </div>
                            <div className="text-sm text-gray-600">Total Sales</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
                            <ShoppingCart className="h-6 w-6 text-blue-600"/>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.transactionCount}</div>
                            <div className="text-sm text-gray-600">Transactions</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl">
                            <TrendingUp className="h-6 w-6 text-purple-600"/>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {formatLargeNumber(`KSH ${stats.averageOrderValue?.toFixed(2) || '0.00'}`)}
                            </div>
                            <div className="text-sm text-gray-600">Avg. Order Value</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl">
                            <BarChart className="h-6 w-6 text-orange-600"/>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {formatLargeNumber(`KSH ${stats.totalProfit?.toFixed(2) || '0.00'}`)}
                            </div>
                            <div className="text-sm text-gray-600">Total Profit</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Trend Chart */}
            <SalesTrendChart 
                title="Sales Trend (Last 7 Days)"
                className="col-span-full"
                showTotal={true}
                height={250}
            />

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6">
                    <div className="text-center">
                        <div className="p-3 bg-gradient-to-r from-cyan-100 to-cyan-200 rounded-xl w-fit mx-auto mb-4">
                            <ShoppingCart className="h-8 w-8 text-cyan-600"/>
                        </div>
                        <div
                            className="text-3xl font-bold text-gray-900 mb-2">{formatLargeNumber(stats.totalItems)}</div>
                        <div className="text-sm text-gray-600">Items Sold</div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6">
                    <div className="text-center">
                        <div
                            className="p-3 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl w-fit mx-auto mb-4">
                            <TrendingUp className="h-8 w-8 text-indigo-600"/>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.profitMargin?.toFixed(1)}%</div>
                        <div className="text-sm text-gray-600">Profit Margin</div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6">
                    <div className="text-center">
                        <div className="p-3 bg-gradient-to-r from-rose-100 to-rose-200 rounded-xl w-fit mx-auto mb-4">
                            <Clock className="h-8 w-8 text-rose-600"/>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                            {stats.peakHour ? formatTime(stats.peakHour.hour) : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Peak Sales Hour</div>
                    </div>
                </div>
            </div>

            {/* Hourly Breakdown */}
            {hourlyData.length > 0 && (
                <div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                                <Clock className="h-5 w-5 text-white"/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Hourly Sales Breakdown</h3>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4">
                            {hourlyData.map((hour) => (
                                <div key={hour.hour}
                                     className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm font-medium text-gray-600 w-16">
                                            {formatTime(hour.hour)}
                                        </div>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${Math.max(5, (hour.revenue / Math.max(...hourlyData.map(h => h.revenue))) * 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {formatLargeNumber(`KSH ${hour.revenue.toFixed(2)}`)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {hour.transactions} transaction{hour.transactions !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Methods */}
            {Object.keys(stats.paymentMethods || {}).length > 0 && (
                <div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                                <Coins className="h-5 w-5 text-white"/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Payment Methods</h3>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Object.entries(stats.paymentMethods).map(([method, count]) => (
                                <div key={method} className="text-center p-4 bg-gray-50 rounded-xl">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                                    <div className="text-sm text-gray-600">{method}</div>
                                    <div className="text-xs text-gray-500">
                                        {((count / stats.transactionCount) * 100).toFixed(1)}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Transactions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 overflow-hidden">
                <div className="px-6 py-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                                <ShoppingCart className="h-5 w-5 text-white"/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Today's Transactions</h3>
                        </div>
                        <Link
                            href="/sales"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View All Sales
                        </Link>
                    </div>
                </div>

                {salesData.length === 0 ? (
                    <div className="p-12 text-center">
                        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4"/>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No sales today yet</h3>
                        <p className="text-gray-600 mb-4">Start making sales to see them appear here.</p>
                        <Link
                            href="/sales/new"
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                        >
                            <Plus className="h-4 w-4 mr-2"/>
                            Create First Sale
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        <div
                            className="hidden md:grid md:grid-cols-6 gap-4 px-6 py-4 bg-gray-50/50 text-sm font-semibold text-gray-700">
                            <div>Sale #</div>
                            <div>Customer</div>
                            <div className="text-center">Time</div>
                            <div className="text-center">Items</div>
                            <div className="text-center">Total</div>
                            <div className="text-center">Actions</div>
                        </div>

                        {salesData.slice(0, 20).map((sale) => (
                            <div key={sale.id} className="p-6">
                                <div className="md:hidden space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Sale #{sale.id}</h4>
                                            <p className="text-sm text-gray-500">
                                                {sale.customerName || 'Walk-in Customer'}
                                            </p>
                                            <p className="text-sm text-gray-500">{formatDate(sale.createdAt)}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-green-600">
                                                {formatLargeNumber(`KSH ${parseFloat(sale.total).toFixed(2)}`)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {sale.saleItems.reduce((sum, item) => sum + item.quantity, 0)} items
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/sales/${sale.id}`}
                                            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200"
                                        >
                                            <Eye className="h-4 w-4 mr-1"/>
                                            View
                                        </Link>
                                    </div>
                                </div>

                                <div className="hidden md:grid md:grid-cols-6 gap-4 items-center">
                                    <div className="font-semibold text-gray-900">#{sale.id}</div>
                                    <div className="text-gray-600">{sale.customerName || 'Walk-in'}</div>
                                    <div className="text-center text-gray-600">{formatDate(sale.createdAt)}</div>
                                    <div className="text-center">
                    <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {sale.saleItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                                    </div>
                                    <div className="text-center font-semibold text-green-600">
                                        {formatLargeNumber(`KSH ${parseFloat(sale.total).toFixed(2)}`)}
                                    </div>
                                    <div className="text-center">
                                        <Link
                                            href={`/sales/${sale.id}`}
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200"
                                        >
                                            <Eye className="h-4 w-4 mr-1"/>
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}