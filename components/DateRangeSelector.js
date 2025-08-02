'use client'

import {useState, useRef, useEffect} from 'react'
import {
    ChevronDown,
    Check,
    Calendar,
    CalendarDays,
    TrendingUp,
    Clock, Timer, HistoryIcon
} from 'lucide-react'

const dateRanges = [
    {
        value: 'today',
        label: 'Today',
        icon: Timer,
        description: 'Sales from today'
    },
    {
        value: 'yesterday',
        label: 'Yesterday',
        icon: HistoryIcon,
        description: 'Sales from yesterday'
    },
    {
        value: 'last7days',
        label: 'Last 7 Days',
        icon: CalendarDays,
        description: 'Sales from the last 7 days'
    },
    {
        value: 'last30days',
        label: 'Last 30 Days',
        icon: Calendar,
        description: 'Sales from the last 30 days'
    },
    {
        value: 'thisMonth',
        label: 'This Month',
        icon: Calendar,
        description: 'Sales from the current month'
    },
    {
        value: 'lastMonth',
        label: 'Last Month',
        icon: Calendar,
        description: 'Sales from the previous month'
    },
    {
        value: 'allTime',
        label: 'All Time',
        icon: TrendingUp,
        description: 'All sales data'
    }
]

export default function DateRangeSelector({
                                              value,
                                              onChange,
                                              className = "",
                                              placeholder = "Select date range",
                                          }) {
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

    const handleSelect = (range) => {
        onChange(range.value)
        setIsOpen(false)
    }

    const selectedRange = dateRanges.find(range => range.value === value)
    const displayValue = selectedRange?.label || placeholder
    const SelectedIcon = selectedRange?.icon || Calendar

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-left flex items-center justify-between ${!value ? 'text-gray-500' : 'text-gray-900'}
                ${selectedRange ? 'py-1' : 'py-3'}`}>
                <span className="flex items-center">
                  <SelectedIcon className="h-5 w-5 text-gray-400 mr-3"/>
                  <div>
                    <div className="font-medium">{displayValue}</div>
                      {selectedRange && (
                          <div className="text-xs text-gray-500">{selectedRange.description}</div>
                      )}
                  </div>
                </span>
                <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div
                    className="absolute z-50 w-full top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-md max-h-80 overflow-y-auto">
                    {dateRanges.map((range) => {
                        const IconComponent = range.icon
                        return (
                            <button
                                key={range.value}
                                type="button"
                                onClick={() => handleSelect(range)}
                                className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-all duration-200 flex items-center justify-between group border-b border-gray-50 last:border-b-0"
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                                        <IconComponent className="h-4 w-4 text-gray-600 group-hover:text-blue-600"/>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 group-hover:text-blue-900">
                                            {range.label}
                                        </div>
                                        <div className="text-xs text-gray-500 group-hover:text-blue-600">
                                            {range.description}
                                        </div>
                                    </div>
                                </div>
                                {value === range.value && (
                                    <Check className="h-4 w-4 text-blue-600"/>
                                )}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export {dateRanges}
