'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

const ShopContext = createContext({})

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider')
  }
  return context
}

export function ShopProvider({ children }) {
  const { data: session, status } = useSession()
  const [shops, setShops] = useState([])
  const [currentShop, setCurrentShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch user's shops
  const fetchShops = async () => {
    if (!session?.user?.id) {
      setShops([])
      setCurrentShop(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/shops')
      
      if (!response.ok) {
        throw new Error('Failed to fetch shops')
      }

      const data = await response.json()
      setShops(data.shops || [])
      
      // Set current shop from localStorage or first shop
      const savedShopId = localStorage.getItem('currentShopId')
      if (savedShopId && data.shops?.find(shop => shop.id === savedShopId)) {
        setCurrentShop(data.shops.find(shop => shop.id === savedShopId))
      } else if (data.shops?.length > 0) {
        setCurrentShop(data.shops[0])
        localStorage.setItem('currentShopId', data.shops[0].id)
      }
      
      setError(null)
    } catch (err) {
      console.error('Error fetching shops:', err)
      setError(err.message)
      toast.error('Failed to load shops')
    } finally {
      setLoading(false)
    }
  }

  // Create a new shop
  const createShop = async (shopData) => {
    try {
      const response = await fetch('/api/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shopData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create shop')
      }

      const newShop = await response.json()
      setShops(prev => [newShop, ...prev])
      
      // Auto-select the new shop
      setCurrentShop(newShop)
      localStorage.setItem('currentShopId', newShop.id)
      
      toast.success('Shop created successfully!')
      return newShop
    } catch (err) {
      console.error('Error creating shop:', err)
      toast.error(err.message)
      throw err
    }
  }

  // Update a shop
  const updateShop = async (shopId, shopData) => {
    try {
      const response = await fetch(`/api/shops/${shopId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shopData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update shop')
      }

      const updatedShop = await response.json()
      setShops(prev => prev.map(shop => 
        shop.id === shopId ? updatedShop : shop
      ))
      
      // Update current shop if it's the one being updated
      if (currentShop?.id === shopId) {
        setCurrentShop(updatedShop)
      }
      
      toast.success('Shop updated successfully!')
      return updatedShop
    } catch (err) {
      console.error('Error updating shop:', err)
      toast.error(err.message)
      throw err
    }
  }

  // Delete a shop
  const deleteShop = async (shopId) => {
    try {
      const response = await fetch(`/api/shops/${shopId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete shop')
      }

      setShops(prev => prev.filter(shop => shop.id !== shopId))
      
      // If deleted shop was current, switch to first available shop
      if (currentShop?.id === shopId) {
        const remainingShops = shops.filter(shop => shop.id !== shopId)
        if (remainingShops.length > 0) {
          setCurrentShop(remainingShops[0])
          localStorage.setItem('currentShopId', remainingShops[0].id)
        } else {
          setCurrentShop(null)
          localStorage.removeItem('currentShopId')
        }
      }
      
      toast.success('Shop deleted successfully!')
    } catch (err) {
      console.error('Error deleting shop:', err)
      toast.error(err.message)
      throw err
    }
  }

  // Switch to a different shop
  const switchShop = (shop) => {
    setCurrentShop(shop)
    localStorage.setItem('currentShopId', shop.id)
    toast.success(`Switched to ${shop.name}`)
  }

  // Refresh shops data
  const refreshShops = () => {
    fetchShops()
  }

  useEffect(() => {
    if (status === 'loading') return
    
    if (session?.user) {
      fetchShops()
    } else {
      setShops([])
      setCurrentShop(null)
      setLoading(false)
      localStorage.removeItem('currentShopId')
    }
  }, [session, status])

  const value = {
    shops,
    currentShop,
    loading,
    error,
    createShop,
    updateShop,
    deleteShop,
    switchShop,
    refreshShops,
    hasShops: shops.length > 0,
  }

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  )
}