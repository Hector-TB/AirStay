'use client'

import { useEffect, useState } from 'react'
import { Flight } from '@/lib/supabase'

interface FlightListProps {
  searchQuery: string
}

export default function FlightList({ searchQuery }: FlightListProps) {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFlights()
  }, [searchQuery])

  const fetchFlights = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/flights?${params}`)
      if (!response.ok) throw new Error('Failed to fetch flights')

      const data = await response.json()
      setFlights(data)
      setError(null)
    } catch (err) {
      setError('Failed to load flights. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading flights...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>
  }

  if (flights.length === 0) {
    return <div className="text-center py-12 text-gray-600">No flights found.</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Flights</h2>
      {flights.map((flight) => (
        <div
          key={flight.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-semibold text-gray-800">{flight.airline}</span>
                <span className="text-sm text-gray-500">#{flight.flight_number}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-700">
                <div>
                  <div className="font-medium">{flight.origin}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(flight.departure_time).toLocaleString()}
                  </div>
                </div>
                <div className="text-gray-400">→</div>
                <div>
                  <div className="font-medium">{flight.destination}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(flight.arrival_time).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {flight.seats_available} seats available
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">${flight.price}</div>
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
