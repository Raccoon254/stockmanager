'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useShop } from '@/contexts/ShopContext'
import { 
  Plus, 
  Search, 
  Calendar, 
  Eye, 
  ShoppingCart,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react'
import {formatLargeNumber} from "@/lib/formatter";

export default function SalesHistory() {
  const { currentShop } = useShop()
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    if (currentShop) {
      fetchSales()
    }
  }, [currentShop, search, startDate, endDate, page])

  async function fetchSales() {
    if (!currentShop) return
    
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        shopId: currentShop.id,
        ...(search && { search }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      })

      const response = await fetch(`/api/sales?${params}`)
      if (!response.ok) throw new Error('Failed to fetch sales')
      
      const data = await response.json()
      setSales(data.sales)
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

  const handleDateFilter = (start, end) => {
    setStartDate(start)
    setEndDate(end)
    setPage(1)
  }

  const clearDateFilter = () => {
    setStartDate('')
    setEndDate('')
    setPage(1)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-red-800">Error loading sales</h3>
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
            Sales History
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            View and manage all your sales transactions
          </p>
        </div>
        <div className="mt-6 lg:mt-0">
          <Link
            href="/sales/new"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Sale
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
                  placeholder="Search by customer name..."
                  value={search}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDateFilter(e.target.value, endDate)}
                  className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 focus:outline-none"
                />
                <span className="mx-2 text-gray-400">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleDateFilter(startDate, e.target.value)}
                  className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 focus:outline-none"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={clearDateFilter}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
                >
                  Clear
                </button>
              )}
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
          ) : sales.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No sales found</h3>
              <p className="text-gray-500 mb-6">Start recording your first sale to see it here.</p>
              <Link
                href="/sales/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Record First Sale
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <div className="hidden lg:grid lg:grid-cols-6 gap-6 px-6 py-4 bg-gray-50/50 text-sm font-semibold text-gray-700">
                <div>Sale ID</div>
                <div>Customer</div>
                <div>Items</div>
                <div>Payment</div>
                <div>Total</div>
                <div className="text-center">Actions</div>
              </div>
              
              {sales.map((sale) => (
                <div key={sale.id} className="p-6 hover:bg-gray-50/50 transition-all duration-200">
                  {/* Mobile Layout */}
                  <div className="lg:hidden space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            Sale #{sale.id}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatDate(sale.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <User className="h-4 w-4 inline mr-1" />
                          {sale.customerName || 'Walk-in Customer'}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{sale.saleItems.length} items</span>
                          <span>•</span>
                          <span>{sale.paymentMethod}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600 mb-2">
                          {formatLargeNumber(`KSH ${parseFloat(sale.total).toFixed(2)}`)}
                        </div>
                        <Link
                          href={`/sales/${sale.id}`}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Link>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">Items sold:</p>
                      <div className="flex flex-wrap gap-2">
                        {sale.saleItems.slice(0, 3).map((item, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item.item.name} (×{item.quantity})
                          </span>
                        ))}
                        {sale.saleItems.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                            +{sale.saleItems.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:grid lg:grid-cols-6 gap-6 items-center">
                    <div>
                      <div className="font-semibold text-gray-900">#{sale.id}</div>
                      <div className="text-sm text-gray-500">{formatDate(sale.createdAt)}</div>
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {sale.customerName || 'Walk-in Customer'}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {sale.saleItems.length} items
                      </div>
                      <div className="text-xs text-gray-500">
                        {sale.saleItems.slice(0, 2).map(item => item.item.name).join(', ')}
                        {sale.saleItems.length > 2 && ` +${sale.saleItems.length - 2} more`}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{sale.paymentMethod}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {formatLargeNumber(`KSH ${parseFloat(sale.total).toFixed(2)}`)}
                      </div>
                      {sale.discount > 0 && (
                        <div className="text-xs text-gray-500">
                          [{formatLargeNumber(`KSH ${parseFloat(sale.discount).toFixed(2)}`)} discount]
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <Link
                        href={`/sales/${sale.id}`}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
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
                  sales
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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