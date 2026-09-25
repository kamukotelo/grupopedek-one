import { createClient, SupabaseAuthAdapter } from '@neondatabase/neon-js';

const authUrl = import.meta.env.VITE_NEON_AUTH_URL || 'https://auth-not-configured.invalid';
const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL || 'https://data-api-not-configured.invalid/rest/v1';

export const isNeonConfigured = Boolean(
  import.meta.env.VITE_NEON_AUTH_URL && import.meta.env.VITE_NEON_DATA_API_URL
);

export const neonClient = createClient({
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
