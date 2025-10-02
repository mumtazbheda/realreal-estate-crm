import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Leads</h1>
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Logout
          </button>
        </div>

        {/* User Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-900">
            👋 Welcome, <strong>{user.full_name}</strong>!
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Role: {user.role} • Companies: {user.companies.length}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Welcome to Zyora CRM</h2>
          <p className="text-gray-600">Manage your leads, properties, and deals all in one place.</p>
        </div>
      </div>
    </Layout>
  )
}
