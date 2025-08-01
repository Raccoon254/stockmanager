'use client'

import EditSaleForm from '@/components/EditSaleForm'

export default function EditSalePage({ params }) {
  return <EditSaleForm saleId={params.id} />
}