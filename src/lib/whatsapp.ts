import i18n from '../i18n';
import { BookingData } from '../types';

export const OFFICIAL_WHATSAPP_NUMBER = '244923719090';

// As mensagens seguem o idioma activo do site para que o cliente reveja o texto na sua língua.
const t = (key: string, options?: Record<string, unknown>) => i18n.t(`whatsapp.${key}`, options);

/**
 * Pedido de reserva enviado pelo cliente para o WhatsApp da central. Tem os mesmos
 * campos e a mesma ordem do e-mail "Nova Reserva Recebida" (api/_reservation-email.js),
 * em português, para a equipa ler sempre a mesma ficha.
 */
export function generateWhatsAppBookingUrl(booking: BookingData & { protocolCode?: string }): string {
  const lines = [
    '*Nova Reserva — PEPEK GRUPO*',
    '',
    `*Nome:* ${booking.clientName || ''}`,
    `*Telefone/Whatsapp:* ${booking.clientPhone || ''}`,
    `*E-mail:* ${booking.clientEmail || ''}`,
    `*Tipo de Carro:* ${booking.vehicleCategory || ''}`,
    `*Motorista:* ${booking.withDriver ? 'Sim + 35.000 AOA/dia' : 'Não'}`,
    `*Higienização e Combustível:* ${booking.cleaning ? 'Sim + 35.000 AOA' : 'Não'}`,
    `*Check-in:* ${booking.startDate || ''}`,
    `*Check-out:* ${booking.endDate || ''}`,
    `*Total estimado:* ${booking.estimatedPrice || ''}`,
    `*Mensagem:* ${booking.message || ''}`,
  ];
  if (booking.protocolCode) lines.push(`*Protocolo:* ${booking.protocolCode}`);
  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function generateQuickWhatsAppUrl(topic?: string): string {
  const defaultText = topic ? t('quickTopic', { topic }) : t('quickDefault');
  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultText)}`;
}

export function generateVehicleWhatsAppUrl(vehicleName: string, priceAOA: number): string {
  const text = t('vehicleAvailability', { vehicle: vehicleName, price: priceAOA.toLocaleString('pt-AO') });
  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
