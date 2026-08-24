import crypto from 'node:crypto';

const buckets = new Map();

export const applyApiSecurity = (req, res, { methods = ['GET'] } = {}) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Allow', methods.join(', '));

  if (!methods.includes(req.method)) {
    res.status(405).json({ error: 'Método não permitido' });
    return false;
  }

  const origin = req.headers.origin;
  if (origin) {
    const expectedOrigins = new Set([
      process.env.SITE_URL,
      req.headers.host ? `https://${req.headers.host}` : null,
      req.headers.host?.startsWith('localhost:') ? `http://${req.headers.host}` : null,
    ].filter(Boolean));
    if (!expectedOrigins.has(origin)) {
      res.status(403).json({ error: 'Origem não autorizada' });
      return false;
    }
  }
  return true;
};

export const takeRateLimit = (req, scope, limit, windowMs = 60_000) => {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = forwarded || req.socket?.remoteAddress || 'unknown';
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const recent = (buckets.get(key) || []).filter((time) => now - time < windowMs);
  recent.push(now);
  buckets.set(key, recent);
  return recent.length > limit;
};

export const cleanText = (value, max = 300) =>
  typeof value === 'string' ? value.trim().replace(/[\u0000-\u001F\u007F]/g, '').slice(0, max) : '';

export const isIsoDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));

export const safeEqual = (left, right) => {
  if (!left || !right) return false;
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};
