-- PEPEK GRUPO RENT-A-CAR — Neon PostgreSQL schema
-- Managed Better Auth: neon_auth.user
-- Data API roles: anonymous / authenticated

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS private;

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol_code VARCHAR(50) UNIQUE,
    service VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    destination VARCHAR(150),
    start_date DATE,
    end_date DATE,
    pickup_time TIME,
    dropoff_time TIME,
    vehicle_category VARCHAR(150),
    assigned_vehicle_id UUID,
    with_driver BOOLEAN NOT NULL DEFAULT true,
    client_name VARCHAR(150) NOT NULL,
    client_phone VARCHAR(50),
    client_email VARCHAR(150),
    company_name VARCHAR(150),
    flight_number VARCHAR(50),
    passengers_count INTEGER DEFAULT 2 CHECK (passengers_count BETWEEN 1 AND 100),
    notes TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'contacted', 'confirmed', 'cancelled')),
    source VARCHAR(50) NOT NULL DEFAULT 'web',
    crm_lead_id VARCHAR(50),
    user_id UUID REFERENCES neon_auth."user"(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
    CHECK (NULLIF(btrim(client_phone), '') IS NOT NULL OR NULLIF(btrim(client_email), '') IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS bookings_protocol_code_idx
    ON public.bookings(protocol_code) WHERE protocol_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS bookings_period_idx ON public.bookings(start_date, end_date, status);
CREATE INDEX IF NOT EXISTS bookings_client_email_idx ON public.bookings(client_email);

CREATE TABLE IF NOT EXISTS public.institutional_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fleet_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    transmission VARCHAR(50),
    passengers INTEGER NOT NULL DEFAULT 5,
    luggage INTEGER NOT NULL DEFAULT 4,
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(150),
    nif VARCHAR(50),
    role VARCHAR(30) NOT NULL DEFAULT 'cliente_normal',
    tier VARCHAR(50) NOT NULL DEFAULT 'Standard',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
    invoice_number VARCHAR(80) NOT NULL UNIQUE,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    amount_aoa NUMERIC(18,2) NOT NULL CHECK (amount_aoa >= 0),
    amount_usd NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (amount_usd >= 0),
    amount_eur NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (amount_eur >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    description TEXT NOT NULL,
    payment_gateway VARCHAR(80),
    odoo_invoice_id VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payment_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES neon_auth."user"(id) ON DELETE RESTRICT,
    category VARCHAR(40) NOT NULL
        CHECK (category IN ('rent_a_car', 'transfer', 'route', 'chauffeur', 'event', 'corporate', 'invoice', 'other')),
    provider VARCHAR(30) NOT NULL
        CHECK (provider IN ('stripe', 'multicaixa', 'bank_transfer', 'mbway')),
    currency CHAR(3) NOT NULL CHECK (currency IN ('AOA', 'USD', 'EUR')),
    amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
    status VARCHAR(30) NOT NULL DEFAULT 'created'
        CHECK (status IN ('created', 'pending', 'authorized', 'paid', 'failed', 'cancelled', 'expired', 'refunded', 'partially_refunded')),
    provider_reference VARCHAR(180),
    checkout_url TEXT,
    idempotency_key UUID NOT NULL,
    client_reference VARCHAR(100) NOT NULL,
    expires_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    failure_code VARCHAR(80),
    failure_message VARCHAR(300),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, idempotency_key),
    UNIQUE(provider, provider_reference)
);

CREATE INDEX IF NOT EXISTS payment_orders_invoice_idx ON public.payment_orders(invoice_id, created_at DESC);
CREATE INDEX IF NOT EXISTS payment_orders_user_idx ON public.payment_orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS payment_orders_status_idx ON public.payment_orders(status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_order_id UUID NOT NULL REFERENCES public.payment_orders(id) ON DELETE RESTRICT,
    provider VARCHAR(30) NOT NULL,
    provider_event_id VARCHAR(180) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload_hash CHAR(64) NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT false,
    processing_error VARCHAR(300),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(provider, provider_event_id)
);

CREATE TABLE IF NOT EXISTS public.payment_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_order_id UUID NOT NULL UNIQUE REFERENCES public.payment_orders(id) ON DELETE RESTRICT,
    receipt_number VARCHAR(100) NOT NULL UNIQUE,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
    currency CHAR(3) NOT NULL CHECK (currency IN ('AOA', 'USD', 'EUR')),
    provider_reference VARCHAR(180) NOT NULL,
    integrity_hash CHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.fleet_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
    vehicle_name VARCHAR(150) NOT NULL,
    plate_number VARCHAR(50) NOT NULL,
    assigned_to VARCHAR(150),
    status VARCHAR(40) NOT NULL DEFAULT 'em_reserva',
    location VARCHAR(180),
    fuel_level INTEGER NOT NULL DEFAULT 0 CHECK (fuel_level BETWEEN 0 AND 100),
    mileage_km INTEGER NOT NULL DEFAULT 0 CHECK (mileage_km >= 0),
    driver_name VARCHAR(150),
    driver_phone VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.operational_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES neon_auth."user"(id) ON DELETE SET NULL,
    record_type TEXT NOT NULL CHECK (record_type IN ('reserva', 'despacho', 'motorista', 'manutencao', 'contrato')),
    reference TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    owner_name TEXT,
    location TEXT,
    scheduled_at TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('confirmado', 'em_execucao', 'pendente', 'concluido', 'atencao')),
    odoo_model TEXT,
    odoo_record_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS operational_records_user_idx
    ON public.operational_records(user_id, scheduled_at DESC);
CREATE INDEX IF NOT EXISTS operational_records_status_idx
    ON public.operational_records(status, scheduled_at DESC);

CREATE TABLE IF NOT EXISTS public.odoo_sync_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('PEPEK_TO_ODOO', 'ODOO_TO_PEPEK')),
    reference TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('success', 'warning', 'failed')),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    details JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS odoo_sync_events_time_idx ON public.odoo_sync_events(occurred_at DESC);

CREATE TABLE IF NOT EXISTS private.integration_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_key TEXT NOT NULL UNIQUE,
    environment TEXT NOT NULL DEFAULT 'production',
    endpoint_label TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT false,
    last_health_status TEXT NOT NULL DEFAULT 'not_configured',
    last_health_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS private.demo_scenarios (
    role_key TEXT PRIMARY KEY,
    profile JSONB NOT NULL,
    invoices JSONB NOT NULL DEFAULT '[]'::jsonb,
    fleet_telemetry JSONB NOT NULL DEFAULT '[]'::jsonb,
    operational_records JSONB NOT NULL DEFAULT '[]'::jsonb,
    odoo_events JSONB NOT NULL DEFAULT '[]'::jsonb,
    odoo_status JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutional_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operational_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.odoo_sync_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anonymous, authenticated;
GRANT USAGE ON SCHEMA public TO anonymous, authenticated;
GRANT SELECT ON public.institutional_clients, public.fleet_vehicles TO anonymous, authenticated;
GRANT SELECT ON public.profiles, public.invoices, public.payment_orders,
    public.payment_receipts, public.fleet_assignments, public.bookings,
    public.operational_records, public.odoo_sync_events TO authenticated;
GRANT INSERT ON public.profiles TO authenticated;
GRANT UPDATE (full_name, phone, company, nif, updated_at) ON public.profiles TO authenticated;

CREATE POLICY "Public reads active institutional clients" ON public.institutional_clients
    FOR SELECT TO anonymous, authenticated USING (is_active = true);
CREATE POLICY "Public reads available fleet" ON public.fleet_vehicles
    FOR SELECT TO anonymous, authenticated USING (is_available = true);

CREATE POLICY "Users read own profile" ON public.profiles
    FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users create own profile" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (id = auth.uid() AND role = 'cliente_normal' AND tier = 'Standard');
CREATE POLICY "Users update own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Users read own invoices" ON public.invoices
    FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Finance roles read all invoices" ON public.invoices
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles profile
        WHERE profile.id = auth.uid()
          AND profile.role IN ('contabilista', 'gestor_portugal', 'direcao')
    ));

CREATE POLICY "Users read own payment orders" ON public.payment_orders
    FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Finance roles read all payment orders" ON public.payment_orders
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles profile
        WHERE profile.id = auth.uid()
          AND profile.role IN ('contabilista', 'gestor_portugal', 'direcao')
    ));

CREATE POLICY "Users read own payment receipts" ON public.payment_receipts
    FOR SELECT TO authenticated USING (EXISTS (
        SELECT 1 FROM public.payment_orders payment_order
        WHERE payment_order.id = payment_order_id AND payment_order.user_id = auth.uid()
    ));
CREATE POLICY "Finance roles read all payment receipts" ON public.payment_receipts
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles profile
        WHERE profile.id = auth.uid()
          AND profile.role IN ('contabilista', 'gestor_portugal', 'direcao')
    ));

CREATE POLICY "Users read own fleet assignments" ON public.fleet_assignments
    FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Fleet roles read all assignments" ON public.fleet_assignments
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles profile
        WHERE profile.id = auth.uid()
          AND profile.role IN ('gestor_reservas', 'diretor_frotas', 'gestor_portugal', 'direcao')
    ));

CREATE POLICY "Users read own bookings" ON public.bookings
    FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Operations roles read all bookings" ON public.bookings
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles profile
        WHERE profile.id = auth.uid()
          AND profile.role IN ('gestor_reservas', 'diretor_frotas', 'gestor_portugal', 'direcao')
    ));

CREATE POLICY "Users read linked operational records" ON public.operational_records
    FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Operations roles read operational records" ON public.operational_records
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles profile
        WHERE profile.id = auth.uid()
          AND profile.role IN ('gestor_reservas', 'diretor_frotas', 'gestor_portugal', 'direcao')
    ));

CREATE POLICY "Odoo roles read sync events" ON public.odoo_sync_events
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles profile
        WHERE profile.id = auth.uid()
          AND profile.role IN ('gestor_reservas', 'diretor_frotas', 'contabilista', 'gestor_portugal', 'direcao')
    ));

REVOKE ALL ON SCHEMA private FROM PUBLIC, anonymous, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA private FROM PUBLIC, anonymous, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA private
    REVOKE ALL ON TABLES FROM PUBLIC, anonymous, authenticated;
