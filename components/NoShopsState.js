'use client'

import { useState } from 'react'
import { Store, Plus, ArrowRight } from 'lucide-react'
import CreateShopModal from './CreateShopModal'

export default function NoShopsState() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Store className="h-8 w-8 text-white" />
            </div>
            
            {/* Content */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome to Stock Manager!
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              To get started, you'll need to create your first shop. This will help you organize and manage your inventory effectively.
            </p>
            
            {/* Features */}
            <div className="space-y-3 mb-8 text-left">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span>Manage inventory across multiple locations</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span>Track sales and generate reports</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span>Monitor stock levels and low inventory alerts</span>
              </div>
            </div>
            
            {/* Action Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 group"
            >
              <Plus className="h-5 w-5" />
              <span>Create Your First Shop</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            
            <p className="text-xs text-gray-500 mt-4">
              You can create multiple shops and switch between them anytime
            </p>
          </div>
        </div>
      </div>
      
      <CreateShopModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  )
}