import { BookingData } from '../types';

export const OFFICIAL_WHATSAPP_NUMBER = '244923719090';

const serviceLabels: Record<string, string> = {
  'rent-a-car': 'Rent-a-Car Premium (Livre Condução / Com Motorista)',
  'executive': 'Mobilidade Executiva & Protocolar',
  'transfer': 'Transfer Aeroporto Internacional / Hotel',
  'corporate': 'Solução Corporativa / Gestão de Frotas para Empresas',
};

export function generateWhatsAppBookingUrl(booking: BookingData): string {
  const serviceText = serviceLabels[booking.service] || booking.service;
  
  let msg = `*SOLICITAÇÃO DE RESERVA — PEPEK GRUPO RENT-A-CAR*\n`;
  msg += `-----------------------------------------\n`;
  msg += `*Cliente:* ${booking.clientName || 'Não especificado'}\n`;
  if (booking.companyName) {
    msg += `*Empresa/Instituição:* ${booking.companyName}\n`;
  }
  msg += `*Contacto:* ${booking.clientPhone || 'N/A'}\n`;
  if (booking.clientEmail) {
    msg += `*E-mail:* ${booking.clientEmail}\n`;
  }
  msg += `\n*DETALHES DA OPERAÇÃO:*\n`;
  msg += `*Serviço:* ${serviceText}\n`;
  msg += `*Província / Local:* ${booking.location}${booking.destination ? ` ➔ Destino: ${booking.destination}` : ''}\n`;
  msg += `*Data de Início:* ${booking.startDate || 'A definir'}\n`;
  if (booking.endDate) {
    msg += `*Data de Término:* ${booking.endDate}\n`;
  }
  if (booking.vehicleCategory) {
    msg += `*Categoria Desejada:* ${booking.vehicleCategory}\n`;
  }
  msg += `*Modalidade:* ${booking.withDriver ? 'Com Motorista Executivo/Protocolar' : 'Livre Condução (Auto)'}\n`;
  
  if (booking.flightNumber) {
    msg += `*Nº do Voo:* ${booking.flightNumber}\n`;
  }
  if (booking.passengersCount) {
    msg += `*Nº de Passageiros:* ${booking.passengersCount}\n`;
  }
  if (booking.notes) {
    msg += `*Observações:* ${booking.notes}\n`;
  }

  msg += `\n-----------------------------------------\n`;
  msg += `_Enviado através do portal oficial pepekgrupo.com_\n`;
  msg += `"Movemos quem move Angola."`;

  const encodedMsg = encodeURIComponent(msg);
  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodedMsg}`;
}

export function generateQuickWhatsAppUrl(topic?: string): string {
  const defaultText = topic
    ? `Olá PEPEK GRUPO. Gostaria de informações sobre ${topic}.`
    : `Olá PEPEK GRUPO RENT-A-CAR. Gostaria de solicitar uma proposta de mobilidade executiva.`;
  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultText)}`;
}
