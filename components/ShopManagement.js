'use client'

import { useState } from 'react'
import { useShop } from '@/contexts/ShopContext'
import CreateShopModal from '@/components/CreateShopModal'
import DeleteShopModal from '@/components/DeleteShopModal'
import EditShopModal from '@/components/EditShopModal' // Import the new modal
import {
  ShoppingBag,
  Plus,
  Edit3,
  Trash2,
  Package,
  TrendingUp,
  Calendar,
  Loader2,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ShopManagement() {
  const { shops, loading, deleteShop, currentShop } = useShop()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingShop, setEditingShop] = useState(null) // This will now hold the shop object for the edit modal
  const [deletingShop, setDeletingShop] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Open edit modal
  const handleEditClick = (shop) => {
    setEditingShop(shop)
    setIsEditModalOpen(true)
  }

  // Open confirmation modal
  const handleDeleteClick = (shop) => {
    setDeletingShop(shop)
    setIsDeleteModalOpen(true)
  }

  // Perform deletion after confirmation
  const handleConfirmDelete = async () => {
    if (!deletingShop) return

    try {
      await deleteShop(deletingShop.id)
      toast.success(`Shop "${deletingShop.name}" deleted successfully.`)
    } catch (error) {
      // Error is handled in the context
    } finally {
      setDeletingShop(null)
      setIsDeleteModalOpen(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your shops...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            Shop Management
          </h1>
          <p className="mt-2 text-lg text-gray-600">Manage your shops and their settings</p>
        </div>
        <div className="mt-6 lg:mt-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Shop
          </button>
        </div>
      </div>

      {/* Shops Grid */}
      {shops.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
          <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No shops yet</h3>
          <p className="text-gray-600 mb-6">Create your first shop to get started with inventory management</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Shop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] ${
                currentShop?.id === shop.id ? 'ring-2 ring-blue-500 border-blue-200 shadow-blue-500/25' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${currentShop?.id === shop.id ? 'bg-gradient-to-r from-blue-100 to-indigo-100' : 'bg-gray-100'}`}>
                    <ShoppingBag className={`h-6 w-6 ${currentShop?.id === shop.id ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{shop.name}</h3>
                    {currentShop?.id === shop.id && (
                      <span className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                        Current Shop
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(shop)}
                    className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-105"
                    title="Edit shop"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(shop)}
                    disabled={deletingShop?.id === shop.id}
                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50"
                    title="Delete shop"
                  >
                    {deletingShop?.id === shop.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {shop.description && (
                <p className="text-gray-600 text-sm mb-6 line-clamp-2">{shop.description}</p>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Items</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-lg">{shop._count?.items || 0}</span>
                </div>

                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">Sales</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-lg">{shop._count?.sales || 0}</span>
                </div>

                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="font-medium">Created</span>
                  </div>
                  <span className="font-semibold text-gray-900">{formatDate(shop.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateShopModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <EditShopModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        shop={editingShop}
      />

      <DeleteShopModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        shopName={deletingShop?.name || ''}
        loading={deletingShop !== null && loading}
      />
    </div>
  )
}
