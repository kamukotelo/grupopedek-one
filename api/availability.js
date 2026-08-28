import { applyApiSecurity, cleanText, isIsoDate, takeRateLimit } from './_security.js';

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['GET'] })) return;
  if (takeRateLimit(req, 'availability', 30)) return res.status(429).json({ status: 'unknown' });
  const vehicle = cleanText(req.query.vehicle, 150);
  const startDate = cleanText(req.query.startDate, 10);
  const endDate = cleanText(req.query.endDate, 10);
  if (!vehicle || !isIsoDate(startDate) || !isIsoDate(endDate) || endDate < startDate) return res.status(400).json({ status: 'unknown' });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return res.status(503).json({ status: 'unknown' });

  const query = new URLSearchParams({
    select: 'id',
    vehicle_category: `eq.${vehicle}`,
    start_date: `lte.${endDate}`,
    end_date: `gte.${startDate}`,
    status: 'in.(pending,contacted,confirmed)',
  });
  const response = await fetch(`${supabaseUrl}/rest/v1/bookings?${query}`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
  });
  if (!response.ok) return res.status(503).json({ status: 'unknown' });
  const conflicts = await response.json();

  // A public request must never reserve or promise a physical vehicle. The
  // operations team still assigns the exact unit only after checking service,
  // maintenance, driver and contractual constraints.
  if (conflicts.length) return res.status(200).json({ status: 'unavailable' });
  return res.status(200).json({ status: 'on_request' });
}
