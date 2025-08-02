'use client'

import {useState, useEffect} from 'react'
import Link from 'next/link'
import {useShop} from '@/contexts/ShopContext'
import {
    ArrowLeft,
    TrendingUp,
    Coins,
    BarChart,
    Loader2,
    PieChart,
    Eye,
    Calculator,
    Calendar,
    Clock,
    Target,
    Plus,
    Filter
} from 'lucide-react'
import {formatLargeNumber} from '@/lib/formatter'
import DateRangeSelector from '@/components/DateRangeSelector'

export default function ProfitAnalysisDetails() {
    const {currentShop} = useShop()
    const [profitData, setProfitData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [timeframe, setTimeframe] = useState('today')

    useEffect(() => {
        if (currentShop) {
            fetchProfitData()
        }
    }, [currentShop, timeframe])

    async function fetchProfitData() {
        try {
            setLoading(true)

            const response = await fetch(`/api/profit-analysis?shopId=${currentShop.id}&timeframe=${timeframe}`)
            if (!response.ok) throw new Error('Failed to fetch profit analysis data')

            const data = await response.json()
            setProfitData(data)

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
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }

    const getTimeframeLabel = (tf) => {
        switch (tf) {
            case 'today':
                return "Today's"
            case 'yesterday':
                return "Yesterday's"
            case 'last7days':
                return "Last 7 Days'"
            case 'last30days':
                return "Last 30 Days'"
            case 'thisMonth':
                return "This Month's"
            case 'lastMonth':
                return "Last Month's"
            case 'allTime':
                return "All Time"
            default:
                return "Today's"
        }
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

    if (error) {
        return (
            <div className="space-y-8">
                <div className="text-center py-16">
                    <p className="text-red-600">Error: {error}</p>
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
                            {getTimeframeLabel(timeframe)} Profit Analysis
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 ml-14">
                        Comprehensive breakdown of your profit performance and trends
                    </p>
                </div>
                <div className="mt-6 lg:mt-0 flex items-center space-x-4">
                    <DateRangeSelector
                        value={timeframe}
                        onChange={setTimeframe}
                    />
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
                            <TrendingUp className="h-6 w-6 text-green-600"/>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {formatLargeNumber(`KSH ${profitData?.summary?.totalProfit?.toFixed(2) || '0.00'}`)}
                            </div>
                            <div className="text-sm text-gray-600">Total Profit</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
                            <Coins className="h-6 w-6 text-blue-600"/>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {formatLargeNumber(`KSH ${profitData?.summary?.totalRevenue?.toFixed(2) || '0.00'}`)}
                            </div>
                            <div className="text-sm text-gray-600">Total Revenue</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl">
                            <Target className="h-6 w-6 text-purple-600"/>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {profitData?.summary?.profitMargin?.toFixed(1) || '0.0'}%
                            </div>
                            <div className="text-sm text-gray-600">Profit Margin</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl">
                            <Calculator className="h-6 w-6 text-orange-600"/>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {formatLargeNumber(`KSH ${profitData?.summary?.averageOrderProfit?.toFixed(2) || '0.00'}`)}
                            </div>
                            <div className="text-sm text-gray-600">Avg. Order Profit</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6">
                    <div className="text-center">
                        <div className="p-3 bg-gradient-to-r from-cyan-100 to-cyan-200 rounded-xl w-fit mx-auto mb-4">
                            <BarChart className="h-8 w-8 text-cyan-600"/>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                            {formatLargeNumber(`KSH ${profitData?.summary?.totalCost?.toFixed(2) || '0.00'}`)}
                        </div>
                        <div className="text-sm text-gray-600">Total Cost</div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6">
                    <div className="text-center">
                        <div
                            className="p-3 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl w-fit mx-auto mb-4">
                            <Calculator className="h-8 w-8 text-indigo-600"/>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                            {profitData?.summary?.costRatio?.toFixed(1) || '0.0'}%
                        </div>
                        <div className="text-sm text-gray-600">Cost Ratio</div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6">
                    <div className="text-center">
                        <div className="p-3 bg-gradient-to-r from-rose-100 to-rose-200 rounded-xl w-fit mx-auto mb-4">
                            <Clock className="h-8 w-8 text-rose-600"/>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                            {profitData?.trends?.peakHour ? formatTime(profitData.trends.peakHour.hour) : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Peak Profit Hour</div>
                    </div>
                </div>
            </div>

            {/* Profit Trends */}
            {profitData?.trends?.daily?.length > 0 && (
                <div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                                <Calendar className="h-5 w-5 text-white"/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Daily Profit Trend</h3>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4">
                            {profitData.trends.daily.map((day) => (
                                <div key={day.date}
                                     className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm font-medium text-gray-600 w-20">
                                            {formatDate(day.date)}
                                        </div>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                                            <div
                                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${Math.max(5, (day.profit / Math.max(...profitData.trends.daily.map(d => d.profit))) * 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {formatLargeNumber(`KSH ${day.profit.toFixed(2)}`)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {day.transactions} transaction{day.transactions !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Hourly Breakdown */}
            {profitData?.trends?.hourly?.length > 0 && (
                <div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                                <Clock className="h-5 w-5 text-white"/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Hourly Profit Breakdown</h3>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4">
                            {profitData.trends.hourly.map((hour) => (
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
                                                    width: `${Math.max(5, (hour.profit / Math.max(...profitData.trends.hourly.map(h => h.profit))) * 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {formatLargeNumber(`KSH ${hour.profit.toFixed(2)}`)}
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

            {/* Category Breakdown */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 overflow-hidden">
                <div className="px-6 py-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                            <PieChart className="h-5 w-5 text-white"/>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Profit by Category</h3>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    <div
                        className="hidden md:grid md:grid-cols-6 gap-4 px-6 py-4 bg-gray-50/50 text-sm font-semibold text-gray-700">
                        <div>Category</div>
                        <div className="text-center">Revenue</div>
                        <div className="text-center">Cost</div>
                        <div className="text-center">Profit</div>
                        <div className="text-center">Margin</div>
                        <div className="text-center">Items Sold</div>
                    </div>

                    {profitData?.breakdown?.categories?.map((category) => (
                        <div key={category.category} className="p-6">
                            <div className="md:hidden space-y-3">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-gray-900">{category.category}</h4>
                                    <span className="text-lg font-bold text-green-600">
                    {formatLargeNumber(`KSH ${category.profit.toFixed(2)}`)}
                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Revenue: </span>
                                        <span className="font-medium">KSH {category.revenue.toFixed(2)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Cost: </span>
                                        <span className="font-medium">KSH {category.cost.toFixed(2)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Margin: </span>
                                        <span className="font-medium">{category.margin.toFixed(1)}%</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Items: </span>
                                        <span className="font-medium">{category.items}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:grid md:grid-cols-6 gap-4 items-center">
                                <div className="font-semibold text-gray-900">{category.category}</div>
                                <div className="text-center">KSH {category.revenue.toFixed(2)}</div>
                                <div className="text-center text-gray-600">KSH {category.cost.toFixed(2)}</div>
                                <div className="text-center font-semibold text-green-600">
                                    {formatLargeNumber(`KSH ${category.profit.toFixed(2)}`)}
                                </div>
                                <div className="text-center">
                  <span className={`font-semibold ${category.margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {category.margin.toFixed(1)}%
                  </span>
                                </div>
                                <div className="text-center">{category.items}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Profitable Items */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 overflow-hidden">
                <div className="px-6 py-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                            <TrendingUp className="h-5 w-5 text-white"/>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Top Profitable Items</h3>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {profitData?.breakdown?.items?.map((item, index) => (
                        <div key={item.itemId} className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
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
                                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                        <p className="text-sm text-gray-500">
                                            {item.quantitySold} units • {item.margin.toFixed(1)}% margin
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-green-600">
                                        {formatLargeNumber(`KSH ${item.profit.toFixed(2)}`)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Revenue: KSH {item.revenue.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Profitable Sales */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 overflow-hidden">
                <div className="px-6 py-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                                <BarChart className="h-5 w-5 text-white"/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Recent Sales Performance</h3>
                        </div>
                        <Link
                            href="/sales"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View All Sales
                        </Link>
                    </div>
                </div>

                {profitData?.recentSales?.length === 0 ? (
                    <div className="p-12 text-center">
                        <BarChart className="h-16 w-16 text-gray-300 mx-auto mb-4"/>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No sales data available</h3>
                        <p className="text-gray-600 mb-4">Start making sales to see profit analysis here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        <div
                            className="hidden md:grid md:grid-cols-6 gap-4 px-6 py-4 bg-gray-50/50 text-sm font-semibold text-gray-700">
                            <div>Sale #</div>
                            <div>Customer</div>
                            <div className="text-center">Revenue</div>
                            <div className="text-center">Profit</div>
                            <div className="text-center">Margin</div>
                            <div className="text-center">Actions</div>
                        </div>

                        {profitData?.recentSales?.slice(0, 10).map((sale) => (
                            <div key={sale.id} className="p-6">
                                <div className="md:hidden space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Sale #{sale.id}</h4>
                                            <p className="text-sm text-gray-500">
                                                {sale.customerName || 'Walk-in Customer'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-green-600">
                                                {formatLargeNumber(`KSH ${sale.profit.toFixed(2)}`)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {sale.margin.toFixed(1)}% margin
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden md:grid md:grid-cols-6 gap-4 items-center">
                                    <div className="font-semibold text-gray-900">#{sale.id}</div>
                                    <div className="text-gray-600">{sale.customerName || 'Walk-in'}</div>
                                    <div className="text-center">KSH {sale.total.toFixed(2)}</div>
                                    <div className="text-center font-semibold text-green-600">
                                        {formatLargeNumber(`KSH ${sale.profit.toFixed(2)}`)}
                                    </div>
                                    <div className="text-center">
                    <span className={`font-semibold ${sale.margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {sale.margin.toFixed(1)}%
                    </span>
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