import Layout from '@/components/Layout'
import SaleDetails from '@/components/SaleDetails'

export default async function SaleDetailsPage({ params }) {
  const { id } = await params
  return (
    <Layout>
      <SaleDetails saleId={id} />
    </Layout>
  )
}