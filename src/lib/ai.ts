import { OFFICIAL_WHATSAPP_NUMBER } from './whatsapp';

export interface AssistantResponse {
  message: string;
  suggestedAction?: 'quote' | 'fleet' | 'whatsapp_handoff' | 'call';
  handoffSummary?: string;
}

const PEPEK_EXECUTIVE_SYSTEM_PROMPT = `
Você é o Concierge Executivo da PEPEK GRUPO RENT-A-CAR (Angola).
Slogan: "Movemos quem move Angola."
Perfil: Altamente discreto, conciso, refinado, directo e orientado a soluções imediatas para diplomatas, empresários, executivos de topo e embaixadas.

INSTRUÇÕES DE TOM E RESPOSTA:
1. Seja directo e conciso. Máximo 2 a 3 frases por resposta. Evite rodeios, saudações excessivas ou textos longos.
2. Trate o interlocutor com elegância executiva ("Exmo(a). Senhor(a)", "Com certeza", "À sua inteira disposição").
3. Apresente prontamente a viatura ou serviço adequado (Land Cruiser Prado, LC300, Hilux 4x4, Hiace VIP, Chauffeur de protocolo, Transfer Aeroporto 4 de Fevereiro / AIAAN).
4. Ofereça de forma natural e discreta a finalização imediata através do canal oficial de despacho no WhatsApp (+244 923 719 090).

DADOS DA EMPRESA:
- Sede: Talatona, Rua Reino do Bailundo, Luanda.
- Pólos: Huambo e Bengo, com cobertura e assistência nas 18 províncias.
- Contactos: +244 923 719 090 / 923 000 010 | geral@pepekgrupo.com
- Clientes oficiais: Embaixadas (incluindo EUA), Governo de Angola, Assembleia Nacional, SONANGOL, TAAG, BFA, Fidelidade, DSTV, UNICEF.
`;

export async function askPepekAssistant(userPrompt: string, history: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<AssistantResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${PEPEK_EXECUTIVE_SYSTEM_PROMPT}\n\nHistórico recente: ${JSON.stringify(history)}\n\nSolicitação: "${userPrompt}"\n\nResponda em português formal angolano, em 2 a 3 frases precisas e discretas.` }]
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            message: text.trim(),
            suggestedAction: 'whatsapp_handoff'
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call error:', err);
    }
  }

  // Respostas Directas, Executivas & Discretas (Fallback de Alta Precisão)
  const lower = userPrompt.toLowerCase();

  if (lower.includes('preço') || lower.includes('valor') || lower.includes('custo') || lower.includes('orçamento') || lower.includes('prado') || lower.includes('suv')) {
    return {
      message: 'Dispomos de SUVs Executivas (Land Cruiser Prado e LC300) em regime diário, semanal ou mensal, com ou sem motorista protocolar. O nosso gestor comercial envia-lhe a proposta detalhada em 5 minutos.',
      suggestedAction: 'whatsapp_handoff',
      handoffSummary: 'Cotação Imediata SUV Executiva / Prado'
    };
  }

  if (lower.includes('aeroporto') || lower.includes('transfer') || lower.includes('voo') || lower.includes('desembarque')) {
    return {
      message: 'Realizamos o Transfer VIP Meet & Greet nos Aeroportos 4 de Fevereiro e AIAAN, com recepção personalizada na área de desembarque e viatura climatizada de alta gama. Podemos registar o número do seu voo?',
      suggestedAction: 'quote',
      handoffSummary: 'Transfer VIP Aeroporto Internacional'
    };
  }

  if (lower.includes('motorista') || lower.includes('chauffeur') || lower.includes('protocolo') || lower.includes('diplomát')) {
    return {
      message: 'Os nossos motoristas possuem certificação em condução defensiva, etiqueta diplomática e sigilo absoluto, adequados para chefias de estado e comitivas empresariais.',
      suggestedAction: 'whatsapp_handoff',
      handoffSummary: 'Motorista Protocolar & Segurança'
    };
  }

  if (lower.includes('empresa') || lower.includes('contrato') || lower.includes('mensal') || lower.includes('fatura') || lower.includes('frotas')) {
    return {
      message: 'Estruturamos contratos de outsourcing e gestão de frota com faturação formal AGT e viatura de substituição imediata. Posso ligar-lhe a um gestor institucional.',
      suggestedAction: 'whatsapp_handoff',
      handoffSummary: 'Acordo Corporativo / Gestão de Frota'
    };
  }

  if (lower.includes('huambo') || lower.includes('bengo') || lower.includes('província') || lower.includes('interior')) {
    return {
      message: 'Garantimos apoio operacional e viaturas 4x4 equipadas para viagens interprovinciais (Huambo, Bengo e todo o território) com assistência móvel 24/7.',
      suggestedAction: 'quote',
      handoffSummary: 'Operação Interprovincial Angola'
    };
  }

  return {
    message: 'À sua inteira disposição na PEPEK GRUPO RENT-A-CAR. Em que podemos apoiar a sua mobilidade ou a da sua instituição em Angola hoje?',
    suggestedAction: 'quote'
  };
}

export function generateHandoffUrl(summary?: string, historyTranscript?: string): string {
  let text = `*SOLICITAÇÃO EXECUTIVA — PEPEK GRUPO RENT-A-CAR*\n`;
  text += `-----------------------------------------\n`;
  if (summary) {
    text += `*Assunto:* ${summary}\n`;
  }
  if (historyTranscript) {
    text += `*Notas:* ${historyTranscript.slice(-250)}\n`;
  }
  text += `\n_Solicito atendimento prioritário com um gestor de operações PEPEK._`;
  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
