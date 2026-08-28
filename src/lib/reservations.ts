import { BookingData } from '../types';
import { supabase } from './supabase';

export interface ReservationReceipt {
  protocolCode: string;
  persisted: boolean;
  crmQueued: boolean;
}

const toDatabaseRow = (booking: BookingData, protocolCode?: string) => ({
  protocol_code: protocolCode,
  service: booking.service,
  location: booking.location,
  destination: booking.destination || null,
  start_date: booking.startDate || null,
  end_date: booking.endDate || null,
  vehicle_category: booking.vehicleCategory || null,
  with_driver: booking.withDriver,
  client_name: booking.clientName,
  client_phone: booking.clientPhone,
  client_email: booking.clientEmail || null,
  company_name: booking.companyName || null,
  flight_number: booking.flightNumber || null,
  passengers_count: booking.passengersCount || null,
  notes: booking.notes || null,
  status: booking.status || 'pending',
  source: booking.source || 'web',
});

export async function submitReservation(booking: BookingData): Promise<ReservationReceipt> {
  try {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    if (response.ok) return await response.json();
    if (response.status !== 404 && response.status !== 503) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || 'Não foi possível registar a reserva.');
    }
  } catch (error) {
    if (error instanceof Error && !/fetch|404|503|Failed/i.test(error.message)) throw error;
  }

  // Preserve the existing direct workflow only in the local demonstration.
  // Production must pass through the rate-limited server endpoint.
  if (!import.meta.env.DEV) {
    throw new Error('O serviço de reservas está temporariamente indisponível. Tente novamente ou contacte o apoio 24/7.');
  }

  const protocolCode = `PK-DIR-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const { error } = await supabase.from('bookings').insert([toDatabaseRow(booking, protocolCode)]);
  if (error) throw new Error(`A reserva não foi guardada: ${error.message}`);
  return { protocolCode, persisted: true, crmQueued: false };
}

export async function submitContactLead(input: { name: string; contact: string; subject: string; message: string }) {
  const booking: BookingData = {
    service: 'corporate',
    location: 'Luanda',
    startDate: '',
    withDriver: true,
    clientName: input.name,
    clientPhone: input.contact,
    notes: `[CONTACT FORM - ${input.subject}]: ${input.message}`,
    status: 'pending',
    source: 'web_contact_form',
  };
  return submitReservation(booking);
}

export async function checkVehicleAvailability(input: { vehicle: string; startDate: string; endDate: string }) {
  if (!input.vehicle || !input.startDate || !input.endDate) return { status: 'unknown' as const };
  try {
    const params = new URLSearchParams(input);
    const response = await fetch(`/api/availability?${params.toString()}`);
    if (!response.ok) return { status: 'unknown' as const };
    return await response.json() as { status: 'on_request' | 'unavailable' | 'unknown' };
  } catch {
    return { status: 'unknown' as const };
  }
}
