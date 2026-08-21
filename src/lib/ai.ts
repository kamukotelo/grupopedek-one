import { OFFICIAL_WHATSAPP_NUMBER } from './whatsapp';
import { FLEET_DATABASE } from '../data/fleetData';

export interface AssistantResponse {
  message: string;
  recommendedVehicle?: string;
  suggestedQuickReplies?: string[];
  requiresHumanHandover?: boolean;
  handoverContext?: string;
}

export interface SessionContext {
  lastMentionedVehicle?: string;
  currentIntent?: string;
  step?: 'idle' | 'awaiting_passengers' | 'awaiting_dates' | 'awaiting_location' | 'ready_to_quote';
  collectedData?: {
    passengers?: number;
    destination?: string;
    dates?: string;
    serviceType?: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT DE SISTEMA — GEMINI AI (PEPEK GRUPO)
// ─────────────────────────────────────────────────────────────────────────────
export const GEMINI_SYSTEM_INSTRUCTIONS = `
Você é o Gestor de Atendimento da PEPEK GRUPO RENT-A-CAR em Angola.
Seu objetivo é conversar de forma calorosa, humana, direta e profissional, ajudando o cliente a encontrar a viatura e o serviço de mobilidade ideal.

═══ PRINCÍPIOS DE TOM E COMPORTAMENTO ═══
1. LINGUAGEM NATURAL E CONCISA: Responda em 1 a 3 frases curtas, como se estivesse ao telefone ou numa mensagem WhatsApp de um gestor experiente. NUNCA envie blocos gigantescos de texto ou listas intermináveis.
2. SOM COMO HUMANO, NUNCA COMO SISTEMA: NUNCA use termos de software (ex: "módulo Odoo", "detectámos a sua credencial", "banco de dados", "XML-RPC"). Fale como um consultor da Pepek Grupo fala com um cliente presencialmente em Talatona.
3. UMA PERGUNTA DE CADA VEZ: Se precisar de mais informações para recomendar uma viatura, faça apenas UMA pergunta por vez (ex: "Quantas pessoas vão viajar consigo?").
4. MEMÓRIA DE CONVERSA: Lembre-se das viaturas que o cliente já mencionou na conversa atual (ex: "Voltando à Land Cruiser Prado que mencionou...").
5. SABE QUANDO NÃO SABE: Para preços não tabelados, situações contratuais específicas, reclamações ou cancelamentos, admita com naturalidade e ofereça passar de imediato a um despachante humano no WhatsApp ou chamada. Nunca invente dados.
6. SEGURANÇA E ANOMINATO: Trate todo visitante como anónimo a menos que ele se identifique expressamente na conversa.

═══ DADOS OFICIAIS PEPEK GRUPO ═══
• Sede: Talatona, Rua Reino do Bailundo, Luanda — Angola.
• Pólos de Apoio: Huambo (Planalto Central) e Bengo (Caxito).
• Linha 24/7: +244 923 719 090 / 923 000 010 | geral@pepekgrupo.com
• Frota Oficial (47 Viaturas em 6 Categorias):
  - Luxo e Executivo (19 viaturas): Range Rover Blindado 2025 (1.999.999 Kz/dia), Mercedes Classe S 2025 (1.449.999 Kz/dia), Range Rover Novo Modelo (1.449.999 Kz/dia), Mercedes G63 2023 (999.999 Kz/dia), Lexus 600 (800.000 Kz/dia), Toyota LC300 2023 (599.999 Kz/dia), Toyota LC V8 (449.999 Kz/dia), Volvo XC60 (349.999 Kz/dia), Novo Toyota Prado 2024 (349.999 Kz/dia), Nissan Patrol V8 (349.999 Kz/dia), Toyota Prado Atual (289.999 Kz/dia), Toyota Fortuner (199.999 Kz/dia).
  - Vans e Transporte (8 viaturas): Mercedes-Benz V300 Class VIP (800.000 Kz/dia), Hyundai Staria Executiva (449.999 Kz/dia), Toyota Coaster 30L (399.999 Kz/dia), Mercedes Sprinter 21L (369.999 Kz/dia), Nova Toyota Hiace 15L (359.999 Kz/dia), Hyundai H1 (349.999 Kz/dia), Toyota Hiace (199.999 Kz/dia).
  - SUVs (6 viaturas): Jetour X70 7L (189.999 Kz/dia), Hyundai Santa Fé (149.999 Kz/dia), Hyundai Tucson (149.999 Kz/dia), Chery Tiggo 7 (149.999 Kz/dia), Chery Tiggo 2 (129.999 Kz/dia), Hyundai Creta (129.999 Kz/dia).
  - Pick-ups e Camiões (5 viaturas): Toyota LC HZ (259.999 Kz/dia), Toyota LC HZ 18P (249.999 Kz/dia), Mitsubishi Canter Camião (159.999 Kz/dia), Mitsubishi L200 (159.999 Kz/dia), Toyota Hilux Dupla Cabine (159.999 Kz/dia).
  - Económicos (8 viaturas): Suzuki Swift (69.999 Kz/dia), Suzuki Baleno (69.999 Kz/dia), Hyundai i20 (59.999 Kz/dia), Suzuki S-Presso (59.999 Kz/dia), Toyota Starlet (59.999 Kz/dia), Hyundai Grand i10 (49.999 Kz/dia), Kia Morning (44.999 Kz/dia), Suzuki Celerio (44.999 Kz/dia).
  - Eventos Especiais (1 viatura): Limousine Presidencial 20 Lugares (999.999 Kz/dia).
• Pagamentos: Multicaixa e Express em Angola; Cartões, Multibanco e MB WAY para Portugal e Europa; Faturação AGT em AOA.
• Seguros & Extras: Cobertura total com viatura de substituição em caso de imprevisto. Motorista profissional (35.000 Kz/dia), Higienização e combustível (35.000 Kz/dia).
`;

// ─────────────────────────────────────────────────────────────────────────────
// MOTOR PRINCIPAL DE ATENDIMENTO CONVERSACIONAL (GEMINI + FALLBACK HUMANIZADO)
// ─────────────────────────────────────────────────────────────────────────────
export async function askPepekExecutiveAI(
  userPrompt: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  sessionContext?: SessionContext
): Promise<AssistantResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `${GEMINI_SYSTEM_INSTRUCTIONS}
Contexto da sessão actual: Viatura em foco: "${sessionContext?.lastMentionedVehicle || 'Nenhuma'}".
Histórico recente da conversa: ${JSON.stringify(history.slice(-6))}
Pergunta do cliente: "${userPrompt}"

Instrução: Responda diretamente ao cliente com no máximo 2 a 3 frases, tom humano, caloroso e focado em ajudá-lo.`
                  }
                ]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            message: text.trim(),
            suggestedQuickReplies: generateDynamicReplies(userPrompt, sessionContext)
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, using human intent matcher fallback:', err);
    }
  }

  // Motor determinístico de intenções com linguagem natural humana
  return processIntentMatch(userPrompt, sessionContext);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAPA DE INTENTS E RESPOSTAS ESTRUTURADAS (SEM ALUCINAÇÕES)
// ─────────────────────────────────────────────────────────────────────────────
function processIntentMatch(prompt: string, context?: SessionContext): AssistantResponse {
  const lower = prompt.toLowerCase();

  // 1. INTENT: Reclamação ou Problema Urgente na Estrada
  if (
    lower.includes('avariou') ||
    lower.includes('problema') ||
    lower.includes('acidente') ||
    lower.includes('furo') ||
    lower.includes('socorro') ||
    lower.includes('emergência') ||
    lower.includes('urgente')
  ) {
    return {
      message: 'Lamento imenso a situação. A nossa linha de apoio e reboque 24 horas está em prontidão para intervir imediatamente. Vou transferi-lo agora mesmo para a nossa equipa operacional de emergência.',
      requiresHumanHandover: true,
      handoverContext: 'Assistência Urgente / Viatura na Estrada',
      suggestedQuickReplies: ['Ligar para +244 923 719 090', 'Enviar Localização no WhatsApp']
    };
  }

  // 2. INTENT: Falar com Humano / Atendimento Direto
  if (
    lower.includes('humano') ||
    lower.includes('pessoa') ||
    lower.includes('falar com alguém') ||
    lower.includes('atendente') ||
    lower.includes('gestor') ||
    lower.includes('telefone') ||
    lower.includes('ligar')
  ) {
    return {
      message: 'Com certeza! Pode falar diretamente com um dos nossos consultores em Talatona por WhatsApp ou chamada telefónica.',
      requiresHumanHandover: true,
      handoverContext: 'Solicitação de Atendimento Humano',
      suggestedQuickReplies: ['Abrir WhatsApp da Central', 'Ligar 24/7 (+244 923 719 090)']
    };
  }

  // 3. INTENT: Alterar ou Cancelar Reserva Existente
  if (lower.includes('cancelar') || lower.includes('mudar data') || lower.includes('alterar reserva') || lower.includes('trocar data')) {
    return {
      message: 'Para alterar datas ou cancelar uma reserva confirmada, a nossa equipa de despacho trata disso de imediato com a referência do seu processo. Posso encaminhá-lo para a nossa central agora mesmo.',
      requiresHumanHandover: true,
      handoverContext: 'Alteração/Cancelamento de Reserva',
      suggestedQuickReplies: ['Falar com Despacho no WhatsApp', 'Consultar Política de Cancelamento']
    };
  }

  // 4. INTENT: Eventos de Grande Escala ou Cimeiras (10+ viaturas)
  if (lower.includes('cimeira') || lower.includes('conferência') || lower.includes('50 pessoas') || lower.includes('100 pessoas') || lower.includes('várias viaturas') || lower.includes('grande comitiva')) {
    return {
      message: 'Temos vasta experiência na coordenação de frotas completas para cimeiras e eventos internacionais. Para dimensionarmos o comboio e os motoristas dedicados, vou colocá-lo em contacto com o nosso Gestor de Grandes Contas.',
      requiresHumanHandover: true,
      handoverContext: 'Comitiva de Grande Escala / Cimeira',
      suggestedQuickReplies: ['Falar com Gestor de Contas', 'Ver Vans e Minibus VIP']
    };
  }

  // 5. INTENT: Pedir Recomendação de Viatura
  if (lower.includes('qual carro') || lower.includes('que viatura') || lower.includes('qual escolher') || lower.includes('recomenda') || lower.includes('indeciso')) {
    return {
      message: 'Terei todo o gosto em ajudar. Para quantas pessoas será a viagem e o trajeto será em Luanda ou envolverá províncias?',
      suggestedQuickReplies: ['Até 4 pessoas (Luanda)', 'Grupo até 7 pessoas', 'Comitiva (12+ pessoas)', 'Viagem ao Interior / Províncias']
    };
  }

  // 6. INTENT: Comparar Viaturas (SUV vs 4x4 vs Van)
  if (lower.includes('diferença entre') || lower.includes('comparar') || (lower.includes('suv') && lower.includes('4x4')) || (lower.includes('van') && lower.includes('suv'))) {
    return {
      message: 'A Land Cruiser Prado foca-se no conforto e prestígio executivo para até 7 pessoas. Já a Hilux 4x4 é a mais indicada se o trajeto tiver pisos irregulares ou carga no interior de Angola. Se for uma comitiva de equipa, a Van Hiace VIP leva até 12 pessoas com poltronas individuais. Qual destes cenários se aproxima mais do seu plano?',
      suggestedQuickReplies: ['Land Cruiser Prado', 'Hilux 4x4 Todo-Terreno', 'Van Hiace VIP 12L', 'Comparar no Ecrã']
    };
  }

  // 7. INTENT: Detalhes Técnicos de Viatura
  if (lower.includes('quantos lugares') || lower.includes('quantas malas') || lower.includes('ar condicionado') || lower.includes('automática') || lower.includes('combustível')) {
    const isPrado = lower.includes('prado') || lower.includes('lc300') || lower.includes('suv');
    const isHilux = lower.includes('hilux') || lower.includes('4x4');
    const isVan = lower.includes('van') || lower.includes('hiace');

    if (isVan) {
      return {
        message: 'A nossa Toyota Hiace VIP dispõe de 12 poltronas individuais reclináveis em pele, capacidade para 10 malas grandes, caixa automática e ar condicionado independente para todos os passageiros traseiros.',
        recommendedVehicle: 'Toyota Hiace VIP 12L',
        suggestedQuickReplies: ['Ver Fotos da Van', 'Saber Preço Diário', 'Reservar Van VIP']
      };
    }

    if (isHilux) {
      return {
        message: 'A Toyota Hilux 4x4 Dupla Cabine tem 5 lugares, caixa de carga reforçada para 6 malas, tração 4x4 com redutoras e ar condicionado tropicalizado.',
        recommendedVehicle: 'Toyota Hilux 4x4',
        suggestedQuickReplies: ['Ver Fotos da Hilux', 'Saber Diária da Hilux', 'Reservar para Províncias']
      };
    }

    return {
      message: 'A Land Cruiser Prado tem 7 lugares confortáveis, espaço para 5 malas grandes, tração 4WD permanente, caixa automática e climatização individual Quad-Zone.',
      recommendedVehicle: 'Toyota Land Cruiser Prado',
      suggestedQuickReplies: ['Ver Galeria da Prado', 'Reservar Prado', 'Consultar Outra Viatura']
    };
  }

  // 8. INTENT: Disponibilidade
  if (lower.includes('disponível') || lower.includes('tem para hoje') || lower.includes('tem vaga') || lower.includes('tem carro')) {
    return {
      message: 'Temos habitualmente viaturas em prontidão na nossa base de Talatona (SUVs, 4x4 e Vans). Para que datas e que modelo pretendia?',
      suggestedQuickReplies: ['Para Hoje / Imediato', 'Para Esta Semana', 'SUV Land Cruiser', 'Van Executiva']
    };
  }

  // 9. INTENT: Como Reservar / Processo
  if (lower.includes('como reservar') || lower.includes('como funciona') || lower.includes('processo') || lower.includes('como alugo')) {
    return {
      message: 'O processo é simples: escolhe o modelo e as datas aqui no site, e a nossa equipa confirma a alocação de imediato com o envio da confirmação formal. Pretende que o apoie com uma cotação rápida?',
      suggestedQuickReplies: ['Sim, pedir cotação', 'Prefiro alugar com motorista', 'Prefiro sem motorista']
    };
  }

  // 10. INTENT: Preços e Tarifas Diárias
  if (lower.includes('preço') || lower.includes('quanto custa') || lower.includes('valor') || lower.includes('diária') || lower.includes('tarifa')) {
    return {
      message: 'As nossas tarifas iniciam nos 135.000 AOA (~€150) para 4x4 Hilux, 185.000 AOA (~€205) para SUV Land Cruiser Prado, e 210.000 AOA (~€230) para Van VIP 12L. Todas as diárias incluem seguro total e apoio 24/7. Para quantos dias necessita da viatura?',
      suggestedQuickReplies: ['1 a 3 dias', '1 semana', 'Aluguer Mensal', 'Proposta para Empresa']
    };
  }

  // 11. INTENT: Métodos de Pagamento e Moedas
  if (lower.includes('pagamento') || lower.includes('pagar') || lower.includes('cartão') || lower.includes('multicaixa') || lower.includes('euros') || lower.includes('dólares')) {
    return {
      message: 'Aceitamos Multicaixa e Express em Angola, bem como cartões Visa, Mastercard e MB WAY para clientes em Portugal e Europa. Emitimos faturas formais em Kwanzas (AOA) ou Euros (EUR).',
      suggestedQuickReplies: ['Faturação para Empresa', 'Pagamento Multicaixa Express', 'Cartão Internacional']
    };
  }

  // 12. INTENT: Faturação para Empresas / Embaixadas
  if (lower.includes('fatura') || lower.includes('factura') || lower.includes('agt') || lower.includes('nif') || lower.includes('empresa') || lower.includes('instituição')) {
    return {
      message: 'Sim, emitimos faturação certificada em conformidade com a AGT para empresas, ministérios e embaixadas, com possibilidade de conta-corrente corporativa. A faturação será em nome de entidade em Angola ou no exterior?',
      suggestedQuickReplies: ['Empresa em Angola (AGT)', 'Embaixada / Diplomático', 'Entidade em Portugal / Europa']
    };
  }

  // 13. INTENT: Motorista Bilingue (Protocolo)
  if (lower.includes('motorista') || lower.includes('inglês') || lower.includes('francês') || lower.includes('chauffeur') || lower.includes('condutor')) {
    return {
      message: 'Dispomos de motoristas profissionais com farda executiva, certificados em condução defensiva e fluentes em Português, Inglês e Francês. Deseja motorista bilingue para a sua reserva?',
      suggestedQuickReplies: ['Sim, motorista em Inglês', 'Sim, motorista em Francês', 'Apenas em Português', 'Prefiro sem motorista']
    };
  }

  // 14. INTENT: Cobertura Geográfica / Províncias
  if (lower.includes('província') || lower.includes('huambo') || lower.includes('bengo') || lower.includes('benguela') || lower.includes('fora de luanda') || lower.includes('interior')) {
    return {
      message: 'Cobrimos todas as 18 províncias de Angola com bases fixas em Luanda, Huambo e Bengo, e rede de assistência móvel permanente. Para que província planeia deslocar-se?',
      suggestedQuickReplies: ['Huambo', 'Bengo', 'Benguela / Lobito', 'Outra Província']
    };
  }

  // 15. INTENT: Transfer Aeroporto
  if (lower.includes('aeroporto') || lower.includes('transfer') || lower.includes('voo') || lower.includes('aiaan') || lower.includes('4 de fevereiro')) {
    return {
      message: 'Fazemos transfers VIP nos Aeroportos 4 de Fevereiro e Novo Aeroporto Internacional Dr. António Agostinho Neto (AIAAN). O motorista aguarda no desembarque com placa identificativa. Qual é a data e voo previsto?',
      suggestedQuickReplies: ['Aeroporto 4 de Fevereiro', 'Aeroporto AIAAN (Novo)', 'Transfer com Land Cruiser', 'Transfer com Van VIP']
    };
  }

  // 16. INTENT: Seguro e Garantias
  if (lower.includes('seguro') || lower.includes('avaria') || lower.includes('acontecer algo') || lower.includes('garantia')) {
    return {
      message: 'Todas as nossas viaturas dispõem de seguro de cobertura total e garantia de substituição imediata em caso de imprevisto mecânico em qualquer ponto de Angola.',
      suggestedQuickReplies: ['Ver Ficha das Viaturas', 'Pedir Cotação com Seguro', 'Falar com Consultor']
    };
  }

  // 17. INTENT: Discrição e Protocolo Diplomático
  if (lower.includes('diplomático') || lower.includes('embaixada') || lower.includes('discrição') || lower.includes('confidencial') || lower.includes('segurança')) {
    return {
      message: 'Trabalhamos regularmente com embaixadas e entidades de estado, garantindo sigilo absoluto, viaturas discretas com vidros de segurança e condutores credenciados.',
      suggestedQuickReplies: ['Proposta para Embaixada', 'Comboio de Segurança', 'Contactar Gestor Diplomático']
    };
  }

  // 18. INTENT: Horário de Funcionamento
  if (lower.includes('horário') || lower.includes('aberto') || lower.includes('fim de semana') || lower.includes('24h') || lower.includes('madrugada')) {
    return {
      message: 'A nossa central de operações e despacho funciona 24 horas por dia, 7 dias por semana, incluindo feriados e fins de semana.',
      suggestedQuickReplies: ['Fazer Reserva Agora', 'Ligar para a Central', 'Localização em Talatona']
    };
  }

  // Resposta Padrão de Cortesia (Curta e Humana)
  return {
    message: 'Olá! Sou o consultor da central de mobilidade da Pepek Grupo em Talatona. Em que posso ajudar na sua deslocação ou da sua organização hoje?',
    suggestedQuickReplies: ['Recomendar Viatura', 'Preços das Diárias', 'Transfer Aeroporto VIP', 'Falar com Atendimento']
  };
}

function generateDynamicReplies(prompt: string, context?: SessionContext): string[] {
  const lower = prompt.toLowerCase();
  if (lower.includes('preço') || lower.includes('quanto')) {
    return ['SUV Land Cruiser', 'Hilux 4x4 Todo-Terreno', 'Van VIP 12L', 'Pedir Cotação Formal'];
  }
  if (lower.includes('aeroporto') || lower.includes('transfer')) {
    return ['Aeroporto 4 de Fevereiro', 'Novo Aeroporto AIAAN', 'Com Motorista Bilingue', 'Fazer Reserva'];
  }
  if (lower.includes('província') || lower.includes('huambo') || lower.includes('bengo')) {
    return ['Toyota Hilux 4x4', 'Assistência 24/7', 'Pedir Cotação para Viagem'];
  }
  return ['Recomendar Viatura', 'Preços das Diárias', 'Transfer Aeroporto VIP', 'Falar com um Consultor'];
}
