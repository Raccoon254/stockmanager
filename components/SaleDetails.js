'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  CreditCard, 
  Package, 
  Receipt,
  AlertTriangle,
  Loader2
} from 'lucide-react'

export default function SaleDetails({ saleId }) {
  const [sale, setSale] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSale()
  }, [saleId])

  async function fetchSale() {
    try {
      const response = await fetch(`/api/sales/${saleId}`)
      if (!response.ok) throw new Error('Failed to fetch sale details')
      
      const data = await response.json()
      setSale(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
            href="/sales"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            Sale Details
          </h1>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-red-800">Error loading sale</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!sale) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link 
            href="/sales"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            Sale Not Found
          </h1>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Link 
              href="/sales"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              Sale #{sale.id}
            </h1>
          </div>
          <p className="text-lg text-gray-600 ml-14">
            Sale completed on {formatDate(sale.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sale Information */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer & Payment Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="px-6 py-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Sale Information</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">
                      {sale.customerName || 'Walk-in Customer'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{sale.paymentMethod}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sale Date
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{formatDate(sale.createdAt)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Items Count
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <Package className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{sale.saleItems.length} items</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Sold */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="px-6 py-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Items Sold</h3>
              </div>
            </div>
            
            <div className="overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="hidden md:grid md:grid-cols-5 gap-4 px-6 py-4 bg-gray-50/50 text-sm font-semibold text-gray-700">
                  <div className="col-span-2">Product</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-center">Unit Price</div>
                  <div className="text-center">Subtotal</div>
                </div>
                
                {sale.saleItems.map((saleItem) => (
                  <div key={saleItem.id} className="p-6">
                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{saleItem.item.name}</h4>
                          <p className="text-sm text-gray-500">SKU: {saleItem.item.sku}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            KSH {parseFloat(saleItem.subtotal).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{saleItem.quantity}</div>
                          <div className="text-xs text-gray-500">Quantity</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">
                            KSH {parseFloat(saleItem.unitPrice).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">Unit Price</div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid md:grid-cols-5 gap-4 items-center">
                      <div className="col-span-2">
                        <h4 className="font-semibold text-gray-900">{saleItem.item.name}</h4>
                        <p className="text-sm text-gray-500">SKU: {saleItem.item.sku}</p>
                      </div>
                      <div className="text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {saleItem.quantity}
                        </span>
                      </div>
                      <div className="text-center font-semibold text-green-600">
                        KSH {parseFloat(saleItem.unitPrice).toFixed(2)}
                      </div>
                      <div className="text-center font-bold text-gray-900">
                        KSH {parseFloat(saleItem.subtotal).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sale Summary */}
        <div className="space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="px-6 py-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                  <Receipt className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Sale Summary</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>KSH {parseFloat(sale.subtotal).toFixed(2)}</span>
                </div>
                
                {sale.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-KSH {parseFloat(sale.discount).toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-2xl font-bold text-gray-900">
                    <span>Total:</span>
                    <span className="text-green-600">KSH {parseFloat(sale.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <Receipt className="h-4 w-4 mr-2" />
                    Sale Completed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="p-6">
              <div className="space-y-3">
                <Link
                  href="/sales"
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sales
                </Link>
                
                <Link
                  href="/sales/new"
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Package className="h-4 w-4 mr-2" />
                  New Sale
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}