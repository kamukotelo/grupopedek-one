import { supabase } from './supabase';
import type { InvoiceItem } from '../types/auth';

export type PaymentProvider = 'stripe' | 'multicaixa' | 'bank_transfer' | 'mbway';
export type PaymentCategory = 'rent_a_car' | 'transfer' | 'route' | 'chauffeur' | 'event' | 'corporate' | 'invoice' | 'other';
export type PaymentStatus = 'created' | 'pending' | 'authorized' | 'paid' | 'failed' | 'cancelled' | 'expired' | 'refunded' | 'partially_refunded';

// Single source of truth for how each provider is shown on invoices and receipts.
// The server (api/_payments.js) mirrors these exact strings so a gateway label
// never appears as a raw identifier like "bank_transfer" in the portal.
export const PROVIDER_LABELS: Record<PaymentProvider, InvoiceItem['paymentGateway']> = {
  stripe: 'Cartão / Stripe',
  multicaixa: 'Multicaixa Express',
  bank_transfer: 'Transferência Bancária',
  mbway: 'MB WAY',
};

export const providerLabel = (provider: PaymentProvider): InvoiceItem['paymentGateway'] =>
  PROVIDER_LABELS[provider] ?? 'Transferência Bancária';

export interface PaymentOrderResult {
  id: string;
  status: PaymentStatus;
  checkoutUrl?: string;
  clientReference: string;
  provider: PaymentProvider;
  currency: 'AOA' | 'USD' | 'EUR';
  amountMinor: number;
  requiresReconciliation?: boolean;
}

export interface PaymentStatusResult {
  id: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  currency: 'AOA' | 'USD' | 'EUR';
  amountMinor: number;
  clientReference: string;
  paidAt: string | null;
  failureMessage: string | null;
  createdAt: string | null;
}

const authHeader = async (): Promise<string> => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Inicie sessão novamente para continuar o pagamento.');
  return `Bearer ${token}`;
};

export async function createPaymentOrder(input: {
  invoiceId: string;
  provider: PaymentProvider;
  category?: PaymentCategory;
  currency?: 'AOA' | 'USD' | 'EUR';
  idempotencyKey: string;
}): Promise<PaymentOrderResult> {
  const response = await fetch('/api/payments-create', {
    method: 'POST',
    headers: { Authorization: await authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ category: 'invoice', currency: 'AOA', ...input }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Não foi possível iniciar o pagamento.');
  return result as PaymentOrderResult;
}

export async function getPaymentStatus(orderId: string): Promise<PaymentStatusResult> {
  const response = await fetch(`/api/payments-status?id=${encodeURIComponent(orderId)}`, {
    headers: { Authorization: await authHeader() },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Não foi possível consultar o pagamento.');
  return {
    id: result.id,
    status: result.status,
    provider: result.provider,
    currency: result.currency,
    amountMinor: Number(result.amount_minor ?? 0),
    clientReference: result.client_reference,
    paidAt: result.paid_at ?? null,
    failureMessage: result.failure_message ?? null,
    createdAt: result.created_at ?? null,
  };
}

/**
 * Poll payments-status until the order reaches a terminal state or the attempts
 * run out. Used when the client returns from an external checkout (Stripe),
 * where settlement only lands once the signed webhook has been processed.
 */
export async function pollPaymentStatus(
  orderId: string,
  { attempts = 8, intervalMs = 2000, signal }: { attempts?: number; intervalMs?: number; signal?: AbortSignal } = {},
): Promise<PaymentStatusResult> {
  const terminal: PaymentStatus[] = ['paid', 'failed', 'cancelled', 'expired', 'refunded', 'partially_refunded'];
  let last: PaymentStatusResult | null = null;
  for (let i = 0; i < attempts; i += 1) {
    if (signal?.aborted) throw new DOMException('Consulta cancelada', 'AbortError');
    last = await getPaymentStatus(orderId);
    if (terminal.includes(last.status)) return last;
    if (i < attempts - 1) await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return last as PaymentStatusResult;
}
