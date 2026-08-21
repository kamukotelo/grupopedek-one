import { BookingData } from '../types';

/**
 * Módulo de Integração ERP (Odoo / Primavera / CRM)
 * Preparado para sincronização de leads e faturação proforma automática.
 */
export async function syncBookingToCRM(booking: BookingData): Promise<{ success: boolean; crmLeadId?: string }> {
  try {
    const response = await fetch('/api/crm-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Pepek-Source': 'pepekgrupo-web'
      },
      body: JSON.stringify({
        source: 'Website PEPEK GRUPO',
        client: {
          name: booking.clientName,
          phone: booking.clientPhone,
          email: booking.clientEmail,
          company: booking.companyName
        },
        opportunity: {
          name: `Reserva ${booking.service} - ${booking.location}`,
          service_type: booking.service,
          location: booking.location,
          start_date: booking.startDate,
          end_date: booking.endDate,
          vehicle_category: booking.vehicleCategory,
          with_driver: booking.withDriver,
          notes: booking.notes
        },
        created_at: new Date().toISOString()
      })
    });

    if (!response.ok) return { success: false };

    const data = await response.json();
    return { success: true, crmLeadId: data.lead_id || `PEPEK-${Date.now().toString().slice(-6)}` };
  } catch (error) {
    console.warn('[CRM-Sync] Integração indisponível; reserva preservada no sistema:', error);
    return { success: false };
  }
}
