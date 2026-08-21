const attempts = new Map();

const clean = (value, max = 300) => typeof value === 'string' ? value.trim().slice(0, max) : '';

const rateLimited = (ip) => {
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter(time => now - time < 60_000);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > 5;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'Muitos pedidos. Aguarde um minuto.' });

  const body = req.body || {};
  const clientName = clean(body.clientName, 150);
  const clientPhone = clean(body.clientPhone, 50);
  const clientEmail = clean(body.clientEmail, 150);
  if (!clientName || (!clientPhone && !clientEmail)) {
    return res.status(400).json({ error: 'Nome e telefone ou e-mail são obrigatórios.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return res.status(503).json({ error: 'Persistência não configurada.' });

  const protocolCode = `PK-DIR-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const row = {
    protocol_code: protocolCode,
    service: clean(body.service, 50) || 'rent-a-car',
    location: clean(body.location, 100) || 'Luanda',
    destination: clean(body.destination, 150) || null,
    start_date: clean(body.startDate, 20) || null,
    end_date: clean(body.endDate, 20) || null,
    vehicle_category: clean(body.vehicleCategory, 150) || null,
    with_driver: body.withDriver !== false,
    client_name: clientName,
    client_phone: clientPhone,
    client_email: clientEmail || null,
    company_name: clean(body.companyName, 150) || null,
    flight_number: clean(body.flightNumber, 50) || null,
    passengers_count: Number.isFinite(Number(body.passengersCount)) ? Number(body.passengersCount) : null,
    notes: clean(body.notes, 3000) || null,
    status: 'pending',
    source: clean(body.source, 50) || 'web',
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
