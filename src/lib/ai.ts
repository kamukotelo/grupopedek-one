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

// Motor determinístico de intenções com linguagem humana, calorosa e empática
  return processIntentMatch(userPrompt, sessionContext);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAPA DE INTENTS E RESPOSTAS ESTRUTURADAS HUMANIZADAS (SEM ALUCINAÇÕES)
// ─────────────────────────────────────────────────────────────────────────────
function processIntentMatch(prompt: string, context?: SessionContext): AssistantResponse {
  const lower = prompt.toLowerCase();

  // 1. INTENT: Reclamação ou Problema Urgente na Estrada / Avaria
  if (
    lower.includes('avariou') ||
    lower.includes('problema') ||
    lower.includes('acidente') ||
    lower.includes('furo') ||
    lower.includes('socorro') ||
    lower.includes('emergência') ||
    lower.includes('urgente') ||
    lower.includes('reboque')
  ) {
    return {
      message: 'Lamento imenso o sucedido e compreendo a sua preocupação! 🛡️ A sua segurança e tranquilidade são a nossa prioridade absoluta. A nossa central de piquete e reboque 24h em Talatona está pronta para intervir de imediato e providenciar assistência ou viatura de substituição. Vou transferi-lo agora para a nossa equipa operacional de emergência.',
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
    lower.includes('ligar') ||
    lower.includes('contacto')
  ) {
    return {
      message: 'Com todo o gosto! 🤝 É sempre um prazer falar consigo. Os nossos consultores executivos da central de Talatona estão disponíveis 24/7 para atendê-lo diretamente por WhatsApp ou ligação telefónica.',
      requiresHumanHandover: true,
      handoverContext: 'Solicitação de Atendimento Humano',
      suggestedQuickReplies: ['Abrir WhatsApp da Central', 'Ligar 24/7 (+244 923 719 090)']
    };
  }

  // 3. INTENT: Alterar ou Cancelar Reserva Existente
  if (lower.includes('cancelar') || lower.includes('mudar data') || lower.includes('alterar reserva') || lower.includes('trocar data') || lower.includes('remarcar')) {
    return {
      message: 'Compreendo perfeitamente a necessidade de ajustar a sua viagem! ✨ A nossa equipa de despacho trata de qualquer remarcação ou cancelamento com rapidez e flexibilidade. Vou encaminhá-lo para a nossa central com a referência do seu pedido.',
      requiresHumanHandover: true,
      handoverContext: 'Alteração/Cancelamento de Reserva',
      suggestedQuickReplies: ['Falar com Despacho no WhatsApp', 'Consultar Política de Cancelamento']
    };
  }

  // 4. INTENT: Casamentos, Galas, Festas & Eventos Especiais
  if (lower.includes('casamento') || lower.includes('noiva') || lower.includes('gala') || lower.includes('festa') || lower.includes('limousine') || lower.includes('evento especial')) {
    return {
      message: 'Que ocasião tão especial e feliz! 💍🥂 Para momentos inesquecíveis, dispomos da nossa imponente Limousine VIP (20 lugares, 999.999 Kz/dia), além de Mercedes-Benz Classe S, Mercedes-AMG G63 e Range Rover Autobiography. Podemos personalizar o serviço com motorista de gala e decoração!',
      recommendedVehicle: 'Limousine',
      suggestedQuickReplies: ['Ver Limousine (999.999 Kz)', 'Mercedes-Benz Classe S', 'Range Rover Autobiography', 'Falar com Consultor de Eventos']
    };
  }

  // 5. INTENT: Eventos de Grande Escala, Cimeiras ou Delegações (10+ viaturas)
  if (lower.includes('cimeira') || lower.includes('conferência') || lower.includes('50 pessoas') || lower.includes('100 pessoas') || lower.includes('várias viaturas') || lower.includes('grande comitiva') || lower.includes('comitiva')) {
    return {
      message: 'Temos ampla experiência e orgulho na coordenação de grandes frotas e comboios para cimeiras de Estado e eventos internacionais em Angola! 🌟 Para dimensionarmos as viaturas homogéneas e os motoristas dedicados, vou colocá-lo em contacto com o nosso Gestor de Grandes Contas.',
      requiresHumanHandover: true,
      handoverContext: 'Comitiva de Grande Escala / Cimeira',
      suggestedQuickReplies: ['Falar com Gestor de Contas', 'Ver Vans VIP e Minibus', 'Ver Frota Executiva']
    };
  }

  // 6. INTENT: Pedir Recomendação de Viatura
  if (lower.includes('qual carro') || lower.includes('que viatura') || lower.includes('qual escolher') || lower.includes('recomenda') || lower.includes('indeciso') || lower.includes('ajuda a escolher')) {
    return {
      message: 'Será um enorme prazer ajudar a encontrar a viatura ideal para si! 🚗✨ Para lhe dar a melhor recomendação: quantas pessoas vão viajar e o trajeto será em Luanda ou envolverá outras províncias de Angola?',
      suggestedQuickReplies: ['Até 4 pessoas (Luanda)', 'Família/Grupo até 7 pessoas', 'Comitiva (12+ pessoas)', 'Viagem ao Interior / Províncias']
    };
  }

  // 7. INTENT: Comparar Viaturas (SUV vs 4x4 vs Van vs Luxo vs Blindado)
  if (lower.includes('diferença entre') || lower.includes('comparar') || (lower.includes('suv') && lower.includes('4x4')) || (lower.includes('van') && lower.includes('suv')) || lower.includes('blindado')) {
    return {
      message: 'Excelente questão! 💎 Para prestígio executivo e requinte máximo, o Toyota LC 300 e o Land Cruiser 250 são incomparáveis. Se a missão exige robustez todo-terreno no interior, a Toyota Hilux 4x4 é a referência. Para grupos até 15 pessoas, a Mercedes V300 Class e a Hiace Furgão oferecem conforto total. E para segurança balística máxima, dispomos do Range Rover Vogue Blindado B6/B7.',
      suggestedQuickReplies: ['Toyota LC 300 / Prado', 'Toyota Hilux 4x4', 'Mercedes V300 Class', 'Range Rover Vogue Blindado']
    };
  }

  // 8. INTENT: Detalhes Técnicos de Viatura
  if (lower.includes('quantos lugares') || lower.includes('quantas malas') || lower.includes('ar condicionado') || lower.includes('automática') || lower.includes('combustível')) {
    const isPrado = lower.includes('prado') || lower.includes('lc300') || lower.includes('suv');
    const isHilux = lower.includes('hilux') || lower.includes('4x4') || lower.includes('pick-up');
    const isVan = lower.includes('van') || lower.includes('hiace') || lower.includes('v300') || lower.includes('staria') || lower.includes('sprinter');
    const isBlindado = lower.includes('blindad');

    if (isBlindado) {
      return {
        message: 'O nosso Range Rover Vogue Blindado é uma verdadeira fortaleza de luxo! 🛡️ Possui blindagem balística certificada nível B6/B7, 5 lugares em pele nobre, vidros balísticos e sistema de comunicação seguro. Disponível com condutor treinado em proteção executiva (1.999.999 Kz/dia).',
        recommendedVehicle: 'Range Rover Vogue Blindado',
        suggestedQuickReplies: ['Ver Ficha do Blindado', 'Saber Diária (1.999.999 Kz)', 'Reservar com Motorista VIP']
      };
    }

    if (isVan) {
      return {
        message: 'Para comitivas e grupos com espaço generoso! 🚐 A Mercedes-Benz V300 Class VIP tem 7 lugares em poltronas reclináveis de alto luxo, a Toyota Hiace Furgão transporta até 15 passageiros e a Mercedes-Benz Sprinter acomoda até 21 pessoas com ar condicionado reforçado e amplo porta-bagagens.',
        recommendedVehicle: 'Mercedes-Benz V300 Class',
        suggestedQuickReplies: ['Ver Mercedes V300', 'Ver Toyota Hiace Furgão', 'Ver Mercedes-Benz Sprinter']
      };
    }

    if (isHilux) {
      return {
        message: 'A Toyota Hilux Dupla Cabine 4x4 é a rainha da resistência nas estradas angolanas! 🚜 Tem 5 lugares, caixa de carga reforçada, tração 4x4 com redutora, motor Diesel económico e ar condicionado tropicalizado (189.999 Kz/dia).',
        recommendedVehicle: 'Toyota Hilux Dupla Cabine',
        suggestedQuickReplies: ['Ver Hilux 4x4 (189.999 Kz)', 'Reservar para Províncias', 'Pedir com Motorista']
      };
    }

    return {
      message: 'O Toyota LC 300 e o Land Cruiser 250 oferecem 7 lugares amplos, tração integral 4WD, caixa automática suave, acabamentos em couro premium e climatização multizona independente. O auge do prestígio executivo! ✨',
      recommendedVehicle: 'Toyota LC 300 Twin Turbo',
      suggestedQuickReplies: ['Ver Toyota LC 300', 'Ver Toyota Land Cruiser 250', 'Consultar Outra Viatura']
    };
  }

  // 9. INTENT: Disponibilidade
  if (lower.includes('disponível') || lower.includes('tem para hoje') || lower.includes('tem vaga') || lower.includes('tem carro')) {
    return {
      message: 'Temos viaturas prontas e higienizadas na nossa base central de Talatona! 🚗✨ Desde citadinos económicos a SUVs de alto prestígio e blindados. Para que datas e que tipo de viatura tem em mente?',
      suggestedQuickReplies: ['Para Hoje / Imediato', 'Para Esta Semana', 'SUV de Luxo / LC300', 'Económico / Urbano']
    };
  }

  // 10. INTENT: Como Reservar / Processo
  if (lower.includes('como reservar') || lower.includes('como funciona') || lower.includes('processo') || lower.includes('como alugo')) {
    return {
      message: 'O processo é simples, rápido e transparente! ✨ Escolhe a viatura no catálogo, define as datas e pode submeter o pedido pelo site ou confirmar diretamente no WhatsApp com a nossa Direção de Operações.',
      suggestedQuickReplies: ['Sim, pedir cotação', 'Com Motorista Protocolar', 'Livre Condução (Self-Drive)']
    };
  }

  // 11. INTENT: Preços e Tarifas Diárias
  if (lower.includes('preço') || lower.includes('quanto custa') || lower.includes('valor') || lower.includes('diária') || lower.includes('tarifa')) {
    return {
      message: 'As nossas tarifas oficiais 2026 são totalmente transparentes e em Kwanzas (Kz)! 💳 Citadinos económicos a partir de 49.999 Kz (Kia Morning / Celerio), SUVs a 139.999 Kz – 169.999 Kz (Creta / Tucson / Tiggo 7), Pick-ups 4x4 a 189.999 Kz (Hilux), SUVs Executivos a 299.999 Kz – 599.999 Kz (Prado / LC300) e Blindados a 1.999.999 Kz.',
      suggestedQuickReplies: ['Económicos (49.999 Kz)', 'SUVs Executivos', 'Vans VIP (359k – 800k)', 'Proposta Corporativa']
    };
  }

  // 12. INTENT: Métodos de Pagamento e Moedas
  if (lower.includes('pagamento') || lower.includes('pagar') || lower.includes('cartão') || lower.includes('multicaixa') || lower.includes('euros') || lower.includes('dólares') || lower.includes('moeda')) {
    return {
      message: 'Facilitamos o seu pagamento com total segurança e comodidade! 💳 Em Angola aceitamos Multicaixa, Multicaixa Express e transferências bancárias (BAI, BFA, Atlântico). Do exterior, aceitamos cartões Visa, Mastercard, MB WAY e transferências SWIFT em USD ou EUR. O comprovativo fica disponível após confirmação do pagamento.',
      suggestedQuickReplies: ['Faturação para Empresa', 'Pagamento Multicaixa Express', 'Cartão Internacional / MB WAY']
    };
  }

  // 13. INTENT: Faturação para Empresas / Embaixadas / NIF
  if (lower.includes('fatura') || lower.includes('factura') || lower.includes('nif') || lower.includes('empresa') || lower.includes('instituição')) {
    return {
      message: 'O sistema regista a fatura da sua empresa ou embaixada em Kwanzas (AOA) ou moeda estrangeira (USD/EUR) e disponibiliza o comprovativo depois da confirmação do pagamento. Para clientes corporativos acreditados, disponibilizamos condições de pagamento a 30 dias.',
      suggestedQuickReplies: ['Empresa em Angola', 'Embaixada / Diplomático', 'Contrato Corporativo']
    };
  }

  // 14. INTENT: Motorista Bilingue (Protocolo & Chauffeur)
  if (lower.includes('motorista') || lower.includes('inglês') || lower.includes('francês') || lower.includes('chauffeur') || lower.includes('condutor')) {
    return {
      message: 'Dispomos do mais distinto serviço de Chauffeur Protocolar em Angola (+35.000 Kz/dia)! 👔 Os nossos motoristas são fardados, poliglotas (Português, Inglês e Francês) e contam com formação avançada em condução defensiva, etiqueta e sigilo absoluto.',
      suggestedQuickReplies: ['Sim, motorista em Inglês', 'Sim, motorista em Francês', 'Apenas em Português', 'Livre Condução (Sem motorista)']
    };
  }

  // 15. INTENT: Cobertura Geográfica / Taxas Interprovinciais Detalhadas
  if (lower.includes('província') || lower.includes('deslocação') || lower.includes('huambo') || lower.includes('bengo') || lower.includes('benguela') || lower.includes('huíla') || lower.includes('huila') || lower.includes('namibe') || lower.includes('cunene') || lower.includes('malanje') || lower.includes('uíge') || lower.includes('uige') || lower.includes('bié') || lower.includes('bie') || lower.includes('lunda') || lower.includes('moxico') || lower.includes('zaire')) {
    let specificRate = '';
    if (lower.includes('bengo') && !lower.includes('ícolo')) specificRate = 'Para o Bengo a taxa oficial é de 150.000 Kz (Ida e Volta: 300.000 Kz). ';
    else if (lower.includes('ícolo') || lower.includes('icolo')) specificRate = 'Para Ícolo e Bengo a taxa oficial é de 200.000 Kz (Ida e Volta: 400.000 Kz). ';
    else if (lower.includes('huambo') || lower.includes('benguela') || lower.includes('zaire') || lower.includes('malanje') || lower.includes('kwanza') || lower.includes('cuanza') || lower.includes('uíge') || lower.includes('uige')) {
      specificRate = 'Para o Huambo, Benguela, Zaire, Malanje, Kwanza Sul/Norte e Uíge a taxa é de 250.000 Kz (Ida e Volta: 500.000 Kz). ';
    } else if (lower.includes('huíla') || lower.includes('huila') || lower.includes('lunda-norte') || lower.includes('lunda norte')) {
      specificRate = 'Para a Huíla e Lunda-Norte a taxa é de 350.000 Kz (Ida e Volta: 700.000 Kz). ';
    } else if (lower.includes('bié') || lower.includes('bie')) {
      specificRate = 'Para o Bié a taxa é de 400.000 Kz (Ida e Volta: 800.000 Kz). ';
    } else if (lower.includes('cunene') || lower.includes('namibe') || lower.includes('cuando') || lower.includes('lunda-sul') || lower.includes('lunda sul')) {
      specificRate = 'Para o Cunene, Namibe, Cuando Cubango e Lunda-Sul a taxa é de 450.000 Kz (Ida e Volta: 900.000 Kz). ';
    } else if (lower.includes('moxico')) {
      specificRate = 'Para o Moxico / Moxico Leste a taxa é de 500.000 Kz (Ida e Volta: 1.000.000 Kz). ';
    }

    return {
      message: `${specificRate}Movemos quem move Angola de Cabinda ao Cunene! 🇦🇴 As taxas de deslocação partindo de Luanda variam entre 150.000 Kz e 500.000 Kz (conforme a tabela oficial dos catálogos). Em província, o apoio ao motorista inclui 35.000 Kz/dia, combustível 50.000 Kz e alojamento/alimentação 30.000 Kz/dia.`,
      suggestedQuickReplies: ['Pólo Huambo (250k)', 'Benguela (250k)', 'Huíla (350k)', 'Ver Outra Província']
    };
  }

  // 16. INTENT: Caução / Depósito de Garantia (Livre Condução)
  if (lower.includes('caução') || lower.includes('caucao') || lower.includes('depósito') || lower.includes('deposito') || lower.includes('garantia')) {
    return {
      message: 'A caução para Livre Condução é estritamente tabelada conforme o catálogo oficial 2026: 300.000 Kz para Citadinos Ligeiros, 500.000 Kz para Mini SUVs e 1.500.000 Kz para SUVs Executivos, 4x4 e Viaturas de Luxo. 💳 O montante é desbloqueado integralmente no fecho do contrato após vistoria.',
      suggestedQuickReplies: ['Ligeiros (300k Kz)', 'Mini SUVs (500k Kz)', 'SUVs Executivos (1,5M Kz)', 'Alugar com Motorista (Sem Caução)']
    };
  }

  // 17. INTENT: Multas, Penalizações e Políticas de Entrega
  if (lower.includes('multa') || lower.includes('penalização') || lower.includes('atraso') || lower.includes('higienização') || lower.includes('regras')) {
    return {
      message: 'A nossa política é 100% transparente: atraso na devolução até 1 hora tem penalização de 15.000 a 50.000 Kz; falta de higienização é 15.000 Kz; falta de reposição de combustível é 25.000 Kz (ligeiro) ou 50.000 Kz (SUV/Van); e saída não autorizada fora das localidades acordadas constitui infração de 500.000 Kz.',
      suggestedQuickReplies: ['Período de Tolerância', 'Política de Higienização', 'Falar com Operações']
    };
  }

  // 18. INTENT: Balcões e Localização Física Exata
  if (lower.includes('onde fica') || lower.includes('endereço') || lower.includes('morada') || lower.includes('localização') || lower.includes('balcão') || lower.includes('hcta')) {
    return {
      message: 'Estamos estrategicamente localizados para o servir com excelência! 📍 Sede Central em Talatona (frente ao HCTA, Condomínio Ateliê dos Sonhos, Rua Reino do Bailundo), Balcão 24/7 no Novo Aeroporto AIAAN (Corredor 4 – Piso Inferior – Chegadas) e Pólo Regional no Huambo (Aeroporto Albano Machado).',
      suggestedQuickReplies: ['Sede Talatona', 'Balcão Aeroporto AIAAN', 'Pólo Huambo', 'Ligar para a Central']
    };
  }

  // 19. INTENT: Transfer Aeroporto (LAD / AIAAN)
  if (lower.includes('aeroporto') || lower.includes('transfer') || lower.includes('voo') || lower.includes('aiaan') || lower.includes('4 de fevereiro')) {
    return {
      message: 'Seja muito bem-vindo(a) a Angola! 🛫🇦🇴 Realizamos transfers executivos no Aeroporto 4 de Fevereiro e no Novo Aeroporto Internacional AIAAN (onde temos balcão 24/7 no Corredor 4 das Chegadas). O nosso motorista aguarda com placa identificativa, apoio de bagagem e sem taxas por atrasos de voo.',
      suggestedQuickReplies: ['Aeroporto 4 de Fevereiro', 'Aeroporto AIAAN (Novo)', 'Transfer com SUV de Luxo', 'Transfer com Van VIP']
    };
  }

  // 20. INTENT: Seguro, Garantias & Viatura de Substituição
  if (lower.includes('seguro') || lower.includes('avaria') || lower.includes('acontecer algo') || lower.includes('assistência')) {
    return {
      message: 'A sua tranquilidade é garantida a 100%! 🛡️ Todas as viaturas contam com cobertura total de seguro e assistência técnica 24 horas. Em caso de qualquer imprevisto mecânico, enviamos uma viatura de substituição equivalente ou superior de imediato.',
      suggestedQuickReplies: ['Ver Catálogo da Frota', 'Pedir Cotação com Seguro', 'Falar com Consultor']
    };
  }

  // 21. INTENT: Discrição e Protocolo Diplomático
  if (lower.includes('diplomático') || lower.includes('embaixada') || lower.includes('discrição') || lower.includes('confidencial') || lower.includes('segurança')) {
    return {
      message: 'Temos a honra de servir regularmente embaixadas, missões diplomáticas e cimeiras internacionais em Angola. 🤝 Garantimos discrição absoluta, frotas de representação impecáveis, viaturas blindadas certificadas B6/B7 e motoristas com formação protocolar.',
      suggestedQuickReplies: ['Proposta para Embaixada', 'Range Rover Vogue Blindado', 'Falar com Gestor Diplomático']
    };
  }

  // 22. INTENT: Horário de Funcionamento
  if (lower.includes('horário') || lower.includes('aberto') || lower.includes('fim de semana') || lower.includes('24h') || lower.includes('madrugada')) {
    return {
      message: 'A nossa central de operações e despacho em Talatona e o balcão no Aeroporto AIAAN estão em funcionamento contínuo 24 horas por dia, 7 dias por semana, incluindo fins de semana e feriados! 🕒',
      suggestedQuickReplies: ['Fazer Reserva Agora', 'Ligar para a Central', 'Localização em Talatona']
    };
  }

  // Resposta Padrão de Cortesia (Calorosa, Humana e Convidativa)
  return {
    message: 'Olá! Sou o consultor executivo da PEPEK GRUPO em Talatona. 🚗✨ É um enorme gosto recebê-lo(a)! Em que posso apoiar a sua viagem ou a mobilidade da sua instituição hoje?',
    suggestedQuickReplies: ['Recomendar Viatura', 'Preços das Diárias', 'Transfer Aeroporto VIP', 'Falar com um Consultor']
  };
}

function generateDynamicReplies(prompt: string, context?: SessionContext): string[] {
  const lower = prompt.toLowerCase();
  if (lower.includes('preço') || lower.includes('quanto')) {
    return ['Económicos (49.999 Kz)', 'Toyota LC 300 / Prado', 'Toyota Hilux 4x4', 'Range Rover Vogue Blindado'];
  }
  if (lower.includes('aeroporto') || lower.includes('transfer')) {
    return ['Aeroporto 4 de Fevereiro', 'Novo Aeroporto AIAAN', 'Com Motorista Bilingue', 'Fazer Reserva'];
  }
  if (lower.includes('casamento') || lower.includes('evento')) {
    return ['Limousine VIP', 'Mercedes-Benz Classe S', 'Range Rover Autobiography', 'Falar com Consultor'];
  }
  if (lower.includes('província') || lower.includes('huambo') || lower.includes('bengo')) {
    return ['Toyota Hilux 4x4', 'Toyota Prado', 'Assistência 24/7', 'Pedir Cotação'];
  }
  return ['Recomendar Viatura', 'Preços das Diárias', 'Transfer Aeroporto VIP', 'Falar com um Consultor'];
}

