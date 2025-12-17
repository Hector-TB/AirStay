'use client'

import { useState, useEffect } from 'react'
import FlightList from '@/components/FlightList'
import HotelList from '@/components/HotelList'
import PackageList from '@/components/PackageList'
import SearchBar from '@/components/SearchBar'

type Tab = 'flights' | 'hotels' | 'packages'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('packages')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold">✈️ AirStay</h1>
          <p className="text-blue-100 mt-2">Your all-in-one travel booking platform</p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-1 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
              activeTab === 'packages'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            📦 Packages
          </button>
          <button
            onClick={() => setActiveTab('flights')}
            className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
              activeTab === 'flights'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            ✈️ Flights
          </button>
          <button
            onClick={() => setActiveTab('hotels')}
            className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
              activeTab === 'hotels'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            🏨 Hotels
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-lg p-6 min-h-[600px]">
          {activeTab === 'flights' && <FlightList searchQuery={searchQuery} />}
          {activeTab === 'hotels' && <HotelList searchQuery={searchQuery} />}
          {activeTab === 'packages' && <PackageList searchQuery={searchQuery} />}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 mt-12 text-center text-gray-600">
        <p>© 2024 AirStay - Powered by ML-driven personalization</p>
      </footer>
    </main>
  )
}
