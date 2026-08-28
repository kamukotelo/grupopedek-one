import { supabase } from './supabase';

export type PaymentProvider = 'stripe' | 'multicaixa' | 'bank_transfer' | 'mbway';
export type PaymentCategory = 'rent_a_car' | 'transfer' | 'route' | 'chauffeur' | 'event' | 'corporate' | 'invoice' | 'other';

export interface PaymentOrderResult {
  id: string;
  status: 'created' | 'pending' | 'paid' | 'failed' | 'cancelled' | 'expired';
  checkoutUrl?: string;
  clientReference: string;
  provider: PaymentProvider;
  currency: 'AOA' | 'USD' | 'EUR';
  amountMinor: number;
  requiresReconciliation?: boolean;
}

export async function createPaymentOrder(input: {
  invoiceId: string;
  provider: PaymentProvider;
  category?: PaymentCategory;
  currency?: 'AOA' | 'USD' | 'EUR';
  idempotencyKey: string;
}): Promise<PaymentOrderResult> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Inicie sessão novamente para continuar o pagamento.');
  const response = await fetch('/api/payments-create', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ category: 'invoice', currency: 'AOA', ...input }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Não foi possível iniciar o pagamento.');
  return result as PaymentOrderResult;
}
