'use client'

import { useCallback, useEffect, useState } from 'react'
import { Package } from '@/lib/supabase'

interface PackageListProps {
  searchQuery: string
}

export default function PackageList({ searchQuery }: PackageListProps) {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generatingCustom, setGeneratingCustom] = useState(false)

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/packages?${params}`)
      if (!response.ok) throw new Error('Failed to fetch packages')

      const data = await response.json()
      setPackages(data)
      setError(null)
    } catch (err) {
      setError('Failed to load packages. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  const generateCustomPackage = async () => {
    try {
      setGeneratingCustom(true)
      const response = await fetch('/api/packages/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: searchQuery }),
      })

      if (!response.ok) throw new Error('Failed to generate custom package')

      await fetchPackages() // Refresh the list
    } catch (err) {
      console.error('Failed to generate custom package:', err)
      alert('Failed to generate custom package. Please try again.')
    } finally {
      setGeneratingCustom(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading packages...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Travel Packages</h2>
        <button
          onClick={generateCustomPackage}
          disabled={generatingCustom}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          {generatingCustom ? 'Generating...' : '✨ Generate Custom Package'}
        </button>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No packages found. Try generating a custom package!
        </div>
      ) : (
        packages.map((pkg) => (
          <div
            key={pkg.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-blue-50"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-3">{pkg.description}</p>

                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span>📅 Duration:</span>
                    <span className="font-medium">{pkg.duration_days} days</span>
                  </div>
                  {pkg.flight_id && (
                    <div className="flex items-center gap-2">
                      <span>✈️ Flight included</span>
                    </div>
                  )}
                  {pkg.hotel_id && (
                    <div className="flex items-center gap-2">
                      <span>🏨 Hotel included</span>
                    </div>
                  )}
                  {pkg.car_rental_id && (
                    <div className="flex items-center gap-2">
                      <span>🚗 Car rental included</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right ml-4">
                <div className="text-3xl font-bold text-green-600">${pkg.total_price}</div>
                <div className="text-sm text-gray-500 mb-2">total package price</div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Book Package
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
