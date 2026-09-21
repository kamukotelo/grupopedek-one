#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// -----------------------------------------------------------------------------
// Carrega variáveis do ficheiro .env se existirem localmente
// -----------------------------------------------------------------------------
const loadEnvFile = () => {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx <= 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
};

loadEnvFile();

const USERS = [
  {
    email: 'demo.vip@pepekgrupo.com',
    role: 'cliente_vip',
    roleLabel: 'Cliente VIP Diplomático',
    tier: 'Diplomático',
    fullName: 'S. Exa. Cliente VIP Diplomático',
    phone: '+244 923 719 090',
    company: 'Corpo Diplomático / Embaixada',
    nif: '500000001',
  },
  {
    email: 'demo.cliente@pepekgrupo.com',
    role: 'cliente_normal',
    roleLabel: 'Cliente PME / Particular',
    tier: 'Standard',
    fullName: 'Cliente Particular / PME',
    phone: '+244 923 719 090',
    company: 'Empresa Parceira PME',
    nif: '500000002',
  },
  {
    email: 'comercial@pepekgrupo.com',
    role: 'vendedor',
    roleLabel: 'Consultor Comercial Sénior',
    tier: 'Administrativo',
    fullName: 'Consultora Comercial Sénior',
    phone: '+244 923 719 090',
    company: 'PEPEK GRUPO RENT-A-CAR',
    nif: null,
  },
  {
    email: 'reservas@pepekgrupo.com',
    role: 'gestor_reservas',
    roleLabel: 'Gestor de Reservas & Despacho',
    tier: 'Administrativo',
    fullName: 'Gestora de Reservas & Despacho',
    phone: '+244 923 719 090',
    company: 'PEPEK GRUPO — Central de Reservas',
    nif: null,
  },
  {
    email: 'operacoes@pepekgrupo.com',
    role: 'diretor_frotas',
    roleLabel: 'Director de Frotas & Operações',
    tier: 'Administrativo',
    fullName: 'Director de Frotas & Operações',
    phone: '+244 923 000 010',
    company: 'PEPEK GRUPO — Talatona Hub',
    nif: null,
  },
  {
    email: 'motorista.demo@pepekgrupo.com',
    role: 'motorista',
    roleLabel: 'Motorista Protocolar',
    tier: 'Administrativo',
    fullName: 'Motorista Protocolar de Serviço',
    phone: '+244 923 719 090',
    company: 'PEPEK GRUPO — Operações',
    nif: null,
  },
  {
    email: 'financas@pepekgrupo.com',
    role: 'contabilista',
    roleLabel: 'Responsável de Contabilidade',
    tier: 'Administrativo',
    fullName: 'Responsável de Contabilidade',
    phone: '+244 923 719 090',
    company: 'PEPEK GRUPO — Finanças',
    nif: null,
  },
  {
    email: 'portugal.demo@pepekgrupo.com',
    role: 'gestor_portugal',
    roleLabel: 'Gestora de Clientes Portugal',
    tier: 'Administrativo',
    fullName: 'Gestora de Clientes Portugal',
    phone: '+351 910 000 000',
    company: 'PEPEK GRUPO — Apoio Internacional',
    nif: null,
  },
  {
    email: 'administracao@pepekgrupo.com',
    role: 'direcao',
    roleLabel: 'Direcção Geral Executiva',
    tier: 'Administrativo',
    fullName: 'Direcção Geral Executiva',
    phone: '+244 923 719 090',
    company: 'PEPEK GRUPO — Direcção Geral',
    nif: null,
  },
];

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    password: process.env.USERS_PASSWORD || '',
    dryRun: false,
  };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dry-run') options.dryRun = true;
    if (args[i] === '--password' && args[i + 1]) {
      options.password = args[i + 1];
      i++;
    }
  }
  return options;
};

async function main() {
  const options = parseArgs();
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('='.repeat(72));
  console.log('  PEPEK GRUPO — ATUALIZADOR DE SENHAS (9 UTILIZADORES)');
  console.log('='.repeat(72));

  if (!supabaseUrl) {
    console.error('\n❌ Erro: SUPABASE_URL não configurada no ambiente nem em .env');
    process.exit(1);
  }

  if (!options.password) {
    console.error('\n❌ Erro: senha não definida. Não existe senha por omissão — uma credencial');
    console.error('   escrita no código seria publicada no repositório.');
    console.error('   Defina USERS_PASSWORD no ambiente ou passe --password "<senha>".');
    process.exit(1);
  }

  if (options.password.length < 12) {
    console.error('\n❌ Erro: use uma senha com pelo menos 12 caracteres.');
    process.exit(1);
  }

  if (!serviceKey) {
    console.error('\n⚠️  Aviso: SUPABASE_SERVICE_ROLE_KEY não está definida no ficheiro .env');
    console.error('   Para executar esta operação diretamente via API:');
    console.error('   1. Obtenha a chave privada em: Supabase Dashboard > Project Settings > API > service_role');
    console.error('   2. Adicione ao .env: SUPABASE_SERVICE_ROLE_KEY="sua_chave_aqui"');
    console.error('   3. Ou execute via SQL usando o ficheiro: supabase/update_9_users_passwords.sql\n');
    console.log('Lista dos 9 utilizadores a atualizar:');
    for (const u of USERS) {
      console.log(`  - [${u.role.padEnd(16)}] ${u.email.padEnd(30)} (${u.fullName})`);
    }
    console.log('\nSenha alvo: (definida por USERS_PASSWORD / --password, não é impressa)');
    process.exit(1);
  }

  if (options.dryRun) {
    console.log('\n[MODO DRY-RUN ATIVADO — Nenhuma alteração será gravada]');
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`\nLigando ao Supabase: ${supabaseUrl}`);
  console.log(`Senha configurada para os utilizadores: ${'*'.repeat(options.password.length)} (${options.password.length} caracteres)\n`);

  // Busca lista de utilizadores existentes no Supabase Auth
  const { data: authUsersData, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listError) {
    console.error(`❌ Erro ao listar utilizadores no Supabase Auth: ${listError.message}`);
    process.exit(1);
  }

  const existingByEmail = new Map(
    authUsersData.users.map((u) => [u.email?.toLowerCase(), u])
  );

  const results = [];

  for (const target of USERS) {
    const emailKey = target.email.toLowerCase();
    const existing = existingByEmail.get(emailKey);
    let userId = existing?.id;
    let action = '';

    if (existing) {
      action = 'ATUALIZAR_SENHA';
      if (!options.dryRun) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
          password: options.password,
          email_confirm: true,
          app_metadata: { role: target.role, provider: 'email', providers: ['email'] },
          user_metadata: {
            full_name: target.fullName,
            phone: target.phone,
            company: target.company,
            tier: target.tier,
            nif: target.nif,
          },
        });
        if (updateError) {
          results.push({ email: target.email, role: target.role, status: `ERRO: ${updateError.message}` });
          continue;
        }
      }
    } else {
      action = 'CRIAR_UTILIZADOR';
      if (!options.dryRun) {
        const { data: createData, error: createError } = await supabase.auth.admin.createUser({
          email: target.email,
          password: options.password,
          email_confirm: true,
          app_metadata: { role: target.role, provider: 'email', providers: ['email'] },
          user_metadata: {
            full_name: target.fullName,
            phone: target.phone,
            company: target.company,
            tier: target.tier,
            nif: target.nif,
          },
        });
        if (createError) {
          results.push({ email: target.email, role: target.role, status: `ERRO: ${createError.message}` });
          continue;
        }
        userId = createData.user.id;
      }
    }

    // Sincroniza tabela public.profiles
    if (!options.dryRun && userId) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        full_name: target.fullName,
        phone: target.phone,
        company: target.company,
        nif: target.nif,
        role: target.role,
        tier: target.tier,
        updated_at: new Date().toISOString(),
      });
      if (profileError) {
        results.push({ email: target.email, role: target.role, status: `Perfil com aviso: ${profileError.message}` });
        continue;
      }
    }

    results.push({
      email: target.email,
      role: target.role,
      status: options.dryRun ? `[DRY-RUN] ${action}` : (action === 'ATUALIZAR_SENHA' ? 'Senha atualizada' : 'Criado com sucesso'),
    });
  }

  console.log('-'.repeat(72));
  console.log('RESULTADO DO PROCESSAMENTO:');
  console.log('-'.repeat(72));
  for (const r of results) {
    console.log(`  ${r.email.padEnd(32)} | ${r.role.padEnd(16)} | ${r.status}`);
  }
  console.log('-'.repeat(72));
  console.log(`Total processado: ${results.length} utilizadores.`);
  console.log('='.repeat(72));
}

main().catch((err) => {
  console.error('\nErro fatal durante execução:', err);
  process.exit(1);
});
