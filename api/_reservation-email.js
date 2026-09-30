/**
 * E-mail "Nova Reserva Recebida" enviado à central quando chega um pedido do site.
 * Usa a API do Resend (integração do Vercel Marketplace). Sem RESEND_API_KEY não
 * envia nada — a reserva continua gravada na base de dados.
 *
 * Variáveis: RESEND_API_KEY, RESERVATIONS_EMAIL_TO (destinatários separados por
 * vírgula; por omissão PDEK_CONTACT_EMAIL) e RESERVATIONS_EMAIL_FROM (remetente
 * num domínio verificado no Resend).
 */
const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

const extra = (selected, price) => (selected ? `Sim + ${price} AOA` : 'Não');

export const buildReservationEmail = (row, extras) => {
  const phoneDigits = row.client_phone.replace(/[^\d+]/g, '');
  const lines = [
    ['Nome', escapeHtml(row.client_name)],
    ['Telefone/Whatsapp', phoneDigits ? `<a href="tel:${escapeHtml(phoneDigits)}">${escapeHtml(row.client_phone)}</a>` : ''],
    ['E-mail', row.client_email ? `<a href="mailto:${escapeHtml(row.client_email)}">${escapeHtml(row.client_email)}</a>` : ''],
    ['Tipo de Carro', escapeHtml(row.vehicle_category)],
    ['Motorista', extra(row.with_driver, '35.000') + (row.with_driver ? '/dia' : '')],
    ['Higienização e Combustível', extra(extras.cleaning, '35.000')],
    ['Check-in', escapeHtml(row.start_date)],
    ['Check-out', escapeHtml(row.end_date)],
    ['Total estimado', escapeHtml(extras.estimatedPrice)],
    ['Mensagem', escapeHtml(extras.message)],
    ['Protocolo', escapeHtml(row.protocol_code)],
  ];

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#222;line-height:1.5">
  <h1 style="font-size:26px;margin:0 0 24px">Nova Reserva Recebida</h1>
  ${lines.map(([label, value]) => `<p style="margin:0 0 18px"><strong>${label}:</strong> ${value ?? ''}</p>`).join('\n  ')}
</div>`;
  const text = ['Nova Reserva Recebida', '', ...lines.map(([label, value]) => `${label}: ${String(value ?? '').replace(/<[^>]+>/g, '')}`)].join('\n');

  return {
    subject: `Nova Reserva Recebida — ${row.client_name}${row.vehicle_category ? ` · ${row.vehicle_category.split(' — ')[0]}` : ''}`,
    html,
    text,
  };
};

export async function sendReservationEmail(row, extras) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = (process.env.RESERVATIONS_EMAIL_TO || process.env.PDEK_CONTACT_EMAIL || '').split(',').map((item) => item.trim()).filter(Boolean);
  if (!apiKey || to.length === 0) return false;

  const { subject, html, text } = buildReservationEmail(row, extras);
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESERVATIONS_EMAIL_FROM || 'PEPEK Reservas <reservas@pepekgrupo.com>',
      to,
      reply_to: row.client_email || undefined,
      subject,
      html,
      text,
    }),
  });
  if (!response.ok) {
    console.error('[reservation] email failed', response.status, (await response.text()).slice(0, 300));
    return false;
  }
  return true;
}
