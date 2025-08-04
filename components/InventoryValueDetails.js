'use client'

import {useState, useEffect} from 'react'
import Link from 'next/link'
import {useShop} from '@/contexts/ShopContext'
import {
    ArrowLeft,
    Package,
    TrendingUp,
    DollarSign,
    BarChart3,
    Loader2,
    PieChart,
    Eye,
    Calculator, Coins, Eclipse
} from 'lucide-react'
import {formatLargeNumber} from '@/lib/formatter'

export default function InventoryValueDetails() {
    const {currentShop} = useShop()
    const [inventoryData, setInventoryData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [stats, setStats] = useState({})
    const [categoryData, setCategoryData] = useState([])
    const [sortBy, setSortBy] = useState('sellingPrice')
    const [sortOrder, setSortOrder] = useState('desc')

    useEffect(() => {
        if (currentShop) {
            fetchInventoryData()
        }
    }, [currentShop, sortBy, sortOrder])

    async function fetchInventoryData() {
        try {
            setLoading(true)

            const response = await fetch(`/api/items?shopId=${currentShop.id}&limit=1000&sortBy=${sortBy}&sortOrder=${sortOrder}`)
            if (!response.ok) throw new Error('Failed to fetch inventory data')

            const data = await response.json()
            const items = data.items || []
            setInventoryData(items)

            // Calculate comprehensive stats and sort by value if needed
            let processedItems = items.map(item => ({
                ...item,
                calculatedValue: item.stockQuantity * parseFloat(item.sellingPrice)
            }))

            // Sort by calculated value if that's what was requested
            if (sortBy === 'value') {
                processedItems = processedItems.sort((a, b) => {
                    return sortOrder === 'desc' ? b.calculatedValue - a.calculatedValue : a.calculatedValue - b.calculatedValue
                })
            }

            setInventoryData(processedItems)

            const totalValue = processedItems.reduce((sum, item) =>
                sum + (item.stockQuantity * parseFloat(item.sellingPrice)), 0
            )
            const totalCost = processedItems.reduce((sum, item) =>
                sum + (item.stockQuantity * parseFloat(item.purchasePrice)), 0
            )
            const totalItems = processedItems.reduce((sum, item) => sum + item.stockQuantity, 0)
            const potentialProfit = totalValue - totalCost
            const profitMargin = totalValue > 0 ? ((potentialProfit / totalValue) * 100) : 0

            // Group by category
            const categoryGroups = processedItems.reduce((acc, item) => {
                if (!acc[item.category]) {
                    acc[item.category] = {
                        category: item.category,
                        items: 0,
                        totalQuantity: 0,
                        totalValue: 0,
                        totalCost: 0
                    }
                }
                acc[item.category].items += 1
                acc[item.category].totalQuantity += item.stockQuantity
                acc[item.category].totalValue += item.stockQuantity * parseFloat(item.sellingPrice)
                acc[item.category].totalCost += item.stockQuantity * parseFloat(item.purchasePrice)
                return acc
            }, {})

            const categoryArray = Object.values(categoryGroups).sort((a, b) => b.totalValue - a.totalValue)
            setCategoryData(categoryArray)

            setStats({
                totalValue,
                totalCost,
                totalItems,
                uniqueProducts: processedItems.length,
                potentialProfit,
                profitMargin,
                averageItemValue: totalItems > 0 ? totalValue / totalItems : 0,
                topCategory: categoryArray[0]?.category || 'N/A',
                lowStockItems: processedItems.filter(item => item.stockQuantity <= item.minStockLevel).length
            })

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(field)
            setSortOrder('desc')
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

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center space-x-4 mb-2">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                            Inventory Value Analysis
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600">
                        Comprehensive breakdown of your inventory value and potential
                    </p>
                </div>
                <div className="mt-6 lg:mt-0">
                    <Link
                        href="/inventory"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-md shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 hover:scale-105"
                    >
                        <Package className="h-5 w-5 mr-2"/>
                        Manage Inventory
                    </Link>
                </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-4 md:p-6">
                    <div className="flex md:items-center space-x-2 flex-col md:flex-row md:space-x-4">
                        <div className="p-3 aspect-square h-12 w-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
                            <Package className="h-6 w-6 text-blue-600"/>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {formatLargeNumber(`KSH ${stats.totalValue?.toFixed(2) || '0.00'}`)}
                            </div>
                            <div className="text-sm text-gray-600">Total Inventory Value</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-4 md:p-6">
                    <div className="flex md:items-center space-x-2 flex-col md:flex-row md:space-x-4">
                        <div className="p-3 aspect-square h-12 w-12 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
                            <TrendingUp className="h-6 w-6 text-green-600"/>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {formatLargeNumber(`KSH ${stats.potentialProfit?.toFixed(2) || '0.00'}`)}
                            </div>
                            <div className="text-sm text-gray-600">Potential Profit</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-4 md:p-6">
                    <div className="flex md:items-center space-x-2 flex-col md:flex-row md:space-x-4">
                        <div className="p-3 aspect-square h-12 w-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl">
                            <Eclipse className="h-6 w-6 text-purple-600"/>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.uniqueProducts}</div>
                            <div className="text-sm text-gray-600">Unique Products</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-4 md:p-6">
                    <div className="flex md:items-center space-x-2 flex-col md:flex-row md:space-x-4">
                        <div className="p-3 aspect-square h-12 w-12 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl">
                            <Calculator className="h-6 w-6 text-orange-600"/>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.profitMargin?.toFixed(1)}%</div>
                            <div className="text-sm text-gray-600">Profit Margin</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6">
                    <div className="text-center">
                        <div className="p-3 bg-gradient-to-r from-cyan-100 to-cyan-200 rounded-xl w-fit mx-auto mb-4">
                            <Package className="h-8 w-8 text-cyan-600"/>
                        </div>
                        <div
                            className="text-3xl font-bold text-gray-900 mb-2">{formatLargeNumber(stats.totalItems)}</div>
                        <div className="text-sm text-gray-600">Total Items in Stock</div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6">
                    <div className="text-center">
                        <div
                            className="p-3 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl w-fit mx-auto mb-4">
                            <Coins className="h-8 w-8 text-indigo-600"/>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                            {formatLargeNumber(`KSH ${stats.averageItemValue?.toFixed(2) || '0.00'}`)}
                        </div>
                        <div className="text-sm text-gray-600">Average Item Value</div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6">
                    <div className="text-center">
                        <div className="p-3 bg-gradient-to-r from-rose-100 to-rose-200 rounded-xl w-fit mx-auto mb-4">
                            <PieChart className="h-8 w-8 text-rose-600"/>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">{stats.topCategory}</div>
                        <div className="text-sm text-gray-600">Top Category by Value</div>
                    </div>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 overflow-hidden">
                <div className="px-6 py-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                            <PieChart className="h-5 w-5 text-white"/>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Value by Category</h3>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    <div
                        className="hidden md:grid md:grid-cols-6 gap-4 px-6 py-4 bg-gray-50/50 text-sm font-semibold text-gray-700">
                        <div>Category</div>
                        <div className="text-center">Products</div>
                        <div className="text-center">Total Quantity</div>
                        <div className="text-center">Total Value</div>
                        <div className="text-center">Total Cost</div>
                        <div className="text-center">Profit</div>
                    </div>

                    {categoryData.map((category) => {
                        const profit = category.totalValue - category.totalCost
                        const profitMargin = category.totalValue > 0 ? ((profit / category.totalValue) * 100) : 0

                        return (
                            <div key={category.category} className="p-6">
                                <div className="md:hidden space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-gray-900">{category.category}</h4>
                                        <span className="text-lg font-bold text-green-600">
                      {formatLargeNumber(`KSH ${category.totalValue.toFixed(2)}`)}
                    </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Products: </span>
                                            <span className="font-medium">{category.items}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Quantity: </span>
                                            <span className="font-medium">{category.totalQuantity}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Cost: </span>
                                            <span className="font-medium">KSH {category.totalCost.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Profit: </span>
                                            <span
                                                className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        KSH {profit.toFixed(2)} ({profitMargin.toFixed(1)}%)
                      </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden md:grid md:grid-cols-6 gap-4 items-center">
                                    <div className="font-semibold text-gray-900">{category.category}</div>
                                    <div className="text-center">{category.items}</div>
                                    <div className="text-center font-medium">{category.totalQuantity}</div>
                                    <div className="text-center font-semibold text-green-600">
                                        {formatLargeNumber(`KSH ${category.totalValue.toFixed(2)}`)}
                                    </div>
                                    <div className="text-center text-gray-600">
                                        KSH {category.totalCost.toFixed(2)}
                                    </div>
                                    <div className="text-center">
                                        <div
                                            className={`font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            KSH {profit.toFixed(2)}
                                        </div>
                                        <div className="text-xs text-gray-500">{profitMargin.toFixed(1)}% margin</div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Top Value Items */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 overflow-hidden">
                <div className="px-6 py-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                                <TrendingUp className="h-5 w-5 text-white"/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Top Items by Value</h3>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleSort('value')}
                                className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
                                    sortBy === 'value' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Value {sortBy === 'value' && (sortOrder === 'desc' ? '↓' : '↑')}
                            </button>
                            <button
                                onClick={() => handleSort('stockQuantity')}
                                className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
                                    sortBy === 'stockQuantity' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Quantity {sortBy === 'stockQuantity' && (sortOrder === 'desc' ? '↓' : '↑')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {inventoryData.slice(0, 10).map((item, index) => {
                        const itemValue = item.stockQuantity * parseFloat(item.sellingPrice)
                        const itemCost = item.stockQuantity * parseFloat(item.purchasePrice)
                        const itemProfit = itemValue - itemCost

                        return (
                            <div key={item.id} className="p-6">
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
                                                {item.stockQuantity} units •
                                                KSH {parseFloat(item.sellingPrice).toFixed(2)} each
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-green-600">
                                            {formatLargeNumber(`KSH ${itemValue.toFixed(2)}`)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Profit: KSH {itemProfit.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}