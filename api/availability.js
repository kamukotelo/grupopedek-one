import { applyApiSecurity, cleanText, isIsoDate, takeRateLimit } from './_security.js';
import { getDatabase } from './_neon.js';

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['GET'] })) return;
  if (takeRateLimit(req, 'availability', 30)) return res.status(429).json({ status: 'unknown' });
  const vehicle = cleanText(req.query.vehicle, 150);
  const startDate = cleanText(req.query.startDate, 10);
  const endDate = cleanText(req.query.endDate, 10);
  if (!vehicle || !isIsoDate(startDate) || !isIsoDate(endDate) || endDate < startDate) return res.status(400).json({ status: 'unknown' });

  let sql;
  try {
    sql = getDatabase();
  } catch {
    return res.status(503).json({ status: 'unknown' });
  }

  let conflicts;
  try {
    conflicts = await sql.query(
      `SELECT id FROM public.bookings
       WHERE vehicle_category = $1 AND start_date <= $2 AND end_date >= $3
         AND status IN ('pending','contacted','confirmed')
       LIMIT 1`,
      [vehicle, endDate, startDate],
    );
  } catch {
    return res.status(503).json({ status: 'unknown' });
  }

  // A public request must never reserve or promise a physical vehicle. The
  // operations team still assigns the exact unit only after checking service,
  // maintenance, driver and contractual constraints.
  if (conflicts.length) return res.status(200).json({ status: 'unavailable' });
  return res.status(200).json({ status: 'on_request' });
}
