import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock3, XCircle, Loader2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { pollPaymentStatus } from '../../lib/payments';

type ReturnState =
  | { kind: 'checking' }
  | { kind: 'paid'; reference: string }
  | { kind: 'pending'; reference: string }
  | { kind: 'failed'; message: string }
  | { kind: 'cancelled' }
  | { kind: 'error'; message: string };

const UUID_RE = /^[0-9a-f-]{36}$/i;

/**
 * Handles the browser returning from an external checkout (Stripe) at
 * /painel?payment=success&order=<uuid>. Settlement only lands once the signed
 * webhook has been processed server-side, so we poll payments-status and refresh
 * the invoice list once the order reaches a terminal state.
 */
export const PaymentReturnBanner: React.FC = () => {
  const { isDemoMode, refreshInvoices } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState<ReturnState | null>(null);
  const handledFor = useRef<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const outcome = params.get('payment');
    if (!outcome || isDemoMode) return;

    const key = location.pathname + location.search;
    if (handledFor.current === key) return;
    handledFor.current = key;

    const orderId = params.get('order') || '';
    // Strip the params so a manual refresh doesn't replay the flow.
    navigate(location.pathname, { replace: true });

    if (outcome === 'cancelled') {
      setState({ kind: 'cancelled' });
      return;
    }
    if (outcome !== 'success') return;
    if (!UUID_RE.test(orderId)) {
      setState({ kind: 'error', message: 'Não foi possível identificar o pagamento. Verifique o extrato de faturas.' });
      return;
    }

    let active = true;
    setState({ kind: 'checking' });
    pollPaymentStatus(orderId, { attempts: 8, intervalMs: 2500 })
      .then(async (result) => {
        if (!active) return;
        await refreshInvoices().catch(() => undefined);
        if (result.status === 'paid') {
          setState({ kind: 'paid', reference: result.clientReference });
        } else if (result.status === 'failed') {
          setState({ kind: 'failed', message: result.failureMessage || 'O pagamento não foi concluído. Nenhum valor foi cobrado.' });
        } else {
          setState({ kind: 'pending', reference: result.clientReference });
        }
      })
      .catch(() => {
        if (active) setState({ kind: 'error', message: 'Não conseguimos confirmar o pagamento agora. A equipa financeira concilia a fatura assim que o provedor confirmar.' });
      });

    return () => { active = false; };
  }, [location, isDemoMode, navigate, refreshInvoices]);

  useEffect(() => {
    if (state && (state.kind === 'paid' || state.kind === 'cancelled')) {
      const timer = window.setTimeout(() => setState(null), 9000);
      return () => window.clearTimeout(timer);
    }
  }, [state]);

  if (!state) return null;

  const tone = {
    checking: { Icon: Loader2, ring: 'border-[#236199]/30', accent: 'text-[#236199]', spin: true },
    paid: { Icon: CheckCircle2, ring: 'border-emerald-300', accent: 'text-emerald-600', spin: false },
    pending: { Icon: Clock3, ring: 'border-amber-300', accent: 'text-amber-600', spin: false },
    failed: { Icon: XCircle, ring: 'border-red-300', accent: 'text-red-600', spin: false },
    cancelled: { Icon: Clock3, ring: 'border-gray-300', accent: 'text-gray-500', spin: false },
    error: { Icon: Clock3, ring: 'border-amber-300', accent: 'text-amber-600', spin: false },
  }[state.kind];

  const copy = ((s: ReturnState): { title: string; body: string } => {
    switch (s.kind) {
      case 'checking':
        return { title: 'A confirmar o seu pagamento…', body: 'Aguarde enquanto validamos a confirmação do provedor. Não feche esta janela.' };
      case 'paid':
        return { title: 'Pagamento confirmado', body: `Fatura liquidada. Referência ${s.reference}. O recibo certificado fica disponível no extrato.` };
      case 'pending':
        return { title: 'Pagamento em processamento', body: `Recebemos a instrução (ref. ${s.reference}). A fatura é marcada como paga assim que o provedor confirmar — normalmente em minutos.` };
      case 'failed':
        return { title: 'Pagamento não concluído', body: s.message };
      case 'cancelled':
        return { title: 'Pagamento cancelado', body: 'Nenhum valor foi cobrado. Pode retomar a partir do extrato de faturas quando quiser.' };
      case 'error':
        return { title: 'Confirmação pendente', body: s.message };
    }
  })(state);

  return (
    <div className="fixed inset-x-0 top-3 z-[70] flex justify-center px-3" role="status" aria-live="polite">
      <div className={`flex w-full max-w-md items-start gap-3 rounded-2xl border bg-white p-4 shadow-2xl ${tone.ring}`}>
        <tone.Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone.accent} ${tone.spin ? 'animate-spin' : ''}`} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-[#09172C]">{copy.title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-gray-600">{copy.body}</p>
        </div>
        {state.kind !== 'checking' && (
          <button
            type="button"
            onClick={() => setState(null)}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Fechar aviso"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
