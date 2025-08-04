'use client'

import Layout from '@/components/Layout'
import InventoryList from '@/components/InventoryList'
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'

export default function InventoryPage() {
  const breadcrumbs = useBreadcrumbs()
  const breadcrumbItems = breadcrumbs.inventory()

  return (
    <Layout breadcrumbItems={breadcrumbItems}>
      <InventoryList />
    </Layout>
  )
}