export type SocialProvider = 'google' | 'azure' | 'apple';

export const SOCIAL_PROVIDER_LABELS: Record<SocialProvider, string> = {
  google: 'Google',
  azure: 'Microsoft',
  apple: 'Apple',
};

/** Converts common Angola/Portugal input formats to the E.164 format required by SMS providers. */
export const normalizePhoneNumber = (value: string): string | null => {
  const raw = value.trim();
  if (!raw) return null;
  let digits = raw.replace(/[^\d+]/g, '');
  if (digits.startsWith('00')) digits = `+${digits.slice(2)}`;
  if (!digits.startsWith('+')) {
    const national = digits.replace(/^0+/, '');
    digits = national.length === 9 ? `+244${national}` : `+${national}`;
  }
  return /^\+[1-9]\d{7,14}$/.test(digits) ? digits : null;
};

export const authRedirectUrl = () => `${window.location.origin}/painel`;
