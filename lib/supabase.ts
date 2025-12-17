import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
