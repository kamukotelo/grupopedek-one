import i18n from '../i18n';

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
      // O idioma do site garante que o Gemini responde na língua em que o cliente navega.
      body: JSON.stringify({ userPrompt, history: history.slice(-6), sessionContext, language: currentLanguage() }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.message) return {
        message: String(data.message).trim(),
        suggestedQuickReplies: generateDynamicReplies(userPrompt),
      };
    }
  } catch {
    // Local development and static deployments keep the deterministic fallback.
  }

// Motor determinístico de intenções com linguagem humana, calorosa e empática
  return processIntentMatch(userPrompt);
}

const currentLanguage = () => (i18n.resolvedLanguage ?? i18n.language ?? 'pt').slice(0, 2);

// As respostas vivem em chat.fallback.<intent> nos ficheiros de tradução.
const reply = (intent: string, extra: Partial<AssistantResponse> = {}): AssistantResponse => ({
  message: i18n.t(`chat.fallback.${intent}.message`),
  suggestedQuickReplies: i18n.t(`chat.fallback.${intent}.replies`, { returnObjects: true }) as string[],
  ...extra,
});

// A palavra-chave tem de começar no início de uma palavra: evita "phone" em "francophone"
// ou "rate" em "corporate", mas continua a apanhar variações como "recomenda"/"recomendar".
const keywordPatterns = new Map<string, RegExp>();
const has = (text: string, keywords: string[]) => keywords.some((keyword) => {
  let pattern = keywordPatterns.get(keyword);
  if (!pattern) {
    pattern = new RegExp(`(?<![\\p{L}\\p{N}])${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'u');
    keywordPatterns.set(keyword, pattern);
  }
  return pattern.test(text);
});

// ─────────────────────────────────────────────────────────────────────────────
// MAPA DE INTENTS E RESPOSTAS ESTRUTURADAS HUMANIZADAS (SEM ALUCINAÇÕES)
// Palavras-chave em português, inglês e francês: as respostas rápidas enviam o
// próprio texto do botão, que tem de voltar a encaixar numa intenção.
// ─────────────────────────────────────────────────────────────────────────────
function processIntentMatch(prompt: string): AssistantResponse {
  const lower = prompt.toLowerCase();

  // 1. INTENT: Reclamação ou Problema Urgente na Estrada / Avaria
  if (has(lower, ['avariou', 'problema', 'acidente', 'furo', 'socorro', 'emergência', 'urgente', 'reboque', 'broke down', 'breakdown', 'accident', 'flat tyre', 'flat tire', 'emergency', 'urgent', 'tow', 'panne', 'crevaison', 'urgence', 'dépannage', 'remorquage'])) {
    return reply('emergency', { requiresHumanHandover: true, handoverContext: i18n.t('chat.fallback.emergency.handover') });
  }

  // 2. INTENT: Falar com Humano / Atendimento Direto
  if (has(lower, ['humano', 'pessoa', 'falar com alguém', 'atendente', 'gestor', 'telefone', 'ligar', 'contacto', 'human', 'a person', 'real person', 'someone', 'agent', 'manager', 'phone', 'call', 'contact', 'humain', 'quelqu', 'conseiller', 'téléphone', 'appeler'])) {
    return reply('human', { requiresHumanHandover: true, handoverContext: i18n.t('chat.fallback.human.handover') });
  }

  // 3. INTENT: Alterar ou Cancelar Reserva Existente
  if (has(lower, ['cancelar', 'mudar data', 'alterar reserva', 'trocar data', 'remarcar', 'cancel', 'change date', 'change my booking', 'reschedule', 'annuler', 'modifier', 'changer la date', 'reporter'])) {
    return reply('change', { requiresHumanHandover: true, handoverContext: i18n.t('chat.fallback.change.handover') });
  }

  // 4. INTENT: Casamentos, Galas, Festas & Eventos Especiais
  if (has(lower, ['casamento', 'noiva', 'gala', 'festa', 'limousine', 'evento especial', 'wedding', 'bride', 'party', 'special event', 'mariage', 'mariée', 'fête', 'événement spécial'])) {
    return reply('wedding', { recommendedVehicle: 'Limousine' });
  }

  // 5. INTENT: Eventos de Grande Escala, Cimeiras ou Delegações (10+ viaturas)
  if (has(lower, ['cimeira', 'conferência', '50 pessoas', '100 pessoas', 'várias viaturas', 'grande comitiva', 'comitiva', 'summit', 'conference', '50 people', '100 people', 'several vehicles', 'delegation', 'sommet', '50 personnes', '100 personnes', 'plusieurs véhicules', 'délégation', 'cortège'])) {
    return reply('largeEvent', { requiresHumanHandover: true, handoverContext: i18n.t('chat.fallback.largeEvent.handover') });
  }

  // 6. INTENT: Pedir Recomendação de Viatura
  if (has(lower, ['qual carro', 'que viatura', 'qual escolher', 'recomenda', 'indeciso', 'ajuda a escolher', 'which car', 'which vehicle', 'recommend', 'help me choose', 'quelle voiture', 'quel véhicule', 'recommand', 'aide à choisir'])) {
    return reply('recommend');
  }

  // 7. INTENT: Comparar Viaturas (SUV vs 4x4 vs Van vs Luxo vs Blindado)
  if (has(lower, ['diferença entre', 'comparar', 'blindado', 'difference between', 'compare', 'armoured', 'armored', 'différence entre', 'comparer', 'blindé']) || (lower.includes('suv') && lower.includes('4x4')) || (lower.includes('van') && lower.includes('suv'))) {
    return reply('compare');
  }

  // 8. INTENT: Detalhes Técnicos de Viatura
  if (has(lower, ['quantos lugares', 'quantas malas', 'ar condicionado', 'automática', 'combustível', 'how many seats', 'luggage', 'air conditioning', 'automatic', 'fuel', 'combien de places', 'bagages', 'climatisation', 'automatique', 'carburant'])) {
    const isHilux = has(lower, ['hilux', '4x4', 'pick-up']);
    const isVan = has(lower, ['van', 'hiace', 'v300', 'staria', 'sprinter']);
    const isArmoured = has(lower, ['blindad', 'armour', 'armor', 'blindé']);

    if (isArmoured) return reply('specsArmoured', { recommendedVehicle: 'Range Rover Vogue Blindado' });
    if (isVan) return reply('specsVan', { recommendedVehicle: 'Mercedes-Benz V300 Class' });
    if (isHilux) return reply('specsHilux', { recommendedVehicle: 'Toyota Hilux Dupla Cabine' });
    return reply('specsSuv', { recommendedVehicle: 'Toyota LC 300 Twin Turbo' });
  }

  // 9. INTENT: Disponibilidade
  if (has(lower, ['disponível', 'tem para hoje', 'tem vaga', 'tem carro', 'available', 'availability', 'for today', 'disponible', 'disponibilité', "aujourd'hui"])) {
    return reply('availability');
  }

  // 10. INTENT: Como Reservar / Processo
  if (has(lower, ['como reservar', 'como funciona', 'processo', 'como alugo', 'how to book', 'how does it work', 'process', 'how do i rent', 'comment réserver', 'comment ça marche', 'processus', 'comment louer'])) {
    return reply('howToBook');
  }

  // 11. INTENT: Preços e Tarifas Diárias
  if (has(lower, ['preço', 'quanto custa', 'valor', 'diária', 'tarifa', 'price', 'how much', 'cost', 'rate', 'prix', 'combien', 'tarif', 'coût'])) {
    return reply('prices');
  }

  // 12. INTENT: Métodos de Pagamento e Moedas
  if (has(lower, ['pagamento', 'pagar', 'cartão', 'multicaixa', 'euros', 'dólares', 'moeda', 'payment', 'pay', 'card', 'dollars', 'currency', 'paiement', 'payer', 'carte', 'devise'])) {
    return reply('payment');
  }

  // 13. INTENT: Faturação para Empresas / Embaixadas / NIF
  if (has(lower, ['fatura', 'factura', 'nif', 'empresa', 'instituição', 'corporativ', 'invoice', 'invoicing', 'company', 'corporate', 'institution', 'facture', 'entreprise'])) {
    return reply('invoicing');
  }

  // 14. INTENT: Motorista Bilingue (Protocolo & Chauffeur)
  if (has(lower, ['motorista', 'inglês', 'francês', 'chauffeur', 'condutor', 'driver', 'english', 'french', 'anglais', 'français', 'conducteur'])) {
    return reply('driver');
  }

  // 15. INTENT: Cobertura Geográfica / Taxas Interprovinciais Detalhadas
  if (has(lower, ['província', 'deslocação', 'huambo', 'bengo', 'benguela', 'huíla', 'huila', 'namibe', 'cunene', 'malanje', 'uíge', 'uige', 'bié', 'bie', 'lunda', 'moxico', 'zaire', 'province', 'travel fee', 'frais de déplacement'])) {
    let rateKey = '';
    if (lower.includes('bengo') && !lower.includes('ícolo')) rateKey = 'bengo';
    else if (has(lower, ['ícolo', 'icolo'])) rateKey = 'icolo';
    else if (has(lower, ['huambo', 'benguela', 'zaire', 'malanje', 'kwanza', 'cuanza', 'uíge', 'uige'])) rateKey = 'group250';
    else if (has(lower, ['huíla', 'huila', 'lunda-norte', 'lunda norte'])) rateKey = 'group350';
    else if (has(lower, ['bié', 'bie'])) rateKey = 'bie';
    else if (has(lower, ['cunene', 'namibe', 'cuando', 'lunda-sul', 'lunda sul'])) rateKey = 'group450';
    else if (lower.includes('moxico')) rateKey = 'moxico';

    const specificRate = rateKey ? `${i18n.t(`chat.fallback.provinces.rates.${rateKey}`)} ` : '';
    const base = reply('provinces');
    return { ...base, message: `${specificRate}${base.message}` };
  }

  // 16. INTENT: Caução / Depósito de Garantia (Livre Condução)
  if (has(lower, ['caução', 'caucao', 'depósito', 'deposito', 'garantia', 'deposit', 'security deposit', 'caution', 'dépôt de garantie'])) {
    return reply('deposit');
  }

  // 17. INTENT: Multas, Penalizações e Políticas de Entrega
  if (has(lower, ['multa', 'penalização', 'atraso', 'higienização', 'regras', 'fine', 'penalty', 'late return', 'cleaning', 'rules', 'amende', 'pénalité', 'retard', 'nettoyage', 'règles'])) {
    return reply('penalties');
  }

  // 18. INTENT: Balcões e Localização Física Exata
  if (has(lower, ['onde fica', 'endereço', 'morada', 'localização', 'balcão', 'hcta', 'where are you', 'address', 'location', 'desk', 'où êtes', 'adresse', 'localisation', 'comptoir'])) {
    return reply('location');
  }

  // 19. INTENT: Transfer Aeroporto (LAD / AIAAN)
  if (has(lower, ['aeroporto', 'transfer', 'voo', 'aiaan', '4 de fevereiro', 'airport', 'flight', 'aéroport', 'mon vol', 'numéro de vol', 'vol '])) {
    return reply('airport');
  }

  // 20. INTENT: Seguro, Garantias & Viatura de Substituição
  if (has(lower, ['seguro', 'avaria', 'acontecer algo', 'assistência', 'insurance', 'something happens', 'assistance', 'assurance'])) {
    return reply('insurance');
  }

  // 21. INTENT: Discrição e Protocolo Diplomático
  if (has(lower, ['diplomático', 'embaixada', 'discrição', 'confidencial', 'segurança', 'diplomatic', 'embassy', 'discretion', 'confidential', 'security', 'diplomatique', 'ambassade', 'confidentiel', 'sécurité'])) {
    return reply('diplomatic');
  }

  // 22. INTENT: Horário de Funcionamento
  if (has(lower, ['horário', 'aberto', 'fim de semana', '24h', 'madrugada', 'opening hours', 'open 24', 'weekend', 'at night', 'horaires', 'ouvert', 'week-end', 'nuit'])) {
    return reply('hours');
  }

  // Resposta Padrão de Cortesia (Calorosa, Humana e Convidativa)
  return reply('default');
}

function generateDynamicReplies(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  const replies = (key: string) => i18n.t(`chat.dynamicReplies.${key}`, { returnObjects: true }) as string[];
  if (has(lower, ['preço', 'quanto', 'price', 'how much', 'prix', 'combien'])) return replies('prices');
  if (has(lower, ['aeroporto', 'transfer', 'airport', 'aéroport'])) return replies('airport');
  if (has(lower, ['casamento', 'evento', 'wedding', 'event', 'mariage', 'événement'])) return replies('events');
  if (has(lower, ['província', 'huambo', 'bengo', 'province'])) return replies('provinces');
  return replies('default');
}
