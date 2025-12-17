# AirStay - Travel Booking Platform

A simple, modern travel application for booking flights, hotels, and travel packages. Built with Next.js, TypeScript, Tailwind CSS, and Supabase, with ML-powered pricing and package recommendations.

## Features

- **Flight Search**: Browse and search available flights by origin, destination, and airline
- **Hotel Booking**: Find hotels with ratings, amenities, and location filtering
- **Travel Packages**: Combine flights, hotels, and car rentals into convenient packages
- **ML-Powered Features**:
  - Dynamic pricing predictions for flights and hotels
  - Custom package generation based on user preferences
- **Simple, Clean UI**: Built with Tailwind CSS for a responsive experience

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **ML Integration**: REST API endpoints for pricing and package models

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install
```

### 2. Set Up Supabase Database

1. Create a new project in [Supabase](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL script from `database-schema.sql` to create tables and sample data
4. Copy your Supabase URL and anon key from Project Settings > API

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# ML Model Endpoints (optional - app works without these)
NEXT_PUBLIC_PRICING_MODEL_URL=your_pricing_model_url
NEXT_PUBLIC_PACKAGE_MODEL_URL=your_package_model_url
```

**Note**: The application will work without ML model URLs configured. The package generation will fall back to a simple random selection.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## ML Model Integration

### Pricing Model API

The pricing model should accept POST requests with this format:

```json
{
  "item_type": "flight" | "hotel",
  "item_id": "uuid",
  "features": {},
  "timestamp": "2024-12-17T00:00:00Z"
}
```

Expected response:

```json
{
  "predicted_price": 350.00,
  "confidence": 0.92,
  "factors": ["demand", "seasonality"]
}
```

### Package Recommendation Model API

The package model should accept POST requests with this format:

```json
{
  "user_preferences": "beach vacation",
  "timestamp": "2024-12-17T00:00:00Z"
}
```

Expected response:

```json
{
  "name": "Custom Package Name",
  "description": "Package description",
  "flight_id": "uuid",
  "hotel_id": "uuid",
  "car_rental_id": "uuid",
  "total_price": 1250.00,
  "duration_days": 5
}
```

## Database Schema

### Tables

- **flights**: Flight information including airline, route, times, and pricing
- **hotels**: Hotel details with ratings, amenities, and availability
- **car_rentals**: Car rental options by location and type
- **packages**: Pre-built travel packages combining multiple services

See `database-schema.sql` for the complete schema definition.

## Project Structure

```
AirStay/
├── app/
│   ├── api/              # API routes
│   │   ├── flights/      # Flight endpoints
│   │   ├── hotels/       # Hotel endpoints
│   │   ├── packages/     # Package endpoints
│   │   └── pricing/      # ML pricing endpoint
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/           # React components
│   ├── FlightList.tsx
│   ├── HotelList.tsx
│   ├── PackageList.tsx
│   └── SearchBar.tsx
├── lib/
│   └── supabase.ts       # Supabase client and types
├── database-schema.sql   # Database setup script
└── package.json
```

## API Endpoints

- `GET /api/flights?search=query` - Get all flights with optional search
- `GET /api/hotels?search=query` - Get all hotels with optional search
- `GET /api/packages?search=query` - Get all packages with optional search
- `POST /api/packages/custom` - Generate custom package using ML
- `POST /api/pricing` - Get ML-powered pricing prediction

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Next Steps

1. Add user authentication with Supabase Auth
2. Implement booking confirmation and payment processing
3. Add date range pickers for flexible search
4. Create user dashboard for managing bookings
5. Implement real-time availability updates
6. Add reviews and ratings system
7. Enhance ML models with more features

## License

MIT
