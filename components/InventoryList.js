'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useShop } from '@/contexts/ShopContext'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
    Package
} from 'lucide-react'
import {formatLargeNumber} from "@/lib/formatter";
import CategorySelector from '@/components/CategorySelector'

export default function InventoryList() {
  const { currentShop } = useShop()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})


  useEffect(() => {
    if (currentShop) {
      fetchItems()
    }
  }, [currentShop, search, category, sortBy, sortOrder, page])

  async function fetchItems() {
    if (!currentShop) return
    
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        shopId: currentShop.id,
        ...(search && { search }),
        ...(category && { category }),
        sortBy,
        sortOrder,
      })

      const response = await fetch(`/api/items?${params}`)
      if (!response.ok) throw new Error('Failed to fetch items')
      
      const data = await response.json()
      setItems(data.items)
      setPagination(data.pagination)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }


  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const isLowStock = (item) => {
    return item.stockQuantity <= item.minStockLevel
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-red-800">Error loading inventory</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <p className="mt-2 text-lg text-gray-600">Track and manage your store's product inventory
          </p>
        </div>
        <div className="mt-6 lg:mt-0">
          <Link
            href="/inventory/new"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Item
          </Link>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-4 top-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items by name or SKU..."
                  value={search}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-64">
                <CategorySelector
                  value={category}
                  onChange={(value) => {
                    setCategory(value === "All Categories" ? "" : value)
                    setPage(1)
                  }}
                  placeholder="All Categories"
                  allowCustom={false}
                  showDescription={false}
                  className="text-sm"
                  includeAllOption={true}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-6 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-5 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first inventory item.</p>
              <Link
                href="/inventory/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add First Item
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <div className="hidden lg:grid lg:grid-cols-7 gap-6 px-6 py-4 bg-gray-50/50 text-sm font-semibold text-gray-700">
                <button
                  onClick={() => handleSort('name')}
                  className="text-left hover:text-blue-600 transition-colors duration-200 flex items-center"
                >
                  Product Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <div>SKU</div>
                <div>Category</div>
                <button
                  onClick={() => handleSort('stockQuantity')}
                  className="hover:text-blue-600 transition-colors duration-200 flex items-center"
                >
                  Stock {sortBy === 'stockQuantity' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('sellingPrice')}
                  className="hover:text-blue-600 transition-colors duration-200 flex items-center"
                >
                  Price {sortBy === 'sellingPrice' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <div>Profit Margin</div>
                <div className="text-center">Actions</div>
              </div>
              
              {items.map((item) => {
                const profitMargin = ((parseFloat(item.sellingPrice) - parseFloat(item.purchasePrice)) / parseFloat(item.sellingPrice) * 100).toFixed(1)
                
                return (
                  <div 
                    key={item.id} 
                    className={`p-6 hover:bg-gray-50/50 transition-all duration-200 ${
                      isLowStock(item) ? 'bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-400' : ''
                    }`}
                  >
                    {/* Mobile Layout */}
                    <div className="lg:hidden space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                            {isLowStock(item) && (
                              <div className="ml-2 p-1 bg-red-100 rounded-full">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              </div>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                          )}
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {item.category}
                            </span>
                            <span className="text-xs text-gray-500">SKU: {item.sku}</span>
                          </div>
                        </div>
                        <Link
                          href={`/inventory/${item.id}`}
                          className="ml-4 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${isLowStock(item) ? 'text-red-600' : 'text-gray-900'}`}>
                            {item.stockQuantity}
                          </div>
                          <div className="text-xs text-gray-500">Stock</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            ${parseFloat(item.sellingPrice).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">Price</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">
                            {profitMargin}%
                          </div>
                          <div className="text-xs text-gray-500">Profit</div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:grid lg:grid-cols-7 gap-6 items-center">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            {isLowStock(item) && (
                              <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-500 truncate max-w-xs">{item.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm font-mono text-gray-600">{item.sku}</div>
                      
                      <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className={`text-sm font-semibold ${
                          isLowStock(item) ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {item.stockQuantity}
                        </span>
                        {isLowStock(item) && (
                          <span className="ml-2 text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full">
                            Low Stock
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm font-semibold text-green-600">
                        {formatLargeNumber(`KSH ${parseFloat(item.sellingPrice).toFixed(2)}`)}
                      </div>
                      
                      <div className="text-sm font-semibold text-purple-600">
                        {profitMargin}%
                      </div>
                      
                      <div className="text-center">
                        <Link
                          href={`/inventory/${item.id}`}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-600">
                  Showing{' '}
                  <span className="font-semibold text-gray-900">
                    {((page - 1) * 10) + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold text-gray-900">
                    {Math.min(page * 10, pagination.total)}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-gray-900">{pagination.total}</span>{' '}
                  results
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                
                <div className="hidden sm:flex items-center space-x-1">
                  {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                    let pageNum
                    if (pagination.pages <= 5) {
                      pageNum = i + 1
                    } else if (page <= 3) {
                      pageNum = i + 1
                    } else if (page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i
                    } else {
                      pageNum = page - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          page === pageNum
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                            : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= pagination.pages}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 transition-all duration-200"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}