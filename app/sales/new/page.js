'use client'

import Layout from '@/components/Layout'
import SalesForm from '@/components/SalesForm'
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'

export default function NewSalePage() {
  const breadcrumbs = useBreadcrumbs()
  const breadcrumbItems = breadcrumbs.salesNew()

  return (
    <Layout breadcrumbItems={breadcrumbItems}>
      <SalesForm />
    </Layout>
  )
}