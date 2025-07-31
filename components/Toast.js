'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X,
  AlertCircle
} from 'lucide-react'

const toastTypes = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
    textColor: 'text-white',
    borderColor: 'border-green-400'
  },
  error: {
    icon: AlertTriangle,
    bgColor: 'bg-gradient-to-r from-red-500 to-rose-500',
    textColor: 'text-white',
    borderColor: 'border-red-400'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    textColor: 'text-white',
    borderColor: 'border-yellow-400'
  },
  info: {
    icon: Info,
    bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    textColor: 'text-white',
    borderColor: 'border-blue-400'
  }
}

let toastId = 0

export const toast = {
  success: (message, options = {}) => addToast('success', message, options),
  error: (message, options = {}) => addToast('error', message, options),
  warning: (message, options = {}) => addToast('warning', message, options),
  info: (message, options = {}) => addToast('info', message, options),
}

let toastSubscribers = []

function addToast(type, message, options = {}) {
  const id = ++toastId
  const newToast = {
    id,
    type,
    message,
    duration: options.duration || 5000,
    ...options
  }
  
  toastSubscribers.forEach(callback => callback(newToast))
  
  if (newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }
  
  return id
}

function removeToast(id) {
  toastSubscribers.forEach(callback => callback({ id, remove: true }))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handleToast = (toast) => {
      if (toast.remove) {
        setToasts(prev => prev.filter(t => t.id !== toast.id))
      } else {
        setToasts(prev => [...prev, toast])
      }
    }

    toastSubscribers.push(handleToast)
    
    return () => {
      toastSubscribers = toastSubscribers.filter(cb => cb !== handleToast)
    }
  }, [])

  const dismissToast = (id) => {
    removeToast(id)
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => {
        const config = toastTypes[toast.type]
        const Icon = config.icon
        
        return (
          <div
            key={toast.id}
            className={`${config.bgColor} ${config.textColor} rounded-xl shadow-lg border ${config.borderColor} p-4 transform transition-all duration-300 ease-in-out animate-slide-in`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">
                  {toast.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="inline-flex text-white hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default toast