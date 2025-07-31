import Layout from '@/components/Layout'
import SaleDetails from '@/components/SaleDetails'

export default function SaleDetailsPage({ params }) {
  return (
    <Layout>
      <SaleDetails saleId={params.id} />
    </Layout>
  )
}