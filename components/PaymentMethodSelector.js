'use client'

import {useState, useRef, useEffect} from 'react'
import {
    ChevronDown,
    Check,
    Plus,
    CreditCard,
    Banknote,
    Smartphone,
    Building,
    FileText,
    Wallet, Coins
} from 'lucide-react'

const paymentMethods = [
    {
        value: 'Mobile Payment',
        label: 'Mobile Payment',
        icon: Smartphone,
        description: 'Payments via mobile ie M-Pesa, Airtel Money'
    },
    {
        value: 'Cash',
        label: 'Cash',
        icon: Coins,
        description: 'Physical cash payment'
    },
    {
        value: 'Credit Card',
        label: 'Credit Card',
        icon: CreditCard,
        description: 'Visa, Mastercard, etc.'
    },
    {
        value: 'Debit Card',
        label: 'Debit Card',
        icon: CreditCard,
        description: 'Bank debit card'
    },
    {
        value: 'Bank Transfer',
        label: 'Bank Transfer',
        icon: Building,
        description: 'Wire transfer or ACH'
    },
    {
        value: 'Digital Wallet',
        label: 'Digital Wallet',
        icon: Smartphone,
        description: 'PayPal, Apple Pay, etc.'
    },
    {
        value: 'Check',
        label: 'Check',
        icon: FileText,
        description: 'Paper check'
    }
]

export default function PaymentMethodSelector({
                                                  value,
                                                  onChange,
                                                  allowCustom = true,
                                                  error = false,
                                                  className = ""
                                              }) {
    const [isOpen, setIsOpen] = useState(false)
    const [customValue, setCustomValue] = useState('')
    const [showCustomInput, setShowCustomInput] = useState(false)
    const dropdownRef = useRef(null)
    const customInputRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
                setShowCustomInput(false)
                setCustomValue('')
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (showCustomInput && customInputRef.current) {
            customInputRef.current.focus()
        }
    }, [showCustomInput])

    const handleSelect = (method) => {
        onChange(method.value)
        setIsOpen(false)
        setShowCustomInput(false)
        setCustomValue('')
    }

    const handleCustomSubmit = () => {
        if (customValue.trim()) {
            onChange(customValue.trim())
            setIsOpen(false)
            setShowCustomInput(false)
            setCustomValue('')
        }
    }

    const handleCustomKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleCustomSubmit()
        } else if (e.key === 'Escape') {
            setShowCustomInput(false)
            setCustomValue('')
        }
    }

    const selectedMethod = paymentMethods.find(method => method.value === value)
    const displayValue = selectedMethod?.label || value || 'Select payment method'
    const SelectedIcon = selectedMethod?.icon || Wallet

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-1 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-left flex items-center justify-between ${
                    error ? 'border-red-300 bg-red-50' : 'border-gray-200'
                } ${!value ? 'text-gray-500' : 'text-gray-900'}`}
            >
        <span className="flex items-center">
          <SelectedIcon className="h-5 w-5 text-gray-400 mr-3"/>
          <div>
            <div className="font-medium">{displayValue}</div>
              {selectedMethod && (
                  <div className="text-xs text-gray-500">{selectedMethod.description}</div>
              )}
          </div>
        </span>
                <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div
                    className="absolute z-[99999] w-full top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-md max-h-80 overflow-y-auto">
                    {paymentMethods.map((method) => {
                        const IconComponent = method.icon
                        return (
                            <button
                                key={method.value}
                                type="button"
                                onClick={() => handleSelect(method)}
                                className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-all duration-200 flex items-center justify-between group border-b border-gray-50 last:border-b-0"
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                                        <IconComponent className="h-4 w-4 text-gray-600 group-hover:text-blue-600"/>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 group-hover:text-blue-900">
                                            {method.label}
                                        </div>
                                        <div className="text-xs text-gray-500 group-hover:text-blue-600">
                                            {method.description}
                                        </div>
                                    </div>
                                </div>
                                {value === method.value && (
                                    <Check className="h-4 w-4 text-blue-600"/>
                                )}
                            </button>
                        )
                    })}

                    {allowCustom && (
                        <>
                            <div className="border-t border-gray-100"/>

                            {!showCustomInput ? (
                                <button
                                    type="button"
                                    onClick={() => setShowCustomInput(true)}
                                    className="w-full px-4 py-3 text-left hover:bg-green-50 transition-all duration-200 flex items-center text-green-600 hover:text-green-700"
                                >
                                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                                        <Plus className="h-4 w-4"/>
                                    </div>
                                    <div>
                                        <div className="font-medium">Add Custom Payment Method</div>
                                        <div className="text-xs">Create a new payment option</div>
                                    </div>
                                </button>
                            ) : (
                                <div className="p-4 border-t border-gray-100 bg-gray-50">
                                    <div className="space-y-3">
                                        <div className="text-sm font-medium text-gray-700">
                                            Add Custom Payment Method
                                        </div>
                                        <div className="flex space-x-2">
                                            <input
                                                ref={customInputRef}
                                                type="text"
                                                value={customValue}
                                                onChange={(e) => setCustomValue(e.target.value)}
                                                onKeyDown={handleCustomKeyPress}
                                                placeholder="Enter payment method name"
                                                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleCustomSubmit}
                                                disabled={!customValue.trim()}
                                                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}