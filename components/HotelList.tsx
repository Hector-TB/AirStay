'use client'

import { useEffect, useState } from 'react'
import { Hotel } from '@/lib/supabase'

interface HotelListProps {
  searchQuery: string
}

export default function HotelList({ searchQuery }: HotelListProps) {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHotels()
  }, [searchQuery])

  const fetchHotels = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/hotels?${params}`)
      if (!response.ok) throw new Error('Failed to fetch hotels')

      const data = await response.json()
      setHotels(data)
      setError(null)
    } catch (err) {
      setError('Failed to load hotels. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading hotels...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>
  }

  if (hotels.length === 0) {
    return <div className="text-center py-12 text-gray-600">No hotels found.</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Hotels</h2>
      {hotels.map((hotel) => (
        <div
          key={hotel.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{hotel.name}</h3>
              <div className="text-gray-600 mb-2">📍 {hotel.location}</div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < hotel.rating ? 'text-yellow-400' : 'text-gray-300'}>
                    ⭐
                  </span>
                ))}
                <span className="text-sm text-gray-600 ml-1">({hotel.rating}/5)</span>
              </div>
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-2 text-sm text-gray-600">
                {hotel.available_rooms} rooms available
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">${hotel.price_per_night}</div>
              <div className="text-sm text-gray-500">per night</div>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                Book Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
