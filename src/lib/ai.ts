import { OFFICIAL_WHATSAPP_NUMBER } from './whatsapp';

export interface AssistantResponse {
  message: string;
  suggestedAction?: 'quote' | 'fleet' | 'whatsapp_handoff' | 'call';
  handoffSummary?: string;
}

const PEPEK_KNOWLEDGE = `
Você é o Assistente Virtual Executivo da PEPEK GRUPO RENT-A-CAR (Angola).
Slogan: "Movemos quem move Angola."
Fundada: 2014 (Mais de 10 anos de liderança em mobilidade corporativa e institucional).
Áreas de actuação: Luanda (Sede e Aeroporto Internacional), Huambo, Bengo e cobertura em todo o território nacional angolano.
Contacto directo: +244 923 719 090 / geral@pepekgrupo.com

SERVIÇOS OFERECIDOS:
1. Rent-a-Car: Aluguer diário, semanal ou mensal com ou sem motorista executivo.
2. Mobilidade Executiva: Viaturas de luxo com motoristas qualificados em condução defensiva, protocolo e discrição total.
3. Transfers Aeroporto: Recepção personalizada "Meet & Greet" no Aeroporto Internacional 4 de Fevereiro / Novo Aeroporto de Luanda e transfers interprovinciais.
4. Soluções Corporativas & Gestão de Frotas: Aluguer de longa duração para empresas, delegações diplomáticas, embaixadas e instituições de estado.

CLIENTES DE REFERÊNCIA (CONFIANÇA INSTITUCIONAL):
- Embaixadas (incluindo Embaixada dos Estados Unidos da América)
- Governo de Angola & Assembleia Nacional
- SONANGOL, TAAG Linhas Aéreas de Angola, Banco BFA, Fidelidade Seguros, DSTV Angola, UNICEF.

FROTA:
- SUV Executiva (Toyota Land Cruiser Prado, Land Cruiser 300, Lexus LX)
- 4x4 Off-Road & Pick-ups (Toyota Hilux, Fortuner para operações industriais e campo)
- Vans VIP & Minibus (Toyota Hiace VIP, Coaster para comitivas e delegações)
- Frotas especiais para eventos de estado e conferências internacionais.
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
              parts: [{ text: `${PEPEK_KNOWLEDGE}\n\nHistórico da conversa: ${JSON.stringify(history)}\n\nPergunta do cliente: "${userPrompt}"\n\nResponda em tom formal, executivo, focado e prestativo em português de Angola. Seja conciso e ofereça fechar a proposta ou transferir para WhatsApp executivo.` }]
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            message: text,
            suggestedAction: text.toLowerCase().includes('whatsapp') ? 'whatsapp_handoff' : 'quote'
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call error:', err);
    }
  }

  // Fallback Inteligente de Qualificação Automática
  const lower = userPrompt.toLowerCase();
  
  if (lower.includes('preço') || lower.includes('valor') || lower.includes('custo') || lower.includes('orçamento')) {
    return {
      message: 'As nossas propostas são personalizadas de acordo com o tipo de viatura (SUV, 4x4, Van VIP), modalidade (com ou sem motorista) e tempo de aluguer. Posso preparar a sua solicitação prioritária ou encaminhar agora mesmo para o nosso gestor de contas executivo no WhatsApp.',
      suggestedAction: 'whatsapp_handoff',
      handoffSummary: 'Solicitação de cotação de valores'
    };
  }

  if (lower.includes('aeroporto') || lower.includes('transfer') || lower.includes('voo')) {
    return {
      message: 'Oferecemos o serviço completo de Transfer Executivo com recepção "Meet & Greet" no Aeroporto Internacional de Luanda. O nosso motorista aguarda devidamente identificado no desembarque com viatura climatizada e água a bordo.',
      suggestedAction: 'quote',
      handoffSummary: 'Reserva de Transfer Aeroporto'
    };
  }

  if (lower.includes('motorista') || lower.includes('chófer') || lower.includes('executiva') || lower.includes('protocolo')) {
    return {
      message: 'Os nossos motoristas executivos possuem rigoroso treino em condução defensiva, etiqueta protocolar e discrição absoluta. Serviço ideal para diplomatas, empresários e delegações oficiais.',
      suggestedAction: 'quote',
      handoffSummary: 'Mobilidade Executiva com Motorista'
    };
  }

  if (lower.includes('huambo') || lower.includes('bengo') || lower.includes('província') || lower.includes('fora de luanda')) {
    return {
      message: 'A PEPEK GRUPO possui capacidade operacional comprovada para viagens interprovinciais com assistência técnica 24/7 e frotas 4x4 preparadas para qualquer itinerário em Angola.',
      suggestedAction: 'quote',
      handoffSummary: 'Operação Interprovincial (Huambo/Bengo/Interior)'
    };
  }

  if (lower.includes('empresa') || lower.includes('corporativo') || lower.includes('fatura') || lower.includes('embaixada')) {
    return {
      message: 'Trabalhamos com faturação formal, contratos de aluguer corporativo de média e longa duração para embaixadas, empresas multinacionais e entidades governamentais com gestor de conta dedicado.',
      suggestedAction: 'whatsapp_handoff',
      handoffSummary: 'Contacto Corporativo / Institucional'
    };
  }

  return {
    message: 'Bem-vindo à PEPEK GRUPO RENT-A-CAR. Estamos à disposição para organizar o seu aluguer de viaturas de luxo, transfers ou mobilidade corporativa em Angola com total segurança e pontualidade. Em que posso ajudar hoje?',
    suggestedAction: 'quote'
  };
}

export function generateHandoffUrl(summary?: string, historyTranscript?: string): string {
  let text = `*TRANSFERÊNCIA DE ATENDIMENTO — ASSISTENTE IA PEPEK*\n`;
  text += `-----------------------------------------\n`;
  if (summary) {
    text += `*Assunto:* ${summary}\n`;
  }
  if (historyTranscript) {
    text += `*Contexto:* ${historyTranscript.slice(-250)}\n`;
  }
  text += `\n_Gostaria de continuar o atendimento com um gestor comercial da PEPEK GRUPO._`;
  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
