import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const router = useRouter()
  const { user, login, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [attempting, setAttempting] = useState(false)

  useEffect(() => {
    // If already logged in, redirect to home
    if (user) {
      router.push('/')
    }
  }, [user, router])

  useEffect(() => {
    // Auto-login when Telegram WebApp is loaded
    if (typeof window !== 'undefined' && !attempting && !loading) {
      const tg = (window as any).Telegram?.WebApp

      if (tg) {
        setAttempting(true)
        const initData = tg.initData

        if (initData) {
          login(initData)
            .then(() => {
              router.push('/')
            })
            .catch((err) => {
              setError(err.message ||'Authentication failed')
              setAttempting(false)
            })
        } else {
          setError('No Telegram init data found. Please open this app from Telegram.')
          setAttempting(false)
        }
      } else {
        setError('Not running inside Telegram Mini App')
        setAttempting(false)
      }
    }
  }, [attempting, loading, login, router])

  if (loading || attempting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Zyora CRM</h1>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        ) : (
          <p className="text-gray-600 mb-4">
            Please open this app from Telegram to authenticate.
          </p>
        )}

        <div className="text-sm text-gray-500">
          <p>Bot: @zyora_realestate_bot</p>
        </div>
      </div>
    </div>
  )
}
