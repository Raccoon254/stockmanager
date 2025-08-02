'use client'

import { X, AlertTriangle, Loader2 } from 'lucide-react'

export default function DeleteShopModal({ isOpen, onClose, onConfirm, shopName, loading }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">Confirm Deletion</h2>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the shop{' '}
            <span className="font-bold text-gray-900">"{shopName}"</span>?
          </p>
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertTriangle className="inline h-4 w-4 mr-2" />
            This action is irreversible. All associated data, including inventory and sales records, will be permanently deleted.
          </p>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-medium rounded-xl hover:from-red-700 hover:to-orange-600 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Shop'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
