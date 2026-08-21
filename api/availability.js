export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido' });
  const vehicle = String(req.query.vehicle || '').trim();
  const startDate = String(req.query.startDate || '').trim();
  const endDate = String(req.query.endDate || '').trim();
  if (!vehicle || !startDate || !endDate) return res.status(400).json({ status: 'unknown' });

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
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
  return res.status(200).json({ status: conflicts.length ? 'unavailable' : 'available', conflicts: conflicts.length });
}
