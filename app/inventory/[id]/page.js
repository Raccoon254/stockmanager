import Layout from '@/components/Layout'
import ItemForm from '@/components/ItemForm'

export default function EditItemPage({ params }) {
  return (
    <Layout>
      <ItemForm itemId={params.id} />
    </Layout>
  )
}