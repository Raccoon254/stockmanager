'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Plus, Check } from 'lucide-react'

export default function CustomSelect({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select option",
  allowCustom = false,
  customPlaceholder = "Add new option",
  error = false,
  icon: Icon = null,
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

  const handleSelect = (option) => {
    onChange(option)
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

  const displayValue = value || placeholder

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-left flex items-center justify-between ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-200'
        } ${!value ? 'text-gray-500' : 'text-gray-900'}`}
      >
        <span className="flex items-center">
          {Icon && <Icon className="h-5 w-5 text-gray-400 mr-2" />}
          {displayValue}
        </span>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {options.length === 0 && !allowCustom ? (
            <div className="px-4 py-3 text-gray-500 text-sm">No options available</div>
          ) : (
            <>
              {options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-all duration-200 flex items-center justify-between group"
                >
                  <span className="text-gray-900 group-hover:text-blue-900">{option}</span>
                  {value === option && <Check className="h-4 w-4 text-blue-600" />}
                </button>
              ))}
              
              {allowCustom && (
                <>
                  {options.length > 0 && <div className="border-t border-gray-100" />}
                  
                  {!showCustomInput ? (
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(true)}
                      className="w-full px-4 py-3 text-left hover:bg-green-50 transition-all duration-200 flex items-center text-green-600 hover:text-green-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {customPlaceholder}
                    </button>
                  ) : (
                    <div className="p-3 border-t border-gray-100 bg-gray-50">
                      <div className="flex space-x-2">
                        <input
                          ref={customInputRef}
                          type="text"
                          value={customValue}
                          onChange={(e) => setCustomValue(e.target.value)}
                          onKeyDown={handleCustomKeyPress}
                          placeholder="Enter new option"
                          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <button
                          type="button"
                          onClick={handleCustomSubmit}
                          disabled={!customValue.trim()}
                          className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}