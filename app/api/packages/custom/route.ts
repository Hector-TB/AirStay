import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { preferences } = body

    // Call ML model to generate custom package
    const packageModelUrl = process.env.NEXT_PUBLIC_PACKAGE_MODEL_URL

    if (!packageModelUrl) {
      // Fallback: Create a simple package without ML if model URL not configured
      console.warn('Package ML model URL not configured, creating basic package')

      // Get random flight, hotel, and car rental
      const { data: flights } = await supabase.from('flights').select('*').limit(1)
      const { data: hotels } = await supabase.from('hotels').select('*').limit(1)
      const { data: carRentals } = await supabase.from('car_rentals').select('*').limit(1)

      const flight = flights?.[0]
      const hotel = hotels?.[0]
      const car = carRentals?.[0]

      const totalPrice = (flight?.price || 0) + (hotel?.price_per_night || 0) * 3 + (car?.price_per_day || 0) * 3

      const { data: newPackage, error } = await supabase
        .from('packages')
        .insert({
          name: 'Custom Package',
          description: `Personalized package based on your preferences: ${preferences || 'default'}`,
          flight_id: flight?.id,
          hotel_id: hotel?.id,
          car_rental_id: car?.id,
          total_price: totalPrice,
          duration_days: 3,
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json(newPackage)
    }

    // Call ML model for personalized package generation
    const mlResponse = await axios.post(packageModelUrl, {
      user_preferences: preferences,
      timestamp: new Date().toISOString(),
    })

    const packageRecommendation = mlResponse.data

    // Create package based on ML recommendation
    const { data: newPackage, error } = await supabase
      .from('packages')
      .insert({
        name: packageRecommendation.name || 'Custom ML Package',
        description: packageRecommendation.description || 'AI-generated package',
        flight_id: packageRecommendation.flight_id,
        hotel_id: packageRecommendation.hotel_id,
        car_rental_id: packageRecommendation.car_rental_id,
        total_price: packageRecommendation.total_price,
        duration_days: packageRecommendation.duration_days || 3,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(newPackage)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate custom package' },
      { status: 500 }
    )
  }
}
