import { neon } from '@neondatabase/serverless';
import { createRemoteJWKSet, jwtVerify } from 'jose';

let database;
let jwks;

export const getDatabase = () => {
  if (process.env.NODE_ENV === 'test' && globalThis.__PEPEK_NEON_TEST_DATABASE__) {
    return globalThis.__PEPEK_NEON_TEST_DATABASE__;
  }
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('Neon não configurado');
  if (!database) database = neon(connectionString);
  return database;
};

const getJwks = () => {
  const url = process.env.NEON_AUTH_JWKS_URL;
  if (!url) throw new Error('Neon Auth não configurado');
  if (!jwks) jwks = createRemoteJWKSet(new URL(url));
  return jwks;
};

export const authenticateNeonRequest = async (req) => {
  if (process.env.NODE_ENV === 'test' && globalThis.__PEPEK_NEON_TEST_USER__) {
    return globalThis.__PEPEK_NEON_TEST_USER__;
  }
  const authorization = String(req.headers.authorization || '');
  if (!authorization.startsWith('Bearer ')) throw new Error('Autenticação necessária');
  const token = authorization.slice(7).trim();
  if (!token) throw new Error('Autenticação necessária');

  let payload;
  try {
    ({ payload } = await jwtVerify(token, getJwks()));
  } catch {
    throw new Error('Sessão inválida');
  }
  const id = String(payload.sub || '');
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error('Sessão inválida');

  const sql = getDatabase();
  const [profile] = await sql.query(
    'SELECT full_name, phone, company, nif, role, tier FROM public.profiles WHERE id = $1 LIMIT 1',
    [id],
  );
  return {
    id,
    email: typeof payload.email === 'string' ? payload.email : '',
    profile: profile || null,
    app_metadata: { role: profile?.role || 'cliente_normal' },
  };
};

export const isUniqueViolation = (error) => String(error?.code || '') === '23505'
  || /duplicate key|unique constraint/i.test(String(error?.message || ''));
