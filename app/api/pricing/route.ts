import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { item_type, item_id, features } = body

    const pricingModelUrl = process.env.NEXT_PUBLIC_PRICING_MODEL_URL

    if (!pricingModelUrl) {
      return NextResponse.json(
        { error: 'Pricing model URL not configured' },
        { status: 500 }
      )
    }

    // Call ML model for dynamic pricing
    const mlResponse = await axios.post(pricingModelUrl, {
      item_type,
      item_id,
      features,
      timestamp: new Date().toISOString(),
    })

    const pricingData = mlResponse.data

    return NextResponse.json({
      predicted_price: pricingData.predicted_price,
      confidence: pricingData.confidence,
      factors: pricingData.factors,
    })
  } catch (error) {
    console.error('Pricing API error:', error)
    return NextResponse.json(
      { error: 'Failed to get pricing prediction' },
      { status: 500 }
    )
  }
}
