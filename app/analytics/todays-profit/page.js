'use client'

import { useSession } from 'next-auth/react'
import { useShop } from '@/contexts/ShopContext'
import Layout from '@/components/Layout'
import ProfitAnalysisDetails from '@/components/ProfitAnalysisDetails'
import { Loader2 } from 'lucide-react'

export default function TodaysProfitPage() {
  const { data: session, status } = useSession()
  const { shops, currentShop, loading: shopsLoading } = useShop()

  if (status === 'loading' || shopsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profit analysis...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">You need to be signed in to access analytics.</p>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <ProfitAnalysisDetails />
    </Layout>
  )
}