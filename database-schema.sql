-- AirStay Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Flights Table
CREATE TABLE flights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    airline VARCHAR(255) NOT NULL,
    flight_number VARCHAR(50) NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    seats_available INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Hotels Table
CREATE TABLE hotels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    price_per_night DECIMAL(10, 2) NOT NULL,
    amenities TEXT[],
    available_rooms INTEGER NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Car Rentals Table
CREATE TABLE car_rentals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    car_type VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Packages Table
CREATE TABLE packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    flight_id UUID REFERENCES flights(id) ON DELETE SET NULL,
    hotel_id UUID REFERENCES hotels(id) ON DELETE SET NULL,
    car_rental_id UUID REFERENCES car_rentals(id) ON DELETE SET NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    duration_days INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_flights_origin ON flights(origin);
CREATE INDEX idx_flights_destination ON flights(destination);
CREATE INDEX idx_flights_departure ON flights(departure_time);
CREATE INDEX idx_hotels_location ON hotels(location);
CREATE INDEX idx_hotels_rating ON hotels(rating);
CREATE INDEX idx_packages_created ON packages(created_at);

-- Sample Data (Optional - for testing)

-- Insert sample flights
-- Departure/arrival times are relative to CURRENT_DATE so the seed data
-- never goes stale, whenever the script is run.
INSERT INTO flights (airline, flight_number, origin, destination, departure_time, arrival_time, price, seats_available) VALUES
('Delta Airlines', 'DL123', 'New York (JFK)', 'Los Angeles (LAX)', (CURRENT_DATE + 30) + TIME '08:00', (CURRENT_DATE + 30) + TIME '11:30', 350.00, 45),
('United Airlines', 'UA456', 'Chicago (ORD)', 'Miami (MIA)', (CURRENT_DATE + 31) + TIME '14:00', (CURRENT_DATE + 31) + TIME '17:30', 280.00, 32),
('American Airlines', 'AA789', 'Boston (BOS)', 'San Francisco (SFO)', (CURRENT_DATE + 32) + TIME '09:00', (CURRENT_DATE + 32) + TIME '12:45', 420.00, 28),
('Southwest Airlines', 'SW234', 'Dallas (DFW)', 'Las Vegas (LAS)', (CURRENT_DATE + 33) + TIME '16:00', (CURRENT_DATE + 33) + TIME '17:30', 180.00, 60);

-- Insert sample hotels
INSERT INTO hotels (name, location, rating, price_per_night, amenities, available_rooms) VALUES
('Grand Plaza Hotel', 'Los Angeles, CA', 4.5, 250.00, ARRAY['WiFi', 'Pool', 'Gym', 'Spa'], 15),
('Ocean View Resort', 'Miami, FL', 4.8, 320.00, ARRAY['Beach Access', 'WiFi', 'Pool', 'Restaurant'], 8),
('Downtown Suites', 'San Francisco, CA', 4.2, 280.00, ARRAY['WiFi', 'Gym', 'Business Center'], 20),
('Desert Oasis Hotel', 'Las Vegas, NV', 4.6, 180.00, ARRAY['Casino', 'Pool', 'WiFi', 'Spa', 'Shows'], 35),
('Comfort Inn Express', 'Chicago, IL', 3.9, 120.00, ARRAY['WiFi', 'Breakfast'], 25);

-- Insert sample car rentals
INSERT INTO car_rentals (company, car_type, location, price_per_day, available) VALUES
('Hertz', 'Sedan', 'Los Angeles, CA', 45.00, true),
('Enterprise', 'SUV', 'Miami, FL', 75.00, true),
('Budget', 'Compact', 'San Francisco, CA', 35.00, true),
('Avis', 'Luxury', 'Las Vegas, NV', 95.00, true),
('National', 'Van', 'Chicago, IL', 65.00, true);

-- Insert sample packages
INSERT INTO packages (name, description, flight_id, hotel_id, car_rental_id, total_price, duration_days)
SELECT
    'LA Weekend Getaway',
    'Perfect weekend trip to Los Angeles with flight, hotel, and car rental included',
    (SELECT id FROM flights WHERE flight_number = 'DL123'),
    (SELECT id FROM hotels WHERE name = 'Grand Plaza Hotel'),
    (SELECT id FROM car_rentals WHERE company = 'Hertz' AND location = 'Los Angeles, CA'),
    995.00,
    3;

INSERT INTO packages (name, description, flight_id, hotel_id, car_rental_id, total_price, duration_days)
SELECT
    'Miami Beach Paradise',
    'Enjoy the sun and sand in Miami with complete travel package',
    (SELECT id FROM flights WHERE flight_number = 'UA456'),
    (SELECT id FROM hotels WHERE name = 'Ocean View Resort'),
    (SELECT id FROM car_rentals WHERE company = 'Enterprise' AND location = 'Miami, FL'),
    1320.00,
    5;
