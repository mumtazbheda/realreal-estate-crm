import { useQuery } from '@tanstack/react-query'
import Layout from '@/components/Layout'

export default function Ping() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await fetch('/api/health')
      if (!res.ok) throw new Error('Health check failed')
      return res.json()
    },
  })

  return (
    <Layout>
      <div className="p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Health Check</h1>
          {isLoading && <p className="text-gray-600">Loading...</p>}
          {error && <p className="text-red-600">Error: {(error as Error).message}</p>}
          {data && (
            <div>
              <p className="text-green-600 font-medium mb-2">✓ API is healthy</p>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
