import { OFFICIAL_WHATSAPP_NUMBER } from './whatsapp';

export interface AssistantResponse {
  message: string;
  recommendedVehicle?: string;
  quoteEstimate?: string;
  suggestedQuickReplies?: string[];
  bookingDraft?: {
    service?: string;
    vehicle?: string;
    location?: string;
    withDriver?: boolean;
  };
}

export const PEPEK_DEEP_KNOWLEDGE = `
Você é o Despachante Executivo & Especialista Técnico da PEPEK GRUPO RENT-A-CAR em Angola.
Seu nome de atendimento é: Central de Despacho Executivo PEPEK.
Você atende clientes corporativos, embaixadas, governantes, executivos de topo e particulares com tom sóbrio, educado, extremamente profissional, direto e humano (sem parecer um robô impessoal).

═══ REGRAS ABSOLUTAS DE ATENDIMENTO ═══
1. NUNCA mande o cliente para o WhatsApp de imediato antes de qualificá-lo e resolver a dúvida dele diretamente aqui na tela.
2. Ajude o cliente a escolher o veículo correto conforme a necessidade (cidade vs províncias vs protocolo).
3. Seja conciso (2 a 4 frases por resposta), direto, com respostas firmes e dados reais.
4. Quando o cliente fornecer dados de viagem, formalize a pré-reserva, valide o itinerário e confirme o registo.
5. Ofereça a continuidade: "Posso registar para que um gestor lhe ligue ou prefere o envio do comprovativo formatado para o WhatsApp?"

═══ DADOS COMPLETOS DA PEPEK GRUPO ═══
• Fundação: 2014 (Mais de 10 anos de mercado contínuo em Angola).
• Sede Principal: Talatona, Rua Reino do Bailundo, Luanda — Angola.
• Pólos Regionais: Huambo (Planalto Central) e Bengo (Caxito / Litoral Norte).
• Cobertura: Todas as 18 províncias de Angola com rede móvel de reboque e assistência técnica 24/7.
• Contactos: +244 923 719 090 / +244 923 000 010 | geral@pepekgrupo.com

═══ FROTA E RECOMENDAÇÕES TÉCNICAS ═══
1. SUV Executiva de Luxo (Land Cruiser Prado TXL/VX, Land Cruiser 300 VXR, Lexus LX 600):
   - Ideal para: Membros de direcção, ministros, diplomatas, eventos executivos e conforto supremo em Luanda e vias principais.
   - Lotação: 7 lugares | 5 malas grandes | Tração 4WD permanente | Ar condicionado duplo | Vidros fumados homologados.

2. 4x4 Todo-Terreno & Campo (Toyota Hilux Dupla Cabine, Toyota Fortuner 4x4):
   - Ideal para: Missões no interior, províncias (Huambo, Bengo, Benguela, Bié, Lunda Sul, etc.), engenharia, mineração, agro-negócio e terrenos difíceis.
   - Lotação: 5 lugares | Caixa de carga / 6 malas | 4x4 com redutoras | Suspensão reforçada | Protecção de cárter.

3. Vans Executivas VIP & Minibus (Toyota Hiace VIP 12 lugares, Toyota Quantum, Toyota Coaster 26 lugares):
   - Ideal para: Delegações diplomáticas, equipas técnicas de multinacionais, comitivas de conferências e transfers de tripulações.
   - Lotação: 12 a 26 passageiros | Ar condicionado independente para passageiros traseiros | Bancos individuais reclináveis.

4. Comboios Protocolares & Escolta:
   - Viaturas idênticas em cortejo com motoristas treinados em condução defensiva, escolta e etiqueta de estado.

═══ SERVIÇOS E REGIMES ═══
• Rent a Car (Livre Condução / Self-Drive): Aluguer diário, semanal ou mensal. Exige BI/Passaporte válido, Carta de condução com +2 anos e caução de garantia.
• Mobilidade Executiva com Motorista (Chauffeur): Viatura com motorista bilingue (Português, Inglês, Francês) fardado, formado em etiqueta, condução defensiva e sigilo absoluto. Não exige caução do cliente.
• Transfers Aeroporto (4 de Fevereiro e AIAAN Dr. António Agostinho Neto): Recepção Meet & Greet personalizada no desembarque com placa identificativa e monitorização de voo.
• Faturação & Pagamentos: Facturas formais AGT em Kwanzas (AOA) ou moedas internacionais (USD/EUR). Aceita Multicaixa, Multicaixa Express (EMIS), transferências BFA/BAI/Atlântico/Standard Bank, Visa, Mastercard e SWIFT.

═══ CLIENTES OFICIAIS DE REFERÊNCIA ═══
Embaixada dos Estados Unidos da América, Governo de Angola, Assembleia Nacional, ANPG (Agência Nacional de Petróleo e Gás), SONANGOL, TAAG Linhas Aéreas, BFA, Banco Atlântico, Standard Bank, UNICEF, Fidelidade Seguros, DSTV MultiChoice, ZAP, SIC (Serviço de Investigação Criminal), ELISAL, Catoca Diamantes, COSMOS Viagens, HV International, F.A.F (Federação Angolana de Futebol).
`;

export async function askPepekExecutiveAI(userPrompt: string, history: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<AssistantResponse> {
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
              parts: [{ text: `${PEPEK_DEEP_KNOWLEDGE}\n\nHistórico da conversa: ${JSON.stringify(history)}\n\nMensagem do Cliente: "${userPrompt}"\n\nResponda como um despachante executivo humano, discreto, direto e prestativo em português de Angola. Esclareça tecnicamente e pergunte se deseja firmar a reserva na central.` }]
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
            suggestedQuickReplies: generateContextualChips(userPrompt)
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call fallback:', err);
    }
  }

  // Fallback Inteligente de Despachante Humano
  return generateHumanDispatcherReply(userPrompt);
}

function generateContextualChips(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  if (lower.includes('aeroporto') || lower.includes('transfer')) {
    return ['Transfer no Aeroporto 4 de Fevereiro', 'Transfer no Novo Aeroporto (AIAAN)', 'Com Motorista Executivo', 'Saber Requisitos'];
  }
  if (lower.includes('província') || lower.includes('huambo') || lower.includes('bengo') || lower.includes('campo')) {
    return ['Toyota Hilux 4x4', 'Toyota Prado 4WD', 'Preço com Motorista', 'Seguro & Assistência 24/7'];
  }
  if (lower.includes('empresa') || lower.includes('corporativo') || lower.includes('frotas') || lower.includes('fatura')) {
    return ['Contrato Mensal de Frota', 'Facturação AGT', 'Viatura de Substituição', 'Falar com Gestor de Contas'];
  }
  return ['Toyota Land Cruiser Prado', 'Toyota Hilux 4x4 Todo-Terreno', 'Transfer Aeroporto VIP', 'Contrato para Empresa'];
}

function generateHumanDispatcherReply(prompt: string): AssistantResponse {
  const lower = prompt.toLowerCase();

  if (lower.includes('ajuda') || lower.includes('qual carro') || lower.includes('recomenda') || lower.includes('indeciso')) {
    return {
      message: 'Com certeza. Para deslocações executivas na cidade de Luanda e compromissos protocolares, recomendamos a nossa SUV Land Cruiser Prado ou LC300. Se a sua viagem envolver províncias (Huambo, Bengo ou vias não asfaltadas), a Toyota Hilux 4x4 Dupla Cabine é a viatura mais recomendada pela sua robustez e tracção com redutoras. Qual é o seu itinerário previsto?',
      recommendedVehicle: 'Land Cruiser Prado / Hilux 4x4',
      suggestedQuickReplies: ['Deslocação em Luanda', 'Viagem Interprovincial', 'Transfer Aeroporto', 'Aluguer com Motorista']
    };
  }

  if (lower.includes('aeroporto') || lower.includes('transfer') || lower.includes('voo') || lower.includes('desembarque')) {
    return {
      message: 'Organizamos o serviço de Transfer VIP nos Aeroportos 4 de Fevereiro e AIAAN. O nosso chauffeur aguarda no desembarque devidamente fardado com placa de identificação da sua entidade, água lacrada e viatura climatizada. Deseja agendar a recepção para que data e voo?',
      recommendedVehicle: 'SUV Executiva (Prado / LC300)',
      suggestedQuickReplies: ['Sim, agendar transfer', 'Qual é a viatura utilizada?', 'Ver opções de pagamento', 'Falar com operações']
    };
  }

  if (lower.includes('preço') || lower.includes('valor') || lower.includes('quanto') || lower.includes('custo') || lower.includes('tabela')) {
    return {
      message: 'Os valores são estruturados consoante o modelo (SUV Executiva, 4x4 de campo, Van VIP), o período (diário, semanal ou mensal) e a opção com ou sem motorista protocolar. Todas as propostas incluem seguro de cobertura total e viatura de substituição. Para quantas diárias e qual o modelo de sua preferência?',
      suggestedQuickReplies: ['SUV Land Cruiser Prado', 'Hilux 4x4 Todo-Terreno', 'Van VIP 12 Lugares', 'Contrato Mensal Empresa']
    };
  }

  if (lower.includes('requisito') || lower.includes('documento') || lower.includes('caução') || lower.includes('condições')) {
    return {
      message: 'Para Livre Condução (Self-Drive) é necessária a apresentação de BI ou Passaporte válido, Carta de Condução com mais de 2 anos e caução reembolsável. No regime com Motorista Executivo PEPEK, não é exigida caução ao cliente nem carta de condução, ficando toda a responsabilidade a cargo do nosso chauffeur credenciado.',
      suggestedQuickReplies: ['Prefiro Com Motorista', 'Prefiro Livre Condução', 'Quero uma Proposta', 'Contactar Central']
    };
  }

  if (lower.includes('huambo') || lower.includes('bengo') || lower.includes('província') || lower.includes('interior')) {
    return {
      message: 'Dispomos de bases permanentes em Luanda, Huambo e Bengo, com autorização de circulação e apoio mecânico móvel 24/7 em todas as 18 províncias de Angola. As nossas viaturas de campo vêm equipadas com pneus adequados, ferramentas de apoio e rastreio GPS. Deseja viatura para quantos passageiros?',
      recommendedVehicle: 'Toyota Hilux / Fortuner 4x4',
      suggestedQuickReplies: ['Toyota Hilux 4x4', 'Toyota Prado 4WD', 'Consultar Disponibilidade', 'Falar com Despacho']
    };
  }

  if (lower.includes('empresa') || lower.includes('contrato') || lower.includes('fatura') || lower.includes('agt') || lower.includes('embaixada')) {
    return {
      message: 'Emitimos faturação eletrónica formal em total conformidade com a AGT em Kwanzas (AOA) ou moeda estrangeira (USD/EUR). Para embaixadas e empresas credenciadas, disponibilizamos acordos-quadro de frotas com pagamento a 30 dias e gestor de conta institucional dedicado.',
      suggestedQuickReplies: ['Solicitar Acordo Corporativo', 'Faturação em AOA', 'Faturação em USD/EUR', 'Falar com Gestor Institucional']
    };
  }

  return {
    message: 'Central de Operações da PEPEK GRUPO à sua inteira disposição. Posso prestar-lhe esclarecimentos técnicos sobre qualquer viatura da nossa frota, estimar itinerários para as províncias ou firmar o registo da sua reserva imediatamente.',
    suggestedQuickReplies: ['Ver Opções da Frota', 'Como Funciona a Reserva', 'Transfers de Aeroporto', 'Contratos para Empresas']
  };
}
