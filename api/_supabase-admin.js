const jsonHeaders = (key, token) => ({
  apikey: key,
  Authorization: `Bearer ${token || key}`,
  'Content-Type': 'application/json',
});

export const getSupabaseAdminConfig = () => {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('Supabase privado não configurado');
  return { url: url.replace(/\/$/, ''), serviceKey };
};

export const authenticateSupabaseRequest = async (req) => {
  const { url, serviceKey } = getSupabaseAdminConfig();
  const authorization = String(req.headers.authorization || '');
  if (!authorization.startsWith('Bearer ')) throw new Error('Autenticação necessária');
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: jsonHeaders(serviceKey, authorization.slice(7)),
  });
  if (!response.ok) throw new Error('Sessão inválida');
  return response.json();
};

export const querySupabaseAdmin = async (path, { optional = false } = {}) => {
  const { url, serviceKey } = getSupabaseAdminConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: {
      ...jsonHeaders(serviceKey),
      Accept: 'application/json',
      'Accept-Profile': 'public',
    },
  });
  if (!response.ok) {
    if (optional && response.status === 404) return [];
    throw new Error(`Consulta protegida falhou (${response.status})`);
  }
  return response.json();
};
