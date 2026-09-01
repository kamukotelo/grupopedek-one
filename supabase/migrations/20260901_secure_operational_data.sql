-- PEPEK GRUPO — camada de dados protegidos
-- Data: 2026-09-01
-- Execute no SQL Editor do Supabase antes de ativar PORTAL_DATA_FROM_API=true.

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

-- Configurações operacionais sem segredos. Tokens, palavras-passe e chaves de
-- API devem permanecer em Supabase Vault ou nas variáveis privadas da Vercel.
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

CREATE TABLE IF NOT EXISTS public.operational_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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

CREATE TABLE IF NOT EXISTS public.odoo_sync_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('PEPEK_TO_ODOO', 'ODOO_TO_PEPEK')),
    reference TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('success', 'warning', 'failed')),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    details JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Cenários de demonstração deixam de ser compilados no frontend. Esta tabela
-- é acessível somente pela service role através de um endpoint de staging.
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

ALTER TABLE public.operational_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.odoo_sync_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.operational_records FROM anon, authenticated;
REVOKE ALL ON public.odoo_sync_events FROM anon, authenticated;
GRANT SELECT ON public.operational_records TO authenticated;
GRANT SELECT ON public.odoo_sync_events TO authenticated;

DROP POLICY IF EXISTS "Users read linked operational records" ON public.operational_records;
CREATE POLICY "Users read linked operational records"
    ON public.operational_records FOR SELECT TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Operations roles read operational records" ON public.operational_records;
CREATE POLICY "Operations roles read operational records"
    ON public.operational_records FOR SELECT TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN
      ('gestor_reservas', 'diretor_frotas', 'gestor_portugal', 'direcao'));

DROP POLICY IF EXISTS "Odoo roles read sync events" ON public.odoo_sync_events;
CREATE POLICY "Odoo roles read sync events"
    ON public.odoo_sync_events FOR SELECT TO authenticated
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN
      ('gestor_reservas', 'diretor_frotas', 'contabilista', 'gestor_portugal', 'direcao'));

CREATE INDEX IF NOT EXISTS operational_records_user_idx
    ON public.operational_records(user_id, scheduled_at DESC);
CREATE INDEX IF NOT EXISTS operational_records_status_idx
    ON public.operational_records(status, scheduled_at DESC);
CREATE INDEX IF NOT EXISTS odoo_sync_events_time_idx
    ON public.odoo_sync_events(occurred_at DESC);

-- Confirma que o browser não consegue consultar o schema privado, mesmo que
-- uma futura configuração do PostgREST seja alterada inadvertidamente.
REVOKE ALL ON ALL TABLES IN SCHEMA private FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA private
    REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;
