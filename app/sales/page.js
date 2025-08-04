'use client'

import Layout from '@/components/Layout'
import SalesHistory from '@/components/SalesHistory'
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'

export default function SalesPage() {
  const breadcrumbs = useBreadcrumbs()
  const breadcrumbItems = breadcrumbs.sales()

  return (
    <Layout breadcrumbItems={breadcrumbItems}>
      <SalesHistory />
    </Layout>
  )
}