import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/**
 * Returns the shared Supabase client, constructing it on first use.
 *
 * The client is deliberately not created at module scope: `next build` imports
 * every route module to collect page data, and createClient() throws when the
 * config is missing, which would fail the build for anyone who has not set up
 * a .env.local yet.
 */
export function getSupabaseClient(): SupabaseClient {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and ' +
        'NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (see .env.example).'
    )
  }

  client = createClient(url, anonKey)
  return client
}

// Database Types
export interface Flight {
  id: string
  airline: string
  flight_number: string
  origin: string
  destination: string
  departure_time: string
  arrival_time: string
  price: number
  seats_available: number
}

export interface Hotel {
  id: string
  name: string
  location: string
  rating: number
  price_per_night: number
  amenities: string[]
  available_rooms: number
  image_url?: string
}

export interface CarRental {
  id: string
  company: string
  car_type: string
  location: string
  price_per_day: number
  available: boolean
}

export interface Package {
  id: string
  name: string
  description: string
  flight_id?: string
  hotel_id?: string
  car_rental_id?: string
  total_price: number
  duration_days: number
  created_at: string
}
