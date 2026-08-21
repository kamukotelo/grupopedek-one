// ─────────────────────────────────────────────────────────────────────────────
// PEPEK GRUPO — Detecção de Origem Geográfica
// Determina o mercado do visitante para apresentar métodos de pagamento relevantes.
// Angola (Luanda, AOA) → Multicaixa Express + BAI Direto
// Portugal / Europa → Stripe Payment Element (Cartão + Multibanco + MB WAY)
// ─────────────────────────────────────────────────────────────────────────────

export type GeoMarket = 'angola' | 'portugal' | 'europa' | 'unknown';

export interface GeoPaymentContext {
  market: GeoMarket;
  currency: 'AOA' | 'EUR' | 'USD';
  locale: string;
  showMulticaixa: boolean;
  showStripe: boolean;
  showMBWay: boolean;
  showBAIDireto: boolean;
}

/**
 * Detecta o mercado de origem do visitante com base em:
 * 1. Timezone do sistema (Intl API)
 * 2. Idioma do browser (navigator.language)
 *
 * Esta detecção é client-side e falível — serve apenas para pré-selecionar
 * o método de pagamento mais relevante. O utilizador pode sempre trocar.
 *
 * TODO: Para maior precisão em produção, usar IP geolocation via API no backend
 * (ex: ip-api.com, MaxMind GeoIP2) e enviar o mercado ao front-end via header/cookie.
 */
export function detectGeoMarket(): GeoPaymentContext {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    const lang = (navigator.language || navigator.languages?.[0] || '').toLowerCase();

    // Angola: timezone África/Luanda ou idioma pt-AO
    if (tz === 'Africa/Luanda' || lang === 'pt-ao') {
      return {
        market: 'angola',
        currency: 'AOA',
        locale: 'pt-AO',
        showMulticaixa: true,
        showStripe: false,
        showMBWay: false,
        showBAIDireto: true
      };
    }

    // Portugal: timezone Europa/Lisboa ou idioma pt-PT
    if (tz === 'Europe/Lisbon' || lang === 'pt-pt') {
      return {
        market: 'portugal',
        currency: 'EUR',
        locale: 'pt-PT',
        showMulticaixa: false,
        showStripe: true,
        showMBWay: true,
        showBAIDireto: false
      };
    }

    // Outra Europa: qualquer timezone Europe/*
    if (tz.startsWith('Europe/')) {
      return {
        market: 'europa',
        currency: 'EUR',
        locale: 'en-EU',
        showMulticaixa: false,
        showStripe: true,
        showMBWay: false,
        showBAIDireto: false
      };
    }

    // Indeterminado: mostrar ambos com destaque geográfico
    return {
      market: 'unknown',
      currency: 'USD',
      locale: 'en',
      showMulticaixa: true,
      showStripe: true,
      showMBWay: false,
      showBAIDireto: false
    };
  } catch {
    // Fallback seguro: mostrar todos os métodos
    return {
      market: 'unknown',
      currency: 'USD',
      locale: 'en',
      showMulticaixa: true,
      showStripe: true,
      showMBWay: false,
      showBAIDireto: false
    };
  }
}

/**
 * Retorna a taxa de câmbio de referência AOA→EUR para exibição ao cliente.
 * TODO: Em produção, substituir com chamada a API de câmbio real (ex: BNA Angola, ECB).
 * Taxa de referência aproximada: 1 EUR ≈ 910 AOA (Agosto 2026)
 */
export function getAoaToEurRate(): number {
  return 910; // TODO: PLACEHOLDER — buscar taxa real da API do BNA ou ECB
}

export function formatDualCurrency(amountAOA: number): string {
  const eur = (amountAOA / getAoaToEurRate()).toFixed(2);
  return `${amountAOA.toLocaleString('pt-AO')} AOA ≈ €${eur} EUR`;
}
