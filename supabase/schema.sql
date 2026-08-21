-- ═══════════════════════════════════════════════════════════════
-- PEPEK GRUPO RENT-A-CAR — Supabase PostgreSQL Schema
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: Bookings & Leads
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    destination VARCHAR(150),
    start_date DATE,
    end_date DATE,
    vehicle_category VARCHAR(100),
    with_driver BOOLEAN DEFAULT true,
    client_name VARCHAR(150) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    client_email VARCHAR(150),
    company_name VARCHAR(150),
    flight_number VARCHAR(50),
    passengers_count INTEGER DEFAULT 2,
    notes TEXT,
    status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'contacted', 'confirmed', 'cancelled'
    source VARCHAR(50) DEFAULT 'web',
    crm_lead_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Institutional Clients (for dynamic updates if needed)
CREATE TABLE IF NOT EXISTS public.institutional_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Fleet Vehicles
CREATE TABLE IF NOT EXISTS public.fleet_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'suv', '4x4', 'van', 'protocol'
    transmission VARCHAR(50),
    passengers INTEGER DEFAULT 5,
    luggage INTEGER DEFAULT 4,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutional_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_vehicles ENABLE ROW LEVEL SECURITY;

-- Allow anonymous bookings insert from the web application
CREATE POLICY "Allow anonymous bookings insert"
    ON public.bookings
    FOR INSERT
    WITH CHECK (true);

-- Allow public read access to fleet & institutional clients
CREATE POLICY "Allow public read on institutional_clients"
    ON public.institutional_clients
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Allow public read on fleet_vehicles"
    ON public.fleet_vehicles
    FOR SELECT
    USING (is_available = true);
