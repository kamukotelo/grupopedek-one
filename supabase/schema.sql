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

-- Safe additions for installations created with an older schema.
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS protocol_code VARCHAR(50);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS pickup_time TIME;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS dropoff_time TIME;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS assigned_vehicle_id UUID;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE UNIQUE INDEX IF NOT EXISTS bookings_protocol_code_idx ON public.bookings(protocol_code) WHERE protocol_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS bookings_period_idx ON public.bookings(start_date, end_date, status);
CREATE INDEX IF NOT EXISTS bookings_client_email_idx ON public.bookings(client_email);

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

-- Authenticated customer and staff profile. Demo data remains in the frontend
-- development bundle and is never inserted here automatically.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(150),
    nif VARCHAR(50),
    role VARCHAR(30) NOT NULL DEFAULT 'cliente_normal',
    tier VARCHAR(50) DEFAULT 'Standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- New public registrations always begin as regular customers. Privileged roles
-- are assigned only by an administrator through app_metadata.
CREATE OR REPLACE FUNCTION public.handle_new_customer_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, company, nif, role, tier)
    VALUES (
        NEW.id,
        COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''), split_part(COALESCE(NEW.email, 'cliente'), '@', 1)),
        NEW.raw_user_meta_data ->> 'phone',
        NEW.raw_user_meta_data ->> 'company',
        NULL,
        'cliente_normal',
        'Standard'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_pepek_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_pepek_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_customer_profile();

CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invoice_number VARCHAR(80) NOT NULL UNIQUE,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    amount_aoa NUMERIC(18,2) NOT NULL CHECK (amount_aoa >= 0),
    amount_usd NUMERIC(18,2) DEFAULT 0 CHECK (amount_usd >= 0),
    amount_eur NUMERIC(18,2) DEFAULT 0 CHECK (amount_eur >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    description TEXT NOT NULL,
    payment_gateway VARCHAR(80),
    odoo_invoice_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS amount_eur NUMERIC(18,2) DEFAULT 0 CHECK (amount_eur >= 0);

-- Unified server-owned payment ledger. Every payable product (rent-a-car,
-- transfer, route, chauffeur, event, corporate contract or invoice) is first
-- represented by an invoice; clients never choose the amount in the browser.
CREATE TABLE IF NOT EXISTS public.payment_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    category VARCHAR(40) NOT NULL CHECK (category IN ('rent_a_car', 'transfer', 'route', 'chauffeur', 'event', 'corporate', 'invoice', 'other')),
    provider VARCHAR(30) NOT NULL CHECK (provider IN ('stripe', 'multicaixa', 'bank_transfer', 'mbway')),
    currency CHAR(3) NOT NULL CHECK (currency IN ('AOA', 'USD', 'EUR')),
    amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
    status VARCHAR(30) NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'pending', 'authorized', 'paid', 'failed', 'cancelled', 'expired', 'refunded', 'partially_refunded')),
    provider_reference VARCHAR(180),
    checkout_url TEXT,
    idempotency_key UUID NOT NULL,
    client_reference VARCHAR(100) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    failure_code VARCHAR(80),
    failure_message VARCHAR(300),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, idempotency_key),
    UNIQUE(provider, provider_reference)
);
CREATE INDEX IF NOT EXISTS payment_orders_invoice_idx ON public.payment_orders(invoice_id, created_at DESC);
CREATE INDEX IF NOT EXISTS payment_orders_user_idx ON public.payment_orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS payment_orders_status_idx ON public.payment_orders(status, created_at DESC);

-- Append-only audit trail for provider callbacks and finance reconciliation.
CREATE TABLE IF NOT EXISTS public.payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_order_id UUID NOT NULL REFERENCES public.payment_orders(id) ON DELETE RESTRICT,
    provider VARCHAR(30) NOT NULL,
    provider_event_id VARCHAR(180) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload_hash CHAR(64) NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT false,
    processing_error VARCHAR(300),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(provider, provider_event_id)
);

CREATE TABLE IF NOT EXISTS public.payment_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_order_id UUID NOT NULL UNIQUE REFERENCES public.payment_orders(id) ON DELETE RESTRICT,
    receipt_number VARCHAR(100) NOT NULL UNIQUE,
    issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
    currency CHAR(3) NOT NULL,
    provider_reference VARCHAR(180) NOT NULL,
    integrity_hash CHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.fleet_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vehicle_name VARCHAR(150) NOT NULL,
    plate_number VARCHAR(50) NOT NULL,
    assigned_to VARCHAR(150),
    status VARCHAR(40) NOT NULL DEFAULT 'em_reserva',
    location VARCHAR(180),
    fuel_level INTEGER DEFAULT 0 CHECK (fuel_level BETWEEN 0 AND 100),
    mileage_km INTEGER DEFAULT 0 CHECK (mileage_km >= 0),
    driver_name VARCHAR(150),
    driver_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutional_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_assignments ENABLE ROW LEVEL SECURITY;

-- Reservations are created only by the server-side /api/reservations endpoint
-- using the service role. Anonymous browser clients receive no table access.
DROP POLICY IF EXISTS "Allow anonymous bookings insert" ON public.bookings;
REVOKE ALL ON public.bookings FROM anon;

-- Allow public read access to fleet & institutional clients
DROP POLICY IF EXISTS "Allow public read on institutional_clients" ON public.institutional_clients;
CREATE POLICY "Allow public read on institutional_clients"
    ON public.institutional_clients
    FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS "Allow public read on fleet_vehicles" ON public.fleet_vehicles;
CREATE POLICY "Allow public read on fleet_vehicles"
    ON public.fleet_vehicles
    FOR SELECT
    USING (is_available = true);

DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Users read own profile" ON public.profiles
    FOR SELECT TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- Customers may update contact fields, never role/tier authorization fields.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (full_name, phone, company, nif, updated_at) ON public.profiles TO authenticated;
DROP POLICY IF EXISTS "Users read own invoices" ON public.invoices;
CREATE POLICY "Users read own invoices" ON public.invoices
    FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Finance roles read all invoices" ON public.invoices;
CREATE POLICY "Finance roles read all invoices" ON public.invoices
    FOR SELECT TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('contabilista', 'gestor_portugal', 'direcao'));

REVOKE ALL ON public.payment_orders FROM anon, authenticated;
REVOKE ALL ON public.payment_events FROM anon, authenticated;
REVOKE ALL ON public.payment_receipts FROM anon, authenticated;
GRANT SELECT ON public.payment_orders TO authenticated;
GRANT SELECT ON public.payment_receipts TO authenticated;
DROP POLICY IF EXISTS "Users read own payment orders" ON public.payment_orders;
CREATE POLICY "Users read own payment orders" ON public.payment_orders
    FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Finance roles read all payment orders" ON public.payment_orders;
CREATE POLICY "Finance roles read all payment orders" ON public.payment_orders
    FOR SELECT TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('contabilista', 'gestor_portugal', 'direcao'));
DROP POLICY IF EXISTS "Users read own payment receipts" ON public.payment_receipts;
CREATE POLICY "Users read own payment receipts" ON public.payment_receipts
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.payment_orders payment_order
        WHERE payment_order.id = payment_order_id AND payment_order.user_id = auth.uid()
    ));
DROP POLICY IF EXISTS "Finance roles read all payment receipts" ON public.payment_receipts;
CREATE POLICY "Finance roles read all payment receipts" ON public.payment_receipts
    FOR SELECT TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('contabilista', 'gestor_portugal', 'direcao'));
DROP POLICY IF EXISTS "Users read own fleet assignments" ON public.fleet_assignments;
CREATE POLICY "Users read own fleet assignments" ON public.fleet_assignments
    FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Fleet roles read all assignments" ON public.fleet_assignments;
CREATE POLICY "Fleet roles read all assignments" ON public.fleet_assignments
    FOR SELECT TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('gestor_reservas', 'diretor_frotas', 'gestor_portugal', 'direcao'));

-- Authenticated users may read only bookings explicitly linked to their UID.
DROP POLICY IF EXISTS "Users read own bookings" ON public.bookings;
CREATE POLICY "Users read own bookings" ON public.bookings
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Operations roles read all bookings" ON public.bookings;
CREATE POLICY "Operations roles read all bookings" ON public.bookings
    FOR SELECT TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('gestor_reservas', 'diretor_frotas', 'gestor_portugal', 'direcao'));
