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

// O prompt de sistema e a base de conhecimento factual do chatbot vivem agora
// no backend: api/_ai-knowledge.js (comportamento) + api/_fleet-catalog.js
// (frota real, gerado por `npm run gen:ai`). Aqui fica só o motor determinístico
// de reserva, usado como fallback quando /api/ai não responde.

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
      message: 'O Novo Toyota Prado e o LC300 focam-se no prestígio e conforto executivo. Para terrenos acidentados ou missões técnicas, a Toyota Hilux 4x4 é a mais robusta. Para comitivas até 15 passageiros, dispomos da Mercedes V300 Class e Nova Hiace. Se necessita de segurança máxima, temos o Range Rover Vogue Blindado.',
      suggestedQuickReplies: ['Toyota LC300 / Prado', 'Toyota Hilux 4x4', 'Mercedes V300 Class', 'Range Rover Vogue Blindado']
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
        message: 'O nosso Range Rover Vogue Blindado possui blindagem certificada B6/B7, 5 lugares em pele perfurada, vidros balísticos e sistema de comunicação seguro. Disponível com condutor de segurança.',
        recommendedVehicle: 'Range Rover Vogue Blindado',
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
        message: 'A Toyota Hilux Dupla Cabine 4x4 tem 5 lugares, caixa de carga reforçada, tracção 4x4 com redutoras e ar condicionado tropicalizado (189.999 Kz/dia).',
        recommendedVehicle: 'Toyota Hilux Dupla Cabine',
        suggestedQuickReplies: ['Ver Hilux 4x4', 'Saber Diária', 'Reservar para Províncias']
      };
    }

    return {
      message: 'O Toyota LC300 2026 e o Novo Prado têm 7 lugares confortáveis, tracção integral 4WD, caixa automática, climatização independente e acabamentos topo de gama.',
      recommendedVehicle: 'Toyota LC300 2026',
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
      message: 'As nossas diárias oficiais iniciam nos 49.999 Kz para Económicos (Kia Morning / Celerio), 159.999 Kz para SUVs (Tucson / Tiggo 7), 189.999 Kz para Pick-ups 4x4 (Hilux), 299.999 Kz a 599.999 Kz para SUVs Executivos (Prado / LC300) e até 1.999.999 Kz para Blindados de Alto Luxo.',
      suggestedQuickReplies: ['Económicos (49.999 Kz)', 'SUVs Executivos', 'Vans VIP (359k – 800k)', 'Proposta Corporativa']
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
      suggestedQuickReplies: ['Proposta para Embaixada', 'Range Rover Vogue Blindado', 'Contactar Gestor Diplomático']
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
    return ['Económicos (49.999 Kz)', 'Toyota LC300 / Prado', 'Toyota Hilux 4x4', 'Range Rover Vogue Blindado'];
  }
  if (lower.includes('aeroporto') || lower.includes('transfer')) {
    return ['Aeroporto 4 de Fevereiro', 'Novo Aeroporto AIAAN', 'Com Motorista Bilingue', 'Fazer Reserva'];
  }
  if (lower.includes('província') || lower.includes('huambo') || lower.includes('bengo')) {
    return ['Toyota Hilux 4x4', 'Toyota Prado', 'Assistência 24/7', 'Pedir Cotação'];
  }
  return ['Recomendar Viatura', 'Preços das Diárias', 'Transfer Aeroporto VIP', 'Falar com um Consultor'];
}
