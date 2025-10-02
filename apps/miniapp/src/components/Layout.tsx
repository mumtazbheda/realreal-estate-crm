import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface LayoutProps {
  children: ReactNode
}

const tabs = [
  { id: 'leads', label: 'Leads', href: '/' },
  { id: 'properties', label: 'Properties', href: '/properties' },
  { id: 'deals', label: 'Deals', href: '/deals' },
  { id: 'tasks', label: 'Tasks', href: '/tasks' },
  { id: 'inbox', label: 'Inbox', href: '/inbox' },
  { id: 'reports', label: 'Reports', href: '/reports' },
  { id: 'settings', label: 'Settings', href: '/settings' },
]

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="flex justify-around py-2 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = router.pathname === tab.href
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex flex-col items-center px-3 py-2 text-xs min-w-max ${
                  isActive ? 'text-blue-600 font-medium' : 'text-gray-600'
                }`}
              >
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
