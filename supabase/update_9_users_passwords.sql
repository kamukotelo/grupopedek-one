-- ==============================================================================
-- PEPEK GRUPO — ATUALIZAÇÃO / CRIAÇÃO DAS SENHAS DOS 9 UTILIZADORES NO SUPABASE
-- ==============================================================================
-- Instruções:
-- 1. Abra o Supabase Dashboard > SQL Editor.
-- 2. Substitua o marcador em 'default_password' pela senha pretendida, apenas na
--    sessão do SQL Editor. Nunca guarde a senha real neste ficheiro: ele está
--    versionado no repositório e seria publicado com ela.
-- 3. Execute o script.
--
-- Efeitos:
-- - Atualiza a senha criptografada (bcrypt via pgcrypto) em auth.users se a conta já existir.
-- - Cria a conta com email confirmado se ainda não existir.
-- - Garante o registo em auth.identities para permitir login com e-mail/senha.
-- - Atribui app_metadata.role e sincroniza a tabela public.profiles.
-- ==============================================================================

DO $$
DECLARE
    -- Marcador: substitua pela senha pretendida no SQL Editor antes de executar.
    -- Não volte a gravar a senha real neste ficheiro versionado.
    default_password TEXT := '__DEFINIR_SENHA_ANTES_DE_EXECUTAR__';
    hashed_password  TEXT;
    
    user_rec RECORD;
    v_user_id UUID;
    
    -- Definição dos 9 utilizadores oficiais
    users_data JSONB := '[
        {
            "email": "demo.vip@pepekgrupo.com",
            "role": "cliente_vip",
            "tier": "Diplomático",
            "full_name": "S. Exa. Cliente VIP Diplomático",
            "phone": "+244 923 719 090",
            "company": "Corpo Diplomático / Embaixada",
            "nif": "500000001",
            "custom_password": null
        },
        {
            "email": "demo.cliente@pepekgrupo.com",
            "role": "cliente_normal",
            "tier": "Standard",
            "full_name": "Cliente Particular / PME",
            "phone": "+244 923 719 090",
            "company": "Empresa Parceira PME",
            "nif": "500000002",
            "custom_password": null
        },
        {
            "email": "comercial@pepekgrupo.com",
            "role": "vendedor",
            "tier": "Administrativo",
            "full_name": "Consultora Comercial Sénior",
            "phone": "+244 923 719 090",
            "company": "PEPEK GRUPO RENT-A-CAR",
            "nif": null,
            "custom_password": null
        },
        {
            "email": "reservas@pepekgrupo.com",
            "role": "gestor_reservas",
            "tier": "Administrativo",
            "full_name": "Gestora de Reservas & Despacho",
            "phone": "+244 923 719 090",
            "company": "PEPEK GRUPO — Central de Reservas",
            "nif": null,
            "custom_password": null
        },
        {
            "email": "operacoes@pepekgrupo.com",
            "role": "diretor_frotas",
            "tier": "Administrativo",
            "full_name": "Director de Frotas & Operações",
            "phone": "+244 923 000 010",
            "company": "PEPEK GRUPO — Talatona Hub",
            "nif": null,
            "custom_password": null
        },
        {
            "email": "motorista.demo@pepekgrupo.com",
            "role": "motorista",
            "tier": "Administrativo",
            "full_name": "Motorista Protocolar de Serviço",
            "phone": "+244 923 719 090",
            "company": "PEPEK GRUPO — Operações",
            "nif": null,
            "custom_password": null
        },
        {
            "email": "financas@pepekgrupo.com",
            "role": "contabilista",
            "tier": "Administrativo",
            "full_name": "Responsável de Contabilidade",
            "phone": "+244 923 719 090",
            "company": "PEPEK GRUPO — Finanças",
            "nif": null,
            "custom_password": null
        },
        {
            "email": "portugal.demo@pepekgrupo.com",
            "role": "gestor_portugal",
            "tier": "Administrativo",
            "full_name": "Gestora de Clientes Portugal",
            "phone": "+351 910 000 000",
            "company": "PEPEK GRUPO — Apoio Internacional",
            "nif": null,
            "custom_password": null
        },
        {
            "email": "administracao@pepekgrupo.com",
            "role": "direcao",
            "tier": "Administrativo",
            "full_name": "Direcção Geral Executiva",
            "phone": "+244 923 719 090",
            "company": "PEPEK GRUPO — Direcção Geral",
            "nif": null,
            "custom_password": null
        }
    ]';

BEGIN
    IF default_password = '__DEFINIR_SENHA_ANTES_DE_EXECUTAR__' THEN
        RAISE EXCEPTION 'Substitua o marcador em default_password pela senha pretendida antes de executar.';
    END IF;

    IF length(default_password) < 12 THEN
        RAISE EXCEPTION 'Use uma senha com pelo menos 12 caracteres.';
    END IF;

    -- Assegura disponibilidade da extensão pgcrypto
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    FOR user_rec IN SELECT * FROM jsonb_to_recordset(users_data) AS x(
        email TEXT,
        role TEXT,
        tier TEXT,
        full_name TEXT,
        phone TEXT,
        company TEXT,
        nif TEXT,
        custom_password TEXT
    )
    LOOP
        -- Calcula o hash bcrypt da senha especificada ou da senha padrão
        hashed_password := crypt(COALESCE(user_rec.custom_password, default_password), gen_salt('bf', 10));

        -- Verifica se o utilizador já existe em auth.users
        SELECT id INTO v_user_id FROM auth.users WHERE email = user_rec.email;

        IF v_user_id IS NOT NULL THEN
            -- Atualiza senha, confirmação de email e metadata em auth.users
            UPDATE auth.users
            SET encrypted_password = hashed_password,
                email_confirmed_at = COALESCE(email_confirmed_at, now()),
                raw_app_meta_data = jsonb_build_object(
                    'provider', 'email',
                    'providers', array['email'],
                    'role', user_rec.role
                ),
                raw_user_meta_data = jsonb_build_object(
                    'full_name', user_rec.full_name,
                    'phone', user_rec.phone,
                    'company', user_rec.company,
                    'tier', user_rec.tier,
                    'nif', user_rec.nif
                ),
                updated_at = now()
            WHERE id = v_user_id;

            RAISE NOTICE 'Utilizador atualizado: % (Role: %)', user_rec.email, user_rec.role;
        ELSE
            -- Cria novo utilizador em auth.users
            v_user_id := gen_random_uuid();

            INSERT INTO auth.users (
                id,
                instance_id,
                email,
                encrypted_password,
                email_confirmed_at,
                raw_app_meta_data,
                raw_user_meta_data,
                role,
                aud,
                created_at,
                updated_at
            )
            VALUES (
                v_user_id,
                '00000000-0000-0000-0000-000000000000',
                user_rec.email,
                hashed_password,
                now(),
                jsonb_build_object(
                    'provider', 'email',
                    'providers', array['email'],
                    'role', user_rec.role
                ),
                jsonb_build_object(
                    'full_name', user_rec.full_name,
                    'phone', user_rec.phone,
                    'company', user_rec.company,
                    'tier', user_rec.tier,
                    'nif', user_rec.nif
                ),
                'authenticated',
                'authenticated',
                now(),
                now()
            );

            RAISE NOTICE 'Utilizador criado: % (Role: %)', user_rec.email, user_rec.role;
        END IF;

        -- Garante registo em auth.identities para login por e-mail e palavra-passe
        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            provider_id,
            last_sign_in_at,
            created_at,
            updated_at
        )
        VALUES (
            v_user_id::text,
            v_user_id,
            jsonb_build_object('sub', v_user_id::text, 'email', user_rec.email),
            'email',
            user_rec.email,
            now(),
            now(),
            now()
        )
        ON CONFLICT (provider, provider_id) DO UPDATE
        SET identity_data = jsonb_build_object('sub', v_user_id::text, 'email', user_rec.email),
            updated_at = now();

        -- Sincroniza tabela public.profiles
        INSERT INTO public.profiles (
            id,
            full_name,
            phone,
            company,
            nif,
            role,
            tier,
            updated_at
        )
        VALUES (
            v_user_id,
            user_rec.full_name,
            user_rec.phone,
            user_rec.company,
            user_rec.nif,
            user_rec.role,
            user_rec.tier,
            now()
        )
        ON CONFLICT (id) DO UPDATE
        SET full_name = EXCLUDED.full_name,
            phone = EXCLUDED.phone,
            company = EXCLUDED.company,
            nif = EXCLUDED.nif,
            role = EXCLUDED.role,
            tier = EXCLUDED.tier,
            updated_at = now();

    END LOOP;

    RAISE NOTICE 'Processamento concluído com sucesso para os 9 utilizadores.';
END $$;
