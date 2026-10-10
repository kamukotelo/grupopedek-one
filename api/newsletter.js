import { applyApiSecurity, cleanText, takeRateLimit } from './_security.js';
import { getDatabase } from './_neon.js';
import { requireBlogEditor } from './_blog.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LANGUAGES = new Set(['pt', 'en', 'fr']);

// POST → subscrever a newsletter (público)
// GET  → lista de subscritores para a equipa (editores do blogue); ?format=csv para exportar
export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['GET', 'POST'] })) return;

  let sql;
  try {
    sql = getDatabase();
  } catch {
    return res.status(503).json({ error: 'Base de dados não configurada.' });
  }

  try {
    if (req.method === 'POST') return await subscribe(req, res, sql);
    return await listSubscribers(req, res, sql);
  } catch (error) {
    console.error('newsletter', error);
    if (!res.headersSent) return res.status(500).json({ error: 'Não foi possível concluir o pedido.' });
  }
}

const subscribe = async (req, res, sql) => {
  if (takeRateLimit(req, 'newsletter', 5)) return res.status(429).json({ error: 'Muitos pedidos. Aguarde um minuto.' });
  const body = req.body || {};
  const email = cleanText(body.email, 160).toLowerCase();
  if (!EMAIL.test(email)) return res.status(400).json({ error: 'E-mail inválido.' });
  const language = LANGUAGES.has(body.language) ? body.language : 'pt';
  const source = cleanText(body.source, 40) || 'blogue';

  // Voltar a subscrever reactiva um e-mail que tinha cancelado; não revela se já existia.
  await sql.query(
    `INSERT INTO private.newsletter_subscribers (email, language, source)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET unsubscribed_at = NULL, language = EXCLUDED.language`,
    [email, language, source],
  );
  return res.status(200).json({ ok: true });
};

// Evita que um e-mail começado por =, +, - ou @ seja interpretado como fórmula no Excel.
const csvCell = (value) => {
  const text = String(value ?? '');
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return /[",\n;]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

const listSubscribers = async (req, res, sql) => {
  if (!await requireBlogEditor(req, res)) return;
  const rows = await sql.query(
    `SELECT email, language, source, created_at FROM private.newsletter_subscribers
      WHERE unsubscribed_at IS NULL ORDER BY created_at DESC LIMIT 10000`,
  );
  const subscribers = rows.map((row) => ({
    email: row.email,
    language: row.language,
    source: row.source,
    createdAt: new Date(row.created_at).toISOString(),
  }));

  if (req.query?.format === 'csv') {
    const lines = ['email,idioma,origem,data', ...subscribers.map((s) => [s.email, s.language, s.source, s.createdAt.slice(0, 10)].map(csvCell).join(','))];
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="subscritores-newsletter-pepek.csv"');
    return res.status(200).send('﻿' + lines.join('\n'));
  }
  return res.status(200).json({ subscribers });
};
