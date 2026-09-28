import i18n from '../i18n';
import { BookingData } from '../types';

export const OFFICIAL_WHATSAPP_NUMBER = '244923719090';

// As mensagens seguem o idioma activo do site para que o cliente reveja o texto na sua língua.
const t = (key: string, options?: Record<string, unknown>) => i18n.t(`whatsapp.${key}`, options);

export function generateWhatsAppBookingUrl(booking: BookingData): string {
  const serviceText = i18n.exists(`whatsapp.services.${booking.service}`) ? t(`services.${booking.service}`) : booking.service;

  let msg = `*${t('bookingTitle')}*\n`;
  msg += `-----------------------------------------\n`;
  msg += `*${t('client')}:* ${booking.clientName || t('notSpecified')}\n`;
  if (booking.companyName) {
    msg += `*${t('company')}:* ${booking.companyName}\n`;
  }
  msg += `*${t('contact')}:* ${booking.clientPhone || 'N/A'}\n`;
  if (booking.clientEmail) {
    msg += `*E-mail:* ${booking.clientEmail}\n`;
  }
  msg += `\n*${t('operationDetails')}:*\n`;
  msg += `*${t('service')}:* ${serviceText}\n`;
  msg += `*${t('location')}:* ${booking.location}${booking.destination ? ` ➔ ${t('destination')}: ${booking.destination}` : ''}\n`;
  msg += `*${t('startDate')}:* ${booking.startDate || t('toBeDefined')}\n`;
  if (booking.endDate) {
    msg += `*${t('endDate')}:* ${booking.endDate}\n`;
  }
  if (booking.vehicleCategory) {
    msg += `*${t('category')}:* ${booking.vehicleCategory}\n`;
  }
  msg += `*${t('mode')}:* ${booking.withDriver ? t('withDriver') : t('selfDrive')}\n`;

  if (booking.flightNumber) {
    msg += `*${t('flightNumber')}:* ${booking.flightNumber}\n`;
  }
  if (booking.passengersCount) {
    msg += `*${t('passengers')}:* ${booking.passengersCount}\n`;
  }
  if (booking.notes) {
    msg += `*${t('notes')}:* ${booking.notes}\n`;
  }

  msg += `\n-----------------------------------------\n`;
  msg += `_${t('sentVia')}_\n`;
  msg += `"${t('slogan')}"`;

  const encodedMsg = encodeURIComponent(msg);
  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodedMsg}`;
}

export function generateQuickWhatsAppUrl(topic?: string): string {
  const defaultText = topic ? t('quickTopic', { topic }) : t('quickDefault');
  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultText)}`;
}

export function generateVehicleWhatsAppUrl(vehicleName: string, priceAOA: number): string {
  const text = t('vehicleAvailability', { vehicle: vehicleName, price: priceAOA.toLocaleString('pt-AO') });
  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
