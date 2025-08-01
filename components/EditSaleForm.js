'use client'

import {useState, useEffect} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import { useShop } from '@/contexts/ShopContext'
import {
    ArrowLeft,
    Plus,
    Minus,
    Trash2,
    ShoppingCart,
    User,
    CreditCard,
    Search,
    Package,
    AlertTriangle,
    Loader2,
    CheckCircle
} from 'lucide-react'
import toast from '@/components/Toast'
import {validateSaleForm} from '@/lib/validation'

const paymentMethods = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'Digital Wallet',
    'Check'
]

export default function EditSaleForm({ saleId }) {
    const router = useRouter()
    const { currentShop } = useShop()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const [items, setItems] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [showSearch, setShowSearch] = useState(false)

    const [saleData, setSaleData] = useState({
        customerName: '',
        paymentMethod: 'Cash',
        items: [],
        discount: 0
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (saleId && currentShop) {
            fetchSaleData()
        }
    }, [saleId, currentShop])

    useEffect(() => {
        if (searchTerm.length >= 2) {
            searchItems()
        } else {
            setSearchResults([])
            setShowSearch(false)
        }
    }, [searchTerm])

    async function fetchSaleData() {
        try {
            setLoading(true)
            const response = await fetch(`/api/sales/${saleId}`)
            if (!response.ok) throw new Error('Failed to fetch sale data')

            const sale = await response.json()
            
            // Transform sale data to match form structure
            setSaleData({
                customerName: sale.customerName || '',
                paymentMethod: sale.paymentMethod,
                discount: sale.discount,
                items: sale.saleItems.map(saleItem => ({
                    itemId: saleItem.itemId,
                    name: saleItem.item.name,
                    sku: saleItem.item.sku,
                    unitPrice: parseFloat(saleItem.unitPrice),
                    quantity: saleItem.quantity,
                    maxQuantity: saleItem.item.stockQuantity + saleItem.quantity, // Current stock + what was sold
                    subtotal: parseFloat(saleItem.subtotal)
                }))
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function searchItems() {
        if (!currentShop) return
        
        try {
            const params = new URLSearchParams({
                search: searchTerm,
                limit: '10',
                shopId: currentShop.id
            })
            
            const response = await fetch(`/api/items?${params}`)
            if (!response.ok) throw new Error('Failed to search items')

            const data = await response.json()
            setSearchResults(data.items.filter(item =>
                !saleData.items.find(saleItem => saleItem.itemId === item.id)
            ))
            setShowSearch(true)
        } catch (err) {
            console.error('Search error:', err)
        }
    }

    function addItemToSale(item) {
        const existingItemIndex = saleData.items.findIndex(saleItem => saleItem.itemId === item.id)

        if (existingItemIndex >= 0) {
            updateItemQuantity(existingItemIndex, saleData.items[existingItemIndex].quantity + 1)
            toast.info(`Increased quantity of ${item.name}`)
        } else {
            const newSaleItem = {
                itemId: item.id,
                name: item.name,
                sku: item.sku,
                unitPrice: parseFloat(item.sellingPrice),
                quantity: 1,
                maxQuantity: item.stockQuantity,
                subtotal: parseFloat(item.sellingPrice)
            }

            setSaleData(prev => ({
                ...prev,
                items: [...prev.items, newSaleItem]
            }))

            toast.success(`Added ${item.name} to sale`)
        }

        setSearchTerm('')
        setSearchResults([])
        setShowSearch(false)
    }

    function updateItemQuantity(index, quantity) {
        if (quantity <= 0) {
            removeItemFromSale(index)
            return
        }

        setSaleData(prev => {
            const newItems = [...prev.items]
            const item = newItems[index]

            if (quantity > item.maxQuantity) {
                quantity = item.maxQuantity
            }

            newItems[index] = {
                ...item,
                quantity,
                subtotal: item.unitPrice * quantity
            }

            return {...prev, items: newItems}
        })
    }

    function removeItemFromSale(index) {
        const itemName = saleData.items[index]?.name
        setSaleData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }))
        toast.warning(`Removed ${itemName} from sale`)
    }

    function updateDiscount(discount) {
        let numericDiscount = parseFloat(discount)
        if (isNaN(numericDiscount) || numericDiscount < 0) {
            numericDiscount = 0
        }
        setSaleData(prev => ({...prev, discount: numericDiscount}))
    }

    function calculateTotals() {
        const subtotal = saleData.items.reduce((sum, item) => sum + item.subtotal, 0)

        let discountAmount = parseFloat(saleData.discount)
        if (isNaN(discountAmount) || discountAmount < 0) {
            discountAmount = 0
        }

        const total = Math.max(0, subtotal - discountAmount)

        return {subtotal, discountAmount, total}
    }

    function validateSale() {
        const validation = validateSaleForm(saleData)

        const {total} = calculateTotals()
        if (total <= 0) {
            validation.errors.total = 'Sale total must be greater than zero'
            validation.isValid = false
        }

        saleData.items.forEach((item, index) => {
            if (item.quantity > item.maxQuantity) {
                validation.errors[`item_${index}`] = `Only ${item.maxQuantity} units of ${item.name} available in stock`
                validation.isValid = false
            }
        })

        setErrors(validation.errors)
        return validation.isValid
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (!validateSale()) return

        setSaving(true)
        setError(null)

        try {
            const {discountAmount} = calculateTotals()

            const salePayload = {
                customerName: saleData.customerName.trim() || null,
                paymentMethod: saleData.paymentMethod,
                discount: parseFloat(discountAmount.toFixed(2)),
                items: saleData.items.map(item => ({
                    itemId: item.itemId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                }))
            }

            const response = await fetch(`/api/sales/${saleId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(salePayload)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to update sale')
            }

            const sale = await response.json()
            setSuccess(true)
            toast.success(`Sale updated successfully! Total: KSH ${parseFloat(sale.total).toFixed(2)}`)

            setTimeout(() => {
                router.push(`/sales/${sale.id}`)
            }, 2000)

        } catch (err) {
            setError(err.message)
            toast.error(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/sales"
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    >
                        <ArrowLeft className="h-5 w-5"/>
                    </Link>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                        Edit Sale
                    </h1>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                    <div className="flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Loading sale data...</span>
                    </div>
                </div>
            </div>
        )
    }

    const {subtotal, discountAmount, total} = calculateTotals()

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center space-x-4 mb-2">
                        <Link
                            href="/sales"
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        >
                            <ArrowLeft className="h-5 w-5"/>
                        </Link>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                            Edit Sale #{saleId}
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 ml-14">
                        Update sale details and inventory will be adjusted automatically
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start">
                        <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0"/>
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
                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0"/>
                        <div className="ml-3">
                            <h3 className="text-sm font-semibold text-green-800">Sale Updated!</h3>
                            <p className="mt-1 text-sm text-green-700">
                                Sale updated successfully. Redirecting to sale details...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Customer & Payment Info */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                                <User className="h-5 w-5 text-white"/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Customer Information</h3>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Customer Name <span className="text-xs text-gray-500">(optional)</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={saleData.customerName}
                                        onChange={(e) => setSaleData(prev => ({...prev, customerName: e.target.value}))}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        placeholder="Enter customer name or leave blank for walk-in"
                                    />
                                    <User className="absolute right-3 top-3 h-5 w-5 text-gray-400"/>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Payment Method *
                                </label>
                                <div className="relative">
                                    <select
                                        value={saleData.paymentMethod}
                                        onChange={(e) => setSaleData(prev => ({
                                            ...prev,
                                            paymentMethod: e.target.value
                                        }))}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                            errors.paymentMethod ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                        }`}
                                    >
                                        {paymentMethods.map(method => (
                                            <option key={method} value={method}>{method}</option>
                                        ))}
                                    </select>
                                    <CreditCard className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none"/>
                                </div>
                                {errors.paymentMethod && <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Item Search & Selection */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                                <ShoppingCart className="h-5 w-5 text-white"/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Edit Sale Items</h3>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="relative">
                            <div className="relative">
                                <Search className="h-5 w-5 absolute left-4 top-5 text-gray-400"/>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                                    placeholder="Start typing to search and add more items..."
                                />
                                {searchTerm.length > 0 && (
                                    <div className="right-4 top-4 text-sm text-gray-500">
                                        {searchResults.length} found
                                    </div>
                                )}
                            </div>

                            {showSearch && searchResults.length > 0 && (
                                <div className="z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                                    <div className="p-2 border-b border-gray-100 bg-gray-50 text-sm font-medium text-gray-600">
                                        Click to add items to your sale
                                    </div>
                                    {searchResults.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => addItemToSale(item)}
                                            className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 group-hover:text-blue-900">{item.name}</p>
                                                    <p className="text-sm text-gray-500 group-hover:text-blue-700">
                                                        SKU: {item.sku} • Stock: <span className={item.stockQuantity <= item.minStockLevel ? 'text-red-600 font-medium' : 'text-green-600'}>{item.stockQuantity}</span>
                                                    </p>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <p className="font-semibold text-green-600 text-lg">KSH {parseFloat(item.sellingPrice).toFixed(2)}</p>
                                                    <p className="text-xs text-gray-400">per unit</p>
                                                </div>
                                                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <Plus className="h-5 w-5 text-blue-600"/>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {showSearch && searchResults.length === 0 && searchTerm.length >= 2 && (
                                <div className="z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                                    <div className="text-center">
                                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-3"/>
                                        <p className="text-gray-500 font-medium">No items found matching "{searchTerm}"</p>
                                        <p className="text-sm text-gray-400 mt-1">Try searching by product name or SKU</p>
                                    </div>
                                </div>
                            )}

                            {searchTerm.length > 0 && searchTerm.length < 2 && (
                                <div className="z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
                                    <p className="text-gray-500 text-center text-sm">Type at least 2 characters to search...</p>
                                </div>
                            )}
                        </div>

                        {errors.items && <p className="text-sm text-red-600">{errors.items}</p>}

                        {/* Selected Items */}
                        {saleData.items.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900">Sale Items</h4>
                                <div className="space-y-3">
                                    {saleData.items.map((item, index) => (
                                        <div key={`${item.itemId}-${index}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex-1">
                                                <h5 className="font-medium text-gray-900">{item.name}</h5>
                                                <p className="text-sm text-gray-500">SKU: {item.sku} • KSH {item.unitPrice.toFixed(2)} each</p>
                                                {item.quantity > item.maxQuantity && (
                                                    <div className="flex items-center mt-1">
                                                        <AlertTriangle className="h-3 w-3 text-red-500 mr-1"/>
                                                        <p className="text-xs text-red-600 font-medium">
                                                            Only {item.maxQuantity} in stock!
                                                        </p>
                                                    </div>
                                                )}
                                                {item.maxQuantity <= 5 && item.quantity <= item.maxQuantity && (
                                                    <div className="flex items-center mt-1">
                                                        <AlertTriangle className="h-3 w-3 text-yellow-500 mr-1"/>
                                                        <p className="text-xs text-yellow-600">
                                                            Low stock: {item.maxQuantity} available
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateItemQuantity(index, item.quantity - 1)}
                                                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-all duration-200"
                                                    >
                                                        <Minus className="h-4 w-4"/>
                                                    </button>
                                                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateItemQuantity(index, item.quantity + 1)}
                                                        disabled={item.quantity >= item.maxQuantity}
                                                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Plus className="h-4 w-4"/>
                                                    </button>
                                                </div>

                                                <div className="text-right min-w-0 flex-shrink-0">
                                                    <p className="font-semibold text-gray-900">KSH {item.subtotal.toFixed(2)}</p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeItemFromSale(index)}
                                                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sale Summary */}
                {saleData.items.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                        <div className="px-6 py-6 border-b border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-900">Sale Summary</h3>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Discount Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400">KSH </span>
                                    <input
                                        type="number"
                                        step="5"
                                        min="0"
                                        max={subtotal}
                                        value={saleData.discount || 0}
                                        onChange={(e) => updateDiscount(e.target.value)}
                                        className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.discount && <p className="mt-1 text-sm text-red-600">{errors.discount}</p>}
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal:</span>
                                    <span>KSH {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Discount:</span>
                                    <span>-KSH {discountAmount.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-xl font-bold text-gray-900">
                                        <span>Total:</span>
                                        <span>KSH {total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {errors.total && <p className="text-sm text-red-600">{errors.total}</p>}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link
                        href={`/sales/${saleId}`}
                        className="px-6 py-3 text-gray-700 bg-gray-100 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200 text-center"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving || success || saleData.items.length === 0}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin"/>
                                Updating Sale...
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="h-5 w-5 mr-2"/>
                                Update Sale (KSH {total.toFixed(2)})
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}