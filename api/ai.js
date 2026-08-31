import { applyApiSecurity, cleanText, takeRateLimit } from './_security.js';
import { SYSTEM_INSTRUCTIONS, fleetCatalogText } from './_ai-knowledge.js';
import { FLEET_CATALOG } from './_fleet-catalog.js';

const MODEL = 'gemini-2.0-flash';

// Instrução de sistema = comportamento + catálogo real da frota (2026).
const SYSTEM_INSTRUCTION = `${SYSTEM_INSTRUCTIONS}

═══════════════════ CATÁLOGO OFICIAL DA FROTA (2026) ═══════════════════
${fleetCatalogText(FLEET_CATALOG)}`;

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['POST'] })) return;
  if (takeRateLimit(req, 'ai', 12)) return res.status(429).json({ error: 'Muitos pedidos. Aguarde um minuto.' });
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'Assistente externo não configurado' });

  const userPrompt = cleanText(req.body?.userPrompt, 1200);
  if (!userPrompt) return res.status(400).json({ error: 'Mensagem obrigatória' });

  // Histórico -> turnos alternados user/model (formato Gemini).
  const historyTurns = (Array.isArray(req.body?.history) ? req.body.history.slice(-6) : [])
    .map((item) => {
      const role = (typeof item === 'object' && item?.role === 'assistant') ? 'model' : 'user';
      const text = cleanText(typeof item === 'string' ? item : item?.content, 500);
      return text ? { role, parts: [{ text }] } : null;
    })
    .filter(Boolean);

  const focus = cleanText(req.body?.sessionContext?.lastMentionedVehicle, 150);
  const userText = focus && focus.toLowerCase() !== 'nenhuma'
    ? `(Viatura em foco na conversa: ${focus})\n${userPrompt}`
    : userPrompt;

  const contents = [...historyTurns, { role: 'user', parts: [{ text: userText }] }];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents,
          generationConfig: { temperature: 0.5, topP: 0.9, maxOutputTokens: 400 },
        }),
      },
    );
    if (!response.ok) return res.status(502).json({ error: 'Assistente indisponível' });
    const data = await response.json();
    const message = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!message) return res.status(502).json({ error: 'Resposta vazia' });
    return res.status(200).json({ message });
  } catch {
    return res.status(503).json({ error: 'Assistente indisponível' });
  }
}
