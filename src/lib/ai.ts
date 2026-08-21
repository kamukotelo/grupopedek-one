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
• Frota executiva organizada por categorias:
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
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userPrompt, history: history.slice(-6), sessionContext }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.message) return {
        message: String(data.message).trim(),
        suggestedQuickReplies: generateDynamicReplies(userPrompt, sessionContext),
      };
    }
  } catch {
    // Local development and static deployments keep the deterministic fallback.
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

  // 6. INTENT: Comparar Viaturas (SUV vs 4x4 vs Van vs Luxo)
  if (lower.includes('diferença entre') || lower.includes('comparar') || (lower.includes('suv') && lower.includes('4x4')) || (lower.includes('van') && lower.includes('suv')) || lower.includes('blindado')) {
    return {
      message: 'O Novo Toyota Prado e o LC300 focam-se no prestígio e conforto executivo. Para terrenos acidentados ou missões técnicas, a Toyota Hilux 4x4 é a mais robusta. Para comitivas até 15 passageiros, dispomos da Mercedes V300 Class e Nova Hiace. Se necessita de segurança máxima, temos o Range Rover Blindado 2025.',
      suggestedQuickReplies: ['Toyota LC300 / Prado', 'Toyota Hilux 4x4', 'Mercedes V300 Class', 'Range Rover Blindado']
    };
  }

  // 7. INTENT: Detalhes Técnicos de Viatura
  if (lower.includes('quantos lugares') || lower.includes('quantas malas') || lower.includes('ar condicionado') || lower.includes('automática') || lower.includes('combustível')) {
    const isPrado = lower.includes('prado') || lower.includes('lc300') || lower.includes('suv');
    const isHilux = lower.includes('hilux') || lower.includes('4x4') || lower.includes('pick-up');
    const isVan = lower.includes('van') || lower.includes('hiace') || lower.includes('v300') || lower.includes('staria');
    const isBlindado = lower.includes('blindad');

    if (isBlindado) {
      return {
        message: 'O nosso Range Rover Blindado 2025 possui blindagem certificada B6/B7, 5 lugares em pele perfurada, vidros balísticos e sistema de comunicação seguro. Disponível com condutor de segurança.',
        recommendedVehicle: 'Range Rover Blindado 2025',
        suggestedQuickReplies: ['Ver Ficha do Blindado', 'Saber Diária (1.999.999 Kz)', 'Reservar com Motorista']
      };
    }

    if (isVan) {
      return {
        message: 'A Mercedes-Benz V300 Class VIP tem 7 lugares em poltronas reclináveis de luxo, e a Nova Toyota Hiace transporta até 15 passageiros com ar condicionado reforçado e amplo espaço de bagagem.',
        recommendedVehicle: 'Mercedes-Benz V300 Class',
        suggestedQuickReplies: ['Ver Mercedes V300', 'Ver Toyota Hiace', 'Reservar Van']
      };
    }

    if (isHilux) {
      return {
        message: 'A Toyota Hilux Dupla Cabine 4x4 tem 5 lugares, caixa de carga reforçada, tracção 4x4 com redutoras e ar condicionado tropicalizado (159.999 Kz/dia).',
        recommendedVehicle: 'Toyota Hilux Dupla Cabine',
        suggestedQuickReplies: ['Ver Hilux 4x4', 'Saber Diária', 'Reservar para Províncias']
      };
    }

    return {
      message: 'O Toyota LC300 2023 e o Novo Prado têm 7 lugares confortáveis, tracção integral 4WD, caixa automática, climatização independente e acabamentos topo de gama.',
      recommendedVehicle: 'Toyota LC300 2023',
      suggestedQuickReplies: ['Ver Toyota LC300', 'Ver Novo Prado', 'Consultar Outra Viatura']
    };
  }

  // 8. INTENT: Disponibilidade
  if (lower.includes('disponível') || lower.includes('tem para hoje') || lower.includes('tem vaga') || lower.includes('tem carro')) {
    return {
      message: 'Temos viaturas em prontidão na base de Talatona, desde opções urbanas a blindados de luxo. Para que datas e que categoria pretende?',
      suggestedQuickReplies: ['Para Hoje / Imediato', 'Para Esta Semana', 'SUV de Luxo / LC300', 'Económico / Urbano']
    };
  }

  // 9. INTENT: Como Reservar / Processo
  if (lower.includes('como reservar') || lower.includes('como funciona') || lower.includes('processo') || lower.includes('como alugo')) {
    return {
      message: 'O processo é direto: seleciona a viatura pretendida no catálogo, escolhe as datas e submete a ficha oficial ou confirma diretamente pelo WhatsApp com a Direcção de Operações.',
      suggestedQuickReplies: ['Sim, pedir cotação', 'Com Motorista Protocolar', 'Livre Condução (Self-Drive)']
    };
  }

  // 10. INTENT: Preços e Tarifas Diárias
  if (lower.includes('preço') || lower.includes('quanto custa') || lower.includes('valor') || lower.includes('diária') || lower.includes('tarifa')) {
    return {
      message: 'As nossas diárias oficiais iniciam nos 44.999 Kz para Económicos (Kia Morning / Swift), 149.999 Kz para SUVs (Tucson / Tiggo), 159.999 Kz para Pick-ups 4x4 (Hilux), 289.999 Kz a 599.999 Kz para SUVs Executivos (Prado / LC300) e até 1.999.999 Kz para Blindados de Alto Luxo.',
      suggestedQuickReplies: ['Económicos (44.999 Kz)', 'SUVs Executivos', 'Vans VIP (359k – 800k)', 'Proposta Corporativa']
    };
  }

  // 11. INTENT: Métodos de Pagamento e Moedas
  if (lower.includes('pagamento') || lower.includes('pagar') || lower.includes('cartão') || lower.includes('multicaixa') || lower.includes('euros') || lower.includes('dólares')) {
    return {
      message: 'Aceitamos Multicaixa e Multicaixa Express em Angola, bem como cartões Visa, Mastercard e MB WAY para clientes no exterior. Emitimos faturação certificada AGT em Kwanzas (AOA).',
      suggestedQuickReplies: ['Faturação para Empresa (AGT)', 'Pagamento Multicaixa Express', 'Cartão Internacional']
    };
  }

  // 12. INTENT: Faturação para Empresas / Embaixadas
  if (lower.includes('fatura') || lower.includes('factura') || lower.includes('agt') || lower.includes('nif') || lower.includes('empresa') || lower.includes('instituição')) {
    return {
      message: 'Sim, emitimos faturação certificada em conformidade com a AGT para empresas, ministérios e embaixadas, com possibilidade de condições a 30 dias mediante acreditação prévia.',
      suggestedQuickReplies: ['Empresa em Angola (AGT)', 'Embaixada / Diplomático', 'Entidade no Exterior']
    };
  }

  // 13. INTENT: Motorista Bilingue (Protocolo)
  if (lower.includes('motorista') || lower.includes('inglês') || lower.includes('francês') || lower.includes('chauffeur') || lower.includes('condutor')) {
    return {
      message: 'Dispomos de serviço de Chauffeur Protocolar (+35.000 Kz/dia) com motoristas fardados, bilingues (Português, Inglês, Francês) e com formação avançada em condução defensiva.',
      suggestedQuickReplies: ['Sim, motorista em Inglês', 'Sim, motorista em Francês', 'Apenas em Português', 'Livre Condução (Sem motorista)']
    };
  }

  // 14. INTENT: Cobertura Geográfica / Províncias
  if (lower.includes('província') || lower.includes('huambo') || lower.includes('bengo') || lower.includes('benguela') || lower.includes('fora de luanda') || lower.includes('interior')) {
    return {
      message: 'Planeamos operações em Angola a partir da base principal em Talatona (Luanda) e dos pólos operacionais no Huambo e Bengo, mediante confirmação de rota e disponibilidade.',
      suggestedQuickReplies: ['Huambo', 'Bengo', 'Benguela / Lobito', 'Outra Província']
    };
  }

  // 15. INTENT: Transfer Aeroporto
  if (lower.includes('aeroporto') || lower.includes('transfer') || lower.includes('voo') || lower.includes('aiaan') || lower.includes('4 de fevereiro')) {
    return {
      message: 'Realizamos Transfers VIP no Aeroporto 4 de Fevereiro e no Novo Aeroporto Internacional AIAAN. O nosso motorista aguarda no desembarque com placa identificativa e apoio de bagagem.',
      suggestedQuickReplies: ['Aeroporto 4 de Fevereiro', 'Aeroporto AIAAN (Novo)', 'Transfer com SUV de Luxo', 'Transfer com Van VIP']
    };
  }

  // 16. INTENT: Seguro e Garantias
  if (lower.includes('seguro') || lower.includes('avaria') || lower.includes('acontecer algo') || lower.includes('garantia')) {
    return {
      message: 'As viaturas contratadas incluem as coberturas e condições de assistência indicadas na proposta comercial.',
      suggestedQuickReplies: ['Ver Catálogo da Frota', 'Pedir Cotação com Seguro', 'Falar com Consultor']
    };
  }

  // 17. INTENT: Discrição e Protocolo Diplomático
  if (lower.includes('diplomático') || lower.includes('embaixada') || lower.includes('discrição') || lower.includes('confidencial') || lower.includes('segurança')) {
    return {
      message: 'Trabalhamos regularmente com embaixadas, delegações e cimeiras de estado, oferecendo frotas homogéneas, viaturas blindadas B6/B7 e condutores certificados com discrição absoluta.',
      suggestedQuickReplies: ['Proposta para Embaixada', 'Range Rover Blindado 2025', 'Contactar Gestor Diplomático']
    };
  }

  // 18. INTENT: Horário de Funcionamento
  if (lower.includes('horário') || lower.includes('aberto') || lower.includes('fim de semana') || lower.includes('24h') || lower.includes('madrugada')) {
    return {
      message: 'A nossa central de operações e despacho em Talatona funciona 24 horas por dia, 7 dias por semana, incluindo feriados.',
      suggestedQuickReplies: ['Fazer Reserva Agora', 'Ligar para a Central', 'Localização em Talatona']
    };
  }

  // Resposta Padrão de Cortesia (Curta e Humana)
  return {
    message: 'Olá! Sou o consultor da central de mobilidade da Pepek Grupo em Talatona. Em que posso ajudar na sua deslocação hoje?',
    suggestedQuickReplies: ['Recomendar Viatura', 'Preços das Diárias', 'Transfer Aeroporto VIP', 'Falar com Atendimento']
  };
}

function generateDynamicReplies(prompt: string, context?: SessionContext): string[] {
  const lower = prompt.toLowerCase();
  if (lower.includes('preço') || lower.includes('quanto')) {
    return ['Económicos (44.999 Kz)', 'Toyota LC300 / Prado', 'Toyota Hilux 4x4', 'Range Rover Blindado'];
  }
  if (lower.includes('aeroporto') || lower.includes('transfer')) {
    return ['Aeroporto 4 de Fevereiro', 'Novo Aeroporto AIAAN', 'Com Motorista Bilingue', 'Fazer Reserva'];
  }
  if (lower.includes('província') || lower.includes('huambo') || lower.includes('bengo')) {
    return ['Toyota Hilux 4x4', 'Toyota Prado', 'Assistência 24/7', 'Pedir Cotação'];
  }
  return ['Recomendar Viatura', 'Preços das Diárias', 'Transfer Aeroporto VIP', 'Falar com um Consultor'];
}
