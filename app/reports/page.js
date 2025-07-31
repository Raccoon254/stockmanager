'use client'

import { useSession } from 'next-auth/react'
import { useShop } from '@/contexts/ShopContext'
import Layout from '@/components/Layout'
import Reports from '@/components/Reports'
import NoShopsState from '@/components/NoShopsState'
import { Loader2 } from 'lucide-react'

export default function ReportsPage() {
  const { data: session, status } = useSession()
  const { shops, currentShop, loading: shopsLoading } = useShop()

  if (status === 'loading' || shopsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">You need to be signed in to access reports.</p>
        </div>
      </div>
    )
  }

  // Show no shops state if user doesn't have any shops
  if (!shops.length) {
    return <NoShopsState />
  }

  // Show loading if shops exist but no current shop is selected yet
  if (!currentShop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Setting up your reports...</p>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <Reports />
    </Layout>
  )
}