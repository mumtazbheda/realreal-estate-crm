import Layout from '@/components/Layout'

export default function Home() {
  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Leads</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Welcome to Real Estate CRM</h2>
          <p className="text-gray-600">Manage your leads, properties, and deals all in one place.</p>
        </div>
      </div>
    </Layout>
  )
}
