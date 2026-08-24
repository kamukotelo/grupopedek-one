import { applyApiSecurity, cleanText, takeRateLimit } from './_security.js';

export default async function handler(req, res) {
  if (!applyApiSecurity(req, res, { methods: ['POST'] })) return;
  if (takeRateLimit(req, 'ai', 12)) return res.status(429).json({ error: 'Muitos pedidos. Aguarde um minuto.' });
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'Assistente externo não configurado' });

  const userPrompt = cleanText(req.body?.userPrompt, 1200);
  if (!userPrompt) return res.status(400).json({ error: 'Mensagem obrigatória' });
  const history = Array.isArray(req.body?.history)
    ? req.body.history.slice(-6).map((item) => cleanText(typeof item === 'string' ? item : JSON.stringify(item), 500))
    : [];
  const vehicle = cleanText(req.body?.sessionContext?.lastMentionedVehicle || 'Nenhuma', 150);
  const instruction = `Você é o consultor da PEPEK GRUPO RENT-A-CAR em Angola. Responda em 1 a 3 frases, no idioma do cliente, com tom humano e profissional. Faça uma pergunta por vez. Não invente preços, disponibilidade, pagamentos ou políticas. Para reclamações, cancelamentos, emergências e situações contratuais, encaminhe para atendimento humano. Viatura em foco: ${vehicle}. Histórico: ${JSON.stringify(history)}. Pergunta: ${userPrompt}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: instruction }] }] }),
    });
    if (!response.ok) return res.status(502).json({ error: 'Assistente indisponível' });
    const data = await response.json();
    const message = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!message) return res.status(502).json({ error: 'Resposta vazia' });
    return res.status(200).json({ message });
  } catch {
    return res.status(503).json({ error: 'Assistente indisponível' });
  }
}
