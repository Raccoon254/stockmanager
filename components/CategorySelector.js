'use client'

import { useState, useRef, useEffect } from 'react'
import {
  ChevronDown,
  Check,
  Plus,
  Smartphone,
  Shirt,
  Coffee,
  BookOpen,
  Heart,
  Home,
  Trophy,
  Gamepad2,
  Car,
  Tag,
  Package, CarFront, Footprints
} from 'lucide-react'

const categories = [
  {
    value: 'Clothing',
    label: 'Clothing',
    icon: Footprints,
    description: 'Apparel, shoes, accessories'
  },
  { 
    value: 'Electronics', 
    label: 'Electronics', 
    icon: Smartphone,
    description: 'Phones, computers, gadgets' 
  },
  { 
    value: 'Food & Beverages', 
    label: 'Food & Beverages', 
    icon: Coffee,
    description: 'Food items, drinks, snacks' 
  },
  { 
    value: 'Books', 
    label: 'Books', 
    icon: BookOpen,
    description: 'Books, magazines, publications' 
  },
  { 
    value: 'Health & Beauty', 
    label: 'Health & Beauty', 
    icon: Heart,
    description: 'Skincare, cosmetics, wellness' 
  },
  { 
    value: 'Home & Garden', 
    label: 'Home & Garden', 
    icon: Home,
    description: 'Furniture, decor, gardening' 
  },
  { 
    value: 'Sports & Outdoors', 
    label: 'Sports & Outdoors', 
    icon: Trophy,
    description: 'Sports equipment, outdoor gear' 
  },
  { 
    value: 'Toys & Games', 
    label: 'Toys & Games', 
    icon: Gamepad2,
    description: 'Toys, games, entertainment' 
  },
  { 
    value: 'Automotive', 
    label: 'Automotive', 
    icon: CarFront,
    description: 'Auto parts, accessories, tools' 
  },
  { 
    value: 'Other', 
    label: 'Other', 
    icon: Package,
    description: 'Miscellaneous items' 
  }
]

export default function CategorySelector({
  value,
  onChange,
  allowCustom = true,
  error = false,
  className = "",
  placeholder = "Select category",
  showDescription = true,
  includeAllOption = false
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

  const handleSelect = (category) => {
    onChange(category.value)
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

  const selectedCategory = categories.find(category => category.value === value)
  const isAllCategories = value === "All Categories" || (includeAllOption && !value)
  
  let displayValue, SelectedIcon
  
  if (isAllCategories && includeAllOption) {
    displayValue = "All Categories"
    SelectedIcon = Package
  } else {
    displayValue = selectedCategory?.label || value || placeholder
    SelectedIcon = selectedCategory?.icon || Tag
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-left flex items-center justify-between ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-200'
        } ${!value ? 'text-gray-500' : 'text-gray-900'}
        ${selectedCategory ? 'py-1' : 'py-3'}
        `}
      >
        <span className="flex items-center">
          <SelectedIcon className="h-5 w-5 text-gray-400 mr-3" />
          <div>
            <div className="font-medium">{displayValue}</div>
            {selectedCategory && showDescription && (
              <div className="text-xs text-gray-500">{selectedCategory.description}</div>
            )}
          </div>
        </span>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-md max-h-80 overflow-y-auto">
          {includeAllOption && (
            <button
              type="button"
              onClick={() => handleSelect({ value: "All Categories", label: "All Categories" })}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-all duration-200 flex items-center justify-between group border-b border-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                  <Package className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-900">
                    All Categories
                  </div>
                  {showDescription && (
                    <div className="text-xs text-gray-500 group-hover:text-blue-600">
                      Show all product categories
                    </div>
                  )}
                </div>
              </div>
              {(value === "All Categories" || value === "") && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </button>
          )}
          
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <button
                key={category.value}
                type="button"
                onClick={() => handleSelect(category)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-all duration-200 flex items-center justify-between group border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                    <IconComponent className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-blue-900">
                      {category.label}
                    </div>
                    {showDescription && (
                      <div className="text-xs text-gray-500 group-hover:text-blue-600">
                        {category.description}
                      </div>
                    )}
                  </div>
                </div>
                {value === category.value && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            )
          })}

          {allowCustom && (
            <>
              <div className="border-t border-gray-100" />
              
              {!showCustomInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full px-4 py-3 text-left hover:bg-green-50 transition-all duration-200 flex items-center text-green-600 hover:text-green-700"
                >
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">Add Custom Category</div>
                    <div className="text-xs">Create a new category</div>
                  </div>
                </button>
              ) : (
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700">
                      Add Custom Category
                    </div>
                    <div className="flex space-x-2">
                      <input
                        ref={customInputRef}
                        type="text"
                        value={customValue}
                        onChange={(e) => setCustomValue(e.target.value)}
                        onKeyDown={handleCustomKeyPress}
                        placeholder="Enter category name"
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

// Export the categories array for use in other components
export { categories }