'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useShop } from '@/contexts/ShopContext'
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Package,
  Coins,
  Hash,
  FileText,
  Tag,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import toast from '@/components/Toast'
import { validateItemForm } from '@/lib/validation'

const categories = [
  'Electronics',
  'Clothing',
  'Food & Beverages',
  'Books',
  'Health & Beauty',
  'Home & Garden',
  'Sports & Outdoors',
  'Toys & Games',
  'Automotive',
  'Other'
]

export default function ItemForm({ itemId }) {
  const router = useRouter()
  const { currentShop } = useShop()
  const isEditing = !!itemId
  
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    sku: '',
    purchasePrice: '',
    sellingPrice: '',
    stockQuantity: '',
    minStockLevel: '5',
    stockAdjustmentReason: ''
  })
  
  const [originalStock, setOriginalStock] = useState(0)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEditing) {
      fetchItem()
    }
  }, [itemId])

  async function fetchItem() {
    try {
      const response = await fetch(`/api/items/${itemId}`)
      if (!response.ok) throw new Error('Failed to fetch item')
      
      const item = await response.json()
      setFormData({
        name: item.name,
        description: item.description || '',
        category: item.category,
        sku: item.sku,
        purchasePrice: item.purchasePrice.toString(),
        sellingPrice: item.sellingPrice.toString(),
        stockQuantity: item.stockQuantity.toString(),
        minStockLevel: item.minStockLevel.toString(),
        stockAdjustmentReason: ''
      })
      setOriginalStock(item.stockQuantity)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function validateForm() {
    const validation = validateItemForm(formData)
    
    // Add additional validation for stock adjustment reason if editing
    if (isEditing && parseInt(formData.stockQuantity) !== originalStock && !formData.stockAdjustmentReason.trim()) {
      validation.errors.stockAdjustmentReason = 'Stock adjustment reason is required when changing stock quantity'
      validation.isValid = false
    }
    
    setErrors(validation.errors)
    return validation.isValid
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setSaving(true)
    setError(null)
    
    try {
      const url = isEditing ? `/api/items/${itemId}` : '/api/items'
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          shopId: currentShop.id
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save item')
      }
      
      setSuccess(true)
      toast.success(`Item ${isEditing ? 'updated' : 'created'} successfully!`)
      setTimeout(() => {
        router.push('/inventory')
      }, 1500)
      
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return
    }
    
    setDeleting(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete item')
      }
      
      toast.success('Item deleted successfully')
      router.push('/inventory')
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
      setDeleting(false)
    }
  }

  function handleInputChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
    setSuccess(false)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-8"></div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-12 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const stockChanged = isEditing && parseInt(formData.stockQuantity) !== originalStock
  const profitMargin = formData.purchasePrice && formData.sellingPrice ? 
    (((parseFloat(formData.sellingPrice) - parseFloat(formData.purchasePrice)) / parseFloat(formData.sellingPrice)) * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Link 
              href="/inventory"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              {isEditing ? 'Edit Item' : 'Add New Item'}
            </h1>
          </div>
          <p className="text-lg text-gray-600 ml-14">
            {isEditing ? 'Update item information and manage stock levels' : 'Add a new product to your inventory'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-green-800">Success!</h3>
              <p className="mt-1 text-sm text-green-700">
                Item {isEditing ? 'updated' : 'created'} successfully. Redirecting...
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Product Information</h3>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Enter product name"
                  />
                  <Package className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    placeholder="Enter product description (optional)"
                  />
                  <FileText className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.category ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <Tag className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  SKU {!isEditing && <span className="text-xs text-gray-500">(auto-generated if empty)</span>}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono"
                    placeholder={isEditing ? formData.sku : "Auto-generated"}
                    disabled={isEditing}
                  />
                  <Hash className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                  <Coins className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Pricing & Stock</h3>
              </div>
              {profitMargin > 0 && (
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {profitMargin}% Profit Margin
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Purchase Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">KSH</span>
                  <input
                    type="number"
                    step="5"
                    min="0"
                    value={formData.purchasePrice}
                    onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.purchasePrice ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.purchasePrice && <p className="mt-1 text-sm text-red-600">{errors.purchasePrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Selling Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">KSH</span>
                  <input
                    type="number"
                    step="5"
                    min="0"
                    value={formData.sellingPrice}
                    onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.sellingPrice ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.sellingPrice && <p className="mt-1 text-sm text-red-600">{errors.sellingPrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stock Quantity *
                  {isEditing && stockChanged && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Changed from {originalStock}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.stockQuantity ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="0"
                  />
                  <Package className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                {errors.stockQuantity && <p className="mt-1 text-sm text-red-600">{errors.stockQuantity}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum Stock Level *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={formData.minStockLevel}
                    onChange={(e) => handleInputChange('minStockLevel', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.minStockLevel ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="5"
                  />
                  <AlertTriangle className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                {errors.minStockLevel && <p className="mt-1 text-sm text-red-600">{errors.minStockLevel}</p>}
              </div>

              {isEditing && stockChanged && (
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock Adjustment Reason *
                  </label>
                  <input
                    type="text"
                    value={formData.stockAdjustmentReason}
                    onChange={(e) => handleInputChange('stockAdjustmentReason', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.stockAdjustmentReason ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="e.g., Inventory recount, Product return, Damaged goods, etc."
                  />
                  {errors.stockAdjustmentReason && <p className="mt-1 text-sm text-red-600">{errors.stockAdjustmentReason}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || saving}
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-xl shadow-lg hover:bg-red-700 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-5 w-5 mr-2" />
                    Delete Item
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className="flex space-x-4">
            <Link
              href="/inventory"
              className="px-6 py-3 text-gray-700 bg-gray-100 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || success}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  {isEditing ? 'Update Item' : 'Create Item'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}