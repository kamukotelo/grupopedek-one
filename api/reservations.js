import { applyApiSecurity, cleanText, isIsoDate, takeRateLimit } from './_security.js';

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['POST'] })) return;
  if (takeRateLimit(req, 'reservations', 5)) return res.status(429).json({ error: 'Muitos pedidos. Aguarde um minuto.' });

  const body = req.body || {};
  const clientName = cleanText(body.clientName, 150);
  const clientPhone = cleanText(body.clientPhone, 50);
  const clientEmail = cleanText(body.clientEmail, 150).toLowerCase();
  if (!clientName || (!clientPhone && !clientEmail)) {
    return res.status(400).json({ error: 'Nome e telefone ou e-mail são obrigatórios.' });
  }
  if (clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) return res.status(400).json({ error: 'E-mail inválido.' });
  if (clientPhone && !/^\+?[0-9 ()-]{7,25}$/.test(clientPhone)) return res.status(400).json({ error: 'Telefone inválido.' });
  const startDate = cleanText(body.startDate, 10);
  const endDate = cleanText(body.endDate, 10);
  if ((startDate && !isIsoDate(startDate)) || (endDate && !isIsoDate(endDate)) || (startDate && endDate && endDate < startDate)) {
    return res.status(400).json({ error: 'Período da reserva inválido.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return res.status(503).json({ error: 'Persistência não configurada.' });

  const protocolCode = `PK-DIR-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const row = {
    protocol_code: protocolCode,
    service: cleanText(body.service, 50) || 'rent-a-car',
    location: cleanText(body.location, 100) || 'Luanda',
    destination: cleanText(body.destination, 150) || null,
    start_date: startDate || null,
    end_date: endDate || null,
    vehicle_category: cleanText(body.vehicleCategory, 150) || null,
    with_driver: body.withDriver !== false,
    client_name: clientName,
    client_phone: clientPhone,
    client_email: clientEmail || null,
    company_name: cleanText(body.companyName, 150) || null,
    flight_number: cleanText(body.flightNumber, 50) || null,
    passengers_count: Number.isInteger(Number(body.passengersCount)) && Number(body.passengersCount) >= 1 && Number(body.passengersCount) <= 100 ? Number(body.passengersCount) : null,
    notes: cleanText(body.notes, 3000) || null,
    status: 'pending',
    source: cleanText(body.source, 50) || 'web',
  };

  const insertResponse = await fetch(`${supabaseUrl}/rest/v1/bookings`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(row),
  });
  if (!insertResponse.ok) {
    const detail = await insertResponse.text();
    console.error('[reservation] insert failed', detail.slice(0, 500));
    return res.status(502).json({ error: 'A reserva não pôde ser guardada.' });
  }

  let crmQueued = false;
  if (process.env.CRM_WEBHOOK_URL) {
    try {
      const crmResponse = await fetch(process.env.CRM_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Pepek-Source': 'pepek-web' },
        body: JSON.stringify({ protocolCode, ...row }),
      });
      crmQueued = crmResponse.ok;
    } catch (error) {
      console.error('[reservation] CRM queue failed', error);
    }
  }

  return res.status(201).json({ protocolCode, persisted: true, crmQueued });
}
