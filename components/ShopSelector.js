'use client'

import {useState, useRef, useEffect} from 'react'
import {useShop} from '@/contexts/ShopContext'
import {
    ChevronDown,
    Store,
    Plus,
    Check,
    Settings,
    Loader2, ShoppingBag
} from 'lucide-react'

export default function ShopSelector({ onCreateShop }) {
    const {shops, currentShop, loading, switchShop} = useShop()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    if (loading) {
        return (
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500"/>
                <span className="text-sm text-gray-600">Loading shops...</span>
            </div>
        )
    }

    if (!shops.length) {
        return (
            <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <ShoppingBag className="h-4 w-4 text-yellow-600"/>
                <span className="text-sm text-yellow-800">No shops available</span>
            </div>
        )
    }

    return (
        <div>
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 min-w-[200px]"
                >
                    <ShoppingBag className="h-4 w-4 text-gray-500"/>
                    <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-900">
                            {currentShop?.name || 'Select Shop'}
                        </div>
                        {currentShop && (
                            <div className="text-xs text-gray-500">
                                {currentShop._count?.items || 0} items • {currentShop._count?.sales || 0} sales
                            </div>
                        )}
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}/>
                </button>

                {isOpen && (
                    <div
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                        <div className="py-1">
                            {shops.map((shop) => (
                                <button
                                    key={shop.id}
                                    onClick={() => {
                                        switchShop(shop)
                                        setIsOpen(false)
                                    }}
                                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <div className="flex items-center space-x-2">
                                        <ShoppingBag className="h-4 w-4 text-gray-400"/>
                                        <div>
                                            <div className="font-medium text-gray-900">{shop.name}</div>
                                            <div className="text-xs text-gray-500">
                                                {shop._count?.items || 0} items • {shop._count?.sales || 0} sales
                                            </div>
                                        </div>
                                    </div>
                                    {currentShop?.id === shop.id && (
                                        <Check className="h-4 w-4 text-green-600"/>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 py-1">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    onCreateShop && onCreateShop();
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors duration-200 text-blue-600"
                            >
                                <Plus className="h-4 w-4"/>
                                <span>Create New Shop</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}