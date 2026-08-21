import { BookingData } from '../types';

/**
 * Módulo de Integração ERP (Odoo / Primavera / CRM)
 * Preparado para sincronização de leads e faturação proforma automática.
 */
export async function syncBookingToCRM(booking: BookingData): Promise<{ success: boolean; crmLeadId?: string }> {
  try {
    // Verificação de endpoint webhook customizado
    const webhookUrl = import.meta.env.VITE_CRM_WEBHOOK_URL;
    if (!webhookUrl) {
      // Fallback em modo stub configurável (não quebra se webhook não estiver setado)
      console.info('[CRM-Sync] Lead registrado localmente / aguardando configuração de webhook ERP:', booking);
      return { success: true, crmLeadId: `PEPEK-${Date.now().toString().slice(-6)}` };
    }

    const response = await fetch(webhookUrl, {
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, crmLeadId: data.lead_id || `PEPEK-${Date.now().toString().slice(-6)}` };
  } catch (error) {
    console.warn('[CRM-Sync] Erro na sincronização com ERP (Lead preservado no Supabase/Dexie):', error);
    return { success: false };
  }
}
