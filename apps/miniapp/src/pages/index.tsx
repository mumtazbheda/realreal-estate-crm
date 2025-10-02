import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('leads')

  const tabs = [
    { id: 'leads', label: 'Leads' },
    { id: 'properties', label: 'Properties' },
    { id: 'deals', label: 'Deals' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'inbox', label: 'Inbox' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Real Estate CRM</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2 capitalize">{activeTab}</h2>
          <p className="text-gray-600">Content for {activeTab} will appear here.</p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center px-3 py-2 text-xs ${
                activeTab === tab.id
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
