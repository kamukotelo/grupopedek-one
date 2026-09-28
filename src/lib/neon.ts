const authUrl = import.meta.env.VITE_NEON_AUTH_URL || 'https://auth-not-configured.invalid';
const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL || 'https://data-api-not-configured.invalid/rest/v1';

const createNeonClient = async () => {
  const { createClient, SupabaseAuthAdapter } = await import('@neondatabase/neon-js');
  return createClient({
    auth: {
      // Compatibility adapter keeps the mature auth call surface while all
      // sessions and identities are managed by Neon Auth.
      adapter: SupabaseAuthAdapter(),
      url: authUrl,
      allowAnonymous: true,
    },
    dataApi: {
      url: dataApiUrl,
    },
  });
};

let clientPromise: ReturnType<typeof createNeonClient> | null = null;

/**
 * O SDK da Neon (auth + data API + zod) pesa várias centenas de KB. Carrega-se
 * a pedido, num chunk separado, para não atrasar a primeira pintura das páginas
 * públicas — que não precisam de sessão para serem vistas.
 */
export const getNeonClient = () => {
  clientPromise ??= createNeonClient().catch((error) => {
    clientPromise = null;
    throw error;
  });
  return clientPromise;
};

/** Token de acesso da sessão actual, ou null quando não há sessão. */
export const getAccessToken = async (): Promise<string | null> => {
  const client = await getNeonClient();
  const { data } = await client.auth.getSession();
  return data.session?.access_token ?? null;
};
