/**
 * Páginas de destino orientadas a pesquisa (SEO).
 *
 * Cada página responde a uma pesquisa com intenção comercial concreta
 * ("aluguer de carros Luanda", "transfer aeroporto Luanda", …). O texto usa
 * apenas factos já publicados no site (FAQ, rotas, cobertura, quem somos) e os
 * preços vêm sempre do catálogo oficial (PUBLIC_FLEET) — nunca escritos à mão.
 *
 * `{{from}}` nos textos é substituído pelo preço mais baixo das viaturas listadas.
 */
export type LandingLang = 'pt' | 'en' | 'fr';
export type LandingIcon = 'car' | 'chauffeur' | 'plane' | 'crown' | 'van' | 'map' | 'building';

export interface LandingCopy {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lead: string;
  highlights: string[];
  sections: { title: string; body: string }[];
  fleetTitle: string;
  faq: { q: string; a: string }[];
}

export interface LandingPage {
  slug: string;
  icon: LandingIcon;
  /** Nome do serviço em schema.org (Service.serviceType). */
  serviceType: string;
  areaServed: string[];
  /** Viaturas do catálogo apresentadas na página (ids de PUBLIC_FLEET). */
  vehicleIds: string[];
  /** Preço mostrado: diária ou transfer. */
  priceMode: 'day' | 'transfer';
  related: string[];
  copy: Record<LandingLang, LandingCopy>;
}

const ANGOLA = ['Luanda', 'Huambo', 'Bengo', 'Benguela', 'Angola'];

export const LANDING_PAGES: LandingPage[] = [
  {
    slug: 'aluguer-de-carros-luanda',
    icon: 'car',
    serviceType: 'Aluguer de viaturas (rent-a-car)',
    areaServed: ['Luanda', 'Talatona', 'Viana', 'Cacuaco', 'Angola'],
    vehicleIds: ['kia-morning', 'hyundai-i-20', 'suzuki-swift', 'hyundai-creta', 'hyundai-tucson', 'toyota-hilux', 'toyota-prado-atual', 'hyundai-staria-atual'],
    priceMode: 'day',
    related: ['aluguer-de-carros-com-motorista', 'transfer-aeroporto-luanda', 'rent-a-car-empresas-angola'],
    copy: {
      pt: {
        metaTitle: 'Aluguer de Carros em Luanda desde {{from}}/dia | PEPEK Rent-a-Car',
        metaDescription: 'Rent-a-car em Luanda com 50 viaturas: económicos, SUVs, 4x4, vans e luxo. Com ou sem motorista, transfers no aeroporto e apoio 24/7. Reserve já.',
        eyebrow: 'Rent-a-car em Luanda',
        h1: 'Aluguer de carros em Luanda, com ou sem motorista',
        lead: 'Da viatura económica para o dia-a-dia ao SUV executivo e à van para grupos, a PEPEK GRUPO RENT-A-CAR tem a viatura certa em Luanda desde {{from}} por dia, com central de operações em Talatona a funcionar 24 horas.',
        highlights: ['50 viaturas no catálogo oficial 2026', 'Livre condução ou com motorista profissional', 'Assistência 24/7 e viatura de substituição', 'Pagamento em AOA, USD ou EUR'],
        sections: [
          { title: 'Uma frota para cada deslocação em Luanda', body: 'Económicos como o Kia Morning e o Suzuki Swift para circular na cidade, SUVs como o Hyundai Tucson para mais conforto, 4x4 como a Toyota Hilux para obras e projectos em Viana ou Cacuaco, e vans como a Hyundai Staria para equipas e famílias. Todas as viaturas são preparadas e acompanhadas pela nossa base de manutenção própria.' },
          { title: 'Requisitos para alugar em livre condução', body: 'Bilhete de Identidade ou Passaporte válido, Carta de Condução com mais de 2 anos, comprovativo de morada ou estadia em Angola e caução por cartão ou transferência. Se preferir não conduzir, disponibilizamos motorista profissional para o período contratado.' },
          { title: 'Apoio durante todo o aluguer', body: 'A central de operações em Talatona responde 24 horas por dia pelo telefone e WhatsApp. Em caso de avaria, garantimos assistência técnica e uma viatura de substituição da mesma categoria ou superior, sem custos adicionais.' },
        ],
        fleetTitle: 'Viaturas disponíveis para alugar em Luanda',
        faq: [
          { q: 'Quanto custa alugar um carro em Luanda?', a: 'A diária começa em {{from}} para viaturas económicas. SUVs, 4x4, vans e viaturas de luxo têm preços próprios, indicados em cada viatura da frota.' },
          { q: 'Posso alugar carro com motorista em Luanda?', a: 'Sim. Todas as viaturas podem ser contratadas com motorista profissional, fardado e formado em condução defensiva e protocolo executivo.' },
          { q: 'Posso sair de Luanda com a viatura alugada?', a: 'Sim. A frota de 4x4 e SUVs tem autorização e cobertura para viajar para o Huambo, Bengo, Benguela e outras províncias, com rastreio GPS 24/7 e assistência móvel.' },
        ],
      },
      en: {
        metaTitle: 'Car Rental in Luanda from {{from}}/day | PEPEK Rent-a-Car Angola',
        metaDescription: 'Car hire in Luanda with 50 vehicles: economy, SUVs, 4x4, vans and luxury. Self-drive or with driver, airport transfers and 24/7 support. Book now.',
        eyebrow: 'Car hire in Luanda',
        h1: 'Car rental in Luanda, self-drive or with a driver',
        lead: 'From economy cars for daily use to executive SUVs and vans for groups, PEPEK GRUPO RENT-A-CAR has the right vehicle in Luanda from {{from}} per day, backed by a 24-hour operations centre in Talatona.',
        highlights: ['50 vehicles in the official 2026 catalogue', 'Self-drive or with a professional driver', '24/7 assistance and replacement vehicle', 'Pay in AOA, USD or EUR'],
        sections: [
          { title: 'A fleet for every trip in Luanda', body: 'Economy cars such as the Kia Morning and Suzuki Swift for city driving, SUVs such as the Hyundai Tucson for extra comfort, 4x4s such as the Toyota Hilux for projects in Viana or Cacuaco, and vans such as the Hyundai Staria for teams and families. Every vehicle is prepared and serviced at our own maintenance base.' },
          { title: 'Self-drive requirements', body: 'Valid ID card or passport, a driving licence held for more than 2 years, proof of address or stay in Angola, and a deposit by card or bank transfer. If you prefer not to drive, a professional driver is available for the whole rental period.' },
          { title: 'Support throughout your rental', body: 'Our operations centre in Talatona answers 24 hours a day by phone and WhatsApp. In case of breakdown we provide technical assistance and a replacement vehicle of the same or higher category at no extra cost.' },
        ],
        fleetTitle: 'Vehicles available for rent in Luanda',
        faq: [
          { q: 'How much does it cost to rent a car in Luanda?', a: 'Daily rates start at {{from}} for economy cars. SUVs, 4x4s, vans and luxury vehicles have their own rates, shown on each vehicle in our fleet.' },
          { q: 'Can I rent a car with a driver in Luanda?', a: 'Yes. Every vehicle can be booked with a uniformed professional driver trained in defensive driving and executive protocol.' },
          { q: 'Can I drive the rental car outside Luanda?', a: 'Yes. Our 4x4 and SUV fleet is authorised and covered for trips to Huambo, Bengo, Benguela and other provinces, with 24/7 GPS tracking and mobile assistance.' },
        ],
      },
      fr: {
        metaTitle: 'Location de voiture à Luanda dès {{from}}/jour | PEPEK Rent-a-Car',
        metaDescription: 'Location de voitures à Luanda : 50 véhicules, citadines, SUV, 4x4, vans et luxe. Avec ou sans chauffeur, transferts aéroport, assistance 24h/24.',
        eyebrow: 'Location de voiture à Luanda',
        h1: 'Location de voiture à Luanda, avec ou sans chauffeur',
        lead: 'De la citadine économique au SUV exécutif et au van pour les groupes, PEPEK GRUPO RENT-A-CAR propose le bon véhicule à Luanda dès {{from}} par jour, avec un centre d’opérations à Talatona ouvert 24h/24.',
        highlights: ['50 véhicules au catalogue officiel 2026', 'Sans chauffeur ou avec chauffeur professionnel', 'Assistance 24h/24 et véhicule de remplacement', 'Paiement en AOA, USD ou EUR'],
        sections: [
          { title: 'Une flotte pour chaque déplacement à Luanda', body: 'Citadines comme la Kia Morning et la Suzuki Swift pour la ville, SUV comme le Hyundai Tucson pour plus de confort, 4x4 comme le Toyota Hilux pour les projets à Viana ou Cacuaco, et vans comme le Hyundai Staria pour les équipes et les familles. Chaque véhicule est préparé dans notre propre base de maintenance.' },
          { title: 'Conditions de location sans chauffeur', body: 'Carte d’identité ou passeport valide, permis de conduire de plus de 2 ans, justificatif d’adresse ou de séjour en Angola et caution par carte ou virement. Si vous préférez ne pas conduire, un chauffeur professionnel est disponible pendant toute la location.' },
          { title: 'Assistance pendant toute la location', body: 'Notre centre d’opérations à Talatona répond 24h/24 par téléphone et WhatsApp. En cas de panne, nous assurons l’assistance technique et un véhicule de remplacement de catégorie égale ou supérieure, sans frais supplémentaires.' },
        ],
        fleetTitle: 'Véhicules disponibles à la location à Luanda',
        faq: [
          { q: 'Combien coûte la location d’une voiture à Luanda ?', a: 'Le tarif journalier commence à {{from}} pour les citadines. Les SUV, 4x4, vans et véhicules de luxe ont leurs propres tarifs, indiqués sur chaque véhicule.' },
          { q: 'Puis-je louer une voiture avec chauffeur à Luanda ?', a: 'Oui. Tous les véhicules peuvent être réservés avec un chauffeur professionnel en uniforme, formé à la conduite défensive et au protocole.' },
          { q: 'Puis-je quitter Luanda avec le véhicule loué ?', a: 'Oui. Nos 4x4 et SUV sont autorisés et couverts pour Huambo, Bengo, Benguela et les autres provinces, avec suivi GPS 24h/24 et assistance mobile.' },
        ],
      },
    },
  },
  {
    slug: 'aluguer-de-carros-com-motorista',
    icon: 'chauffeur',
    serviceType: 'Aluguer de viaturas com motorista (chauffeur)',
    areaServed: ANGOLA,
    vehicleIds: ['toyota-prado-atual', 'toyota-lc300-2023', 'mercedes-class-s-2025', 'lexus-600', 'hyundai-staria-executiva', 'mercedes-benz-v300-class'],
    priceMode: 'day',
    related: ['transfer-aeroporto-luanda', 'aluguer-de-carros-de-luxo-angola', 'rent-a-car-empresas-angola'],
    copy: {
      pt: {
        metaTitle: 'Aluguer de Carro com Motorista em Luanda e Angola | PEPEK Chauffeur',
        metaDescription: 'Motorista profissional, fardado e formado em protocolo executivo e condução defensiva. SUVs, berlinas de luxo e vans VIP em Luanda e em toda Angola, 24/7.',
        eyebrow: 'Chauffeur executivo',
        h1: 'Aluguer de carro com motorista em Luanda e em toda Angola',
        lead: 'Um serviço de chauffeur completo: viatura topo de gama, motorista profissional fardado e acompanhamento da central de operações durante todo o período contratado, para executivos, delegações, embaixadas e eventos.',
        highlights: ['Motoristas formados em protocolo executivo', 'Condução defensiva e sigilo profissional', 'Combustível incluído ou a combinar', 'Disponível à hora, ao dia ou em contrato'],
        sections: [
          { title: 'Como funciona o serviço de motorista', body: 'Escolhe a viatura e o período; a PEPEK GRUPO disponibiliza um motorista devidamente fardado, credenciado em protocolo executivo, condução defensiva e sigilo profissional, que fica à disposição do cliente ou da comitiva durante todo o serviço.' },
          { title: 'Para quem é indicado', body: 'Executivos em visita a Angola, delegações e corpos diplomáticos, conselhos de administração, eventos corporativos e famílias que preferem não conduzir. Servimos embaixadas, entidades do Estado e empresas de sectores estratégicos onde discrição e pontualidade são obrigatórias.' },
          { title: 'Viagens dentro e fora de Luanda', body: 'Além de Luanda, realizamos missões para o Bengo, o Huambo, Benguela e outras províncias, com viaturas 4x4 rastreadas por GPS 24/7 e assistência mecânica móvel em todo o território.' },
        ],
        fleetTitle: 'Viaturas recomendadas para serviço com motorista',
        faq: [
          { q: 'O motorista fica à disposição durante todo o dia?', a: 'Sim. O motorista acompanha o cliente ou a comitiva durante todo o período contratado, com a central de operações a apoiar alterações de agenda 24/7.' },
          { q: 'O combustível está incluído?', a: 'No serviço de chauffeur a viatura é entregue com combustível incluído ou em condições a combinar, conforme a proposta.' },
          { q: 'Os motoristas falam outras línguas?', a: 'Dispomos de motoristas profissionais e multilingues para clientes nacionais e internacionais; indique a língua pretendida no pedido.' },
        ],
      },
      en: {
        metaTitle: 'Car Rental with Driver in Luanda & Angola | PEPEK Chauffeur Service',
        metaDescription: 'Uniformed professional drivers trained in executive protocol and defensive driving. Luxury sedans, SUVs and VIP vans in Luanda and across Angola, 24/7.',
        eyebrow: 'Executive chauffeur',
        h1: 'Car rental with driver in Luanda and across Angola',
        lead: 'A complete chauffeur service: premium vehicle, uniformed professional driver and operations-centre support throughout the booking, for executives, delegations, embassies and events.',
        highlights: ['Drivers trained in executive protocol', 'Defensive driving and confidentiality', 'Fuel included or as agreed', 'Hourly, daily or contract bookings'],
        sections: [
          { title: 'How the chauffeur service works', body: 'Choose the vehicle and period; PEPEK GRUPO provides a uniformed driver trained in executive protocol, defensive driving and professional confidentiality, at the disposal of the client or delegation for the whole service.' },
          { title: 'Who it is for', body: 'Executives visiting Angola, delegations and diplomatic missions, boards, corporate events and families who prefer not to drive. We serve embassies, government bodies and companies in strategic sectors where discretion and punctuality are essential.' },
          { title: 'Trips inside and outside Luanda', body: 'Beyond Luanda we run missions to Bengo, Huambo, Benguela and other provinces with 4x4 vehicles tracked by GPS 24/7 and mobile mechanical assistance nationwide.' },
        ],
        fleetTitle: 'Recommended vehicles for chauffeur service',
        faq: [
          { q: 'Does the driver stay with me all day?', a: 'Yes. The driver accompanies the client or delegation for the whole contracted period, with the operations centre handling schedule changes 24/7.' },
          { q: 'Is fuel included?', a: 'For chauffeur service the vehicle is provided with fuel included or on terms agreed in the proposal.' },
          { q: 'Do the drivers speak other languages?', a: 'We have professional multilingual drivers for local and international clients; tell us the language you need when booking.' },
        ],
      },
      fr: {
        metaTitle: 'Location de voiture avec chauffeur à Luanda et en Angola | PEPEK',
        metaDescription: 'Chauffeurs professionnels en uniforme, formés au protocole et à la conduite défensive. Berlines de luxe, SUV et vans VIP à Luanda et dans tout l’Angola, 24h/24.',
        eyebrow: 'Chauffeur exécutif',
        h1: 'Location de voiture avec chauffeur à Luanda et dans tout l’Angola',
        lead: 'Un service de chauffeur complet : véhicule haut de gamme, chauffeur professionnel en uniforme et suivi par le centre d’opérations pendant toute la réservation, pour dirigeants, délégations, ambassades et événements.',
        highlights: ['Chauffeurs formés au protocole exécutif', 'Conduite défensive et confidentialité', 'Carburant inclus ou à convenir', 'À l’heure, à la journée ou sous contrat'],
        sections: [
          { title: 'Comment fonctionne le service', body: 'Vous choisissez le véhicule et la période ; PEPEK GRUPO met à disposition un chauffeur en uniforme, formé au protocole exécutif, à la conduite défensive et à la confidentialité, pendant toute la durée du service.' },
          { title: 'Pour qui', body: 'Dirigeants en visite en Angola, délégations et corps diplomatiques, conseils d’administration, événements d’entreprise et familles. Nous servons ambassades, institutions publiques et entreprises de secteurs stratégiques.' },
          { title: 'Déplacements à Luanda et en province', body: 'Au-delà de Luanda, nous assurons des missions vers Bengo, Huambo, Benguela et d’autres provinces avec des 4x4 suivis par GPS 24h/24 et une assistance mécanique mobile.' },
        ],
        fleetTitle: 'Véhicules recommandés avec chauffeur',
        faq: [
          { q: 'Le chauffeur reste-t-il à disposition toute la journée ?', a: 'Oui. Le chauffeur accompagne le client ou la délégation pendant toute la période réservée, avec l’appui du centre d’opérations 24h/24.' },
          { q: 'Le carburant est-il inclus ?', a: 'Pour le service avec chauffeur, le carburant est inclus ou fixé selon les conditions de la proposition.' },
          { q: 'Les chauffeurs parlent-ils d’autres langues ?', a: 'Nous disposons de chauffeurs multilingues ; indiquez la langue souhaitée lors de la demande.' },
        ],
      },
    },
  },
  {
    slug: 'transfer-aeroporto-luanda',
    icon: 'plane',
    serviceType: 'Transfer de aeroporto',
    areaServed: ['Luanda', 'Talatona', 'Miramar', 'Aeroporto Internacional Dr. António Agostinho Neto', 'Aeroporto 4 de Fevereiro'],
    vehicleIds: ['hyundai-tucson', 'toyota-prado-atual', 'toyota-lc300-2023', 'mercedes-class-s-2025', 'hyundai-staria-atual', 'new-toyota-hiace'],
    priceMode: 'transfer',
    related: ['aluguer-de-carros-com-motorista', 'aluguer-de-carros-luanda', 'aluguer-de-carrinhas-e-vans-angola'],
    copy: {
      pt: {
        metaTitle: 'Transfer Aeroporto Luanda (AIAAN e 4 de Fevereiro) desde {{from}} | PEPEK',
        metaDescription: 'Transfer do Aeroporto de Luanda (AIAAN / 4 de Fevereiro) para Talatona, Miramar e hotéis. Motorista com placa, voo monitorizado e 60 min de espera sem custo.',
        eyebrow: 'Transfers de aeroporto',
        h1: 'Transfer do aeroporto de Luanda com motorista à sua espera',
        lead: 'Recepção no Aeroporto Internacional Dr. António Agostinho Neto (AIAAN) e no 4 de Fevereiro, com motorista na área de desembarque, voo monitorizado em tempo real e transfer desde {{from}}.',
        highlights: ['Motorista com placa na chegada internacional', 'Voo monitorizado: atrasos sem custo adicional', 'Tolerância de espera de 60 minutos', 'Confirmação em menos de 15 minutos'],
        sections: [
          { title: 'Como é feita a recepção', body: 'O motorista aguarda na área de desembarque internacional com uma placa com o nome do passageiro ou da instituição, ajuda com a bagagem e acompanha-o até à viatura climatizada. Monitorizamos o voo para ajustar a hora de recolha sem custos em caso de atraso. Serviço Meet & Greet disponível mediante consulta.' },
          { title: 'Destinos e tempos de viagem', body: 'Aeroporto ➔ Talatona (hotéis e centros empresariais): 35 a 45 minutos. Aeroporto ➔ Miramar, Alvalade e zona diplomática: 20 a 30 minutos. Também fazemos transfers para Viana, Cacuaco, Bengo e ligações interprovinciais.' },
          { title: 'Viaturas para cada chegada', body: 'SUVs executivas como a Toyota Land Cruiser Prado e LC300 para executivos, Mercedes-Benz Classe S para protocolo e vans como a Hyundai Staria e Toyota Hiace para grupos e bagagem volumosa. Água, climatização e carregadores a bordo.' },
        ],
        fleetTitle: 'Viaturas para transfer no aeroporto de Luanda',
        faq: [
          { q: 'Quanto custa um transfer do aeroporto de Luanda?', a: 'O transfer começa em {{from}}; o valor final depende da viatura escolhida. Cada viatura mostra o seu preço de transfer.' },
          { q: 'E se o meu voo atrasar?', a: 'Monitorizamos o número do voo em tempo real e ajustamos a hora de recolha sem custos adicionais, com tolerância de espera de 60 minutos.' },
          { q: 'Fazem transfers no novo aeroporto AIAAN?', a: 'Sim. Operamos no Aeroporto Internacional Dr. António Agostinho Neto (AIAAN) e no Aeroporto 4 de Fevereiro.' },
        ],
      },
      en: {
        metaTitle: 'Luanda Airport Transfer (AIAAN & 4 de Fevereiro) from {{from}} | PEPEK',
        metaDescription: 'Private transfer from Luanda Airport (AIAAN / 4 de Fevereiro) to Talatona, Miramar and hotels. Driver with name sign, flight tracking, 60 min free waiting.',
        eyebrow: 'Airport transfers',
        h1: 'Luanda airport transfer with a driver waiting for you',
        lead: 'Meet-and-greet at Dr. António Agostinho Neto International Airport (AIAAN) and 4 de Fevereiro, with a driver in the arrivals hall, real-time flight tracking and transfers from {{from}}.',
        highlights: ['Driver with name sign at international arrivals', 'Flight tracking: delays at no extra cost', '60-minute waiting tolerance', 'Confirmation in under 15 minutes'],
        sections: [
          { title: 'How pick-up works', body: 'The driver waits in the international arrivals area with a sign showing the passenger’s or organisation’s name, helps with luggage and takes you to the air-conditioned vehicle. We track your flight and adjust pick-up time at no cost if it is delayed. Meet & Greet available on request.' },
          { title: 'Destinations and journey times', body: 'Airport ➔ Talatona (hotels and business centres): 35–45 minutes. Airport ➔ Miramar, Alvalade and the diplomatic area: 20–30 minutes. We also run transfers to Viana, Cacuaco, Bengo and other provinces.' },
          { title: 'Vehicles for every arrival', body: 'Executive SUVs such as the Toyota Land Cruiser Prado and LC300, the Mercedes-Benz S-Class for protocol, and vans such as the Hyundai Staria and Toyota Hiace for groups and large luggage. Water, climate control and chargers on board.' },
        ],
        fleetTitle: 'Vehicles for Luanda airport transfers',
        faq: [
          { q: 'How much is a Luanda airport transfer?', a: 'Transfers start at {{from}}; the final price depends on the vehicle. Each vehicle shows its transfer price.' },
          { q: 'What if my flight is delayed?', a: 'We track your flight number in real time and adjust the pick-up time at no extra cost, with a 60-minute waiting tolerance.' },
          { q: 'Do you serve the new AIAAN airport?', a: 'Yes. We operate at Dr. António Agostinho Neto International Airport (AIAAN) and 4 de Fevereiro Airport.' },
        ],
      },
      fr: {
        metaTitle: 'Transfert aéroport de Luanda (AIAAN et 4 de Fevereiro) dès {{from}}',
        metaDescription: 'Transfert privé depuis l’aéroport de Luanda (AIAAN / 4 de Fevereiro) vers Talatona, Miramar et les hôtels. Chauffeur avec pancarte, vol suivi, 60 min d’attente.',
        eyebrow: 'Transferts aéroport',
        h1: 'Transfert depuis l’aéroport de Luanda avec chauffeur qui vous attend',
        lead: 'Accueil à l’aéroport international Dr. António Agostinho Neto (AIAAN) et au 4 de Fevereiro, chauffeur dans le hall des arrivées, vol suivi en temps réel et transferts dès {{from}}.',
        highlights: ['Chauffeur avec pancarte aux arrivées', 'Vol suivi : retards sans frais', '60 minutes d’attente incluses', 'Confirmation en moins de 15 minutes'],
        sections: [
          { title: 'Comment se passe l’accueil', body: 'Le chauffeur vous attend aux arrivées internationales avec une pancarte à votre nom ou à celui de votre institution, vous aide avec les bagages et vous conduit au véhicule climatisé. Nous suivons votre vol et ajustons l’heure sans frais en cas de retard.' },
          { title: 'Destinations et temps de trajet', body: 'Aéroport ➔ Talatona (hôtels et centres d’affaires) : 35 à 45 minutes. Aéroport ➔ Miramar, Alvalade et quartier diplomatique : 20 à 30 minutes. Transferts également vers Viana, Cacuaco, Bengo et les provinces.' },
          { title: 'Des véhicules pour chaque arrivée', body: 'SUV exécutifs Toyota Land Cruiser Prado et LC300, Mercedes-Benz Classe S pour le protocole et vans Hyundai Staria et Toyota Hiace pour les groupes. Eau, climatisation et chargeurs à bord.' },
        ],
        fleetTitle: 'Véhicules pour les transferts aéroport',
        faq: [
          { q: 'Combien coûte un transfert depuis l’aéroport de Luanda ?', a: 'Les transferts commencent à {{from}} ; le prix final dépend du véhicule choisi.' },
          { q: 'Et si mon vol est en retard ?', a: 'Nous suivons votre vol en temps réel et ajustons l’heure de prise en charge sans frais, avec 60 minutes d’attente.' },
          { q: 'Desservez-vous le nouvel aéroport AIAAN ?', a: 'Oui. Nous opérons à l’aéroport international Dr. António Agostinho Neto (AIAAN) et à l’aéroport 4 de Fevereiro.' },
        ],
      },
    },
  },
  {
    slug: 'aluguer-de-carros-de-luxo-angola',
    icon: 'crown',
    serviceType: 'Aluguer de viaturas de luxo, blindadas e protocolares',
    areaServed: ANGOLA,
    vehicleIds: ['rangerover-blindado-2025', 'range-rover-novo-modelo', 'mercedes-class-s-2025', 'lexus-600', 'mercedes-g63-2023', 'toyota-lc300-2023', 'nissan-patrol', 'mercedes-benz-v300-class'],
    priceMode: 'day',
    related: ['aluguer-de-carros-com-motorista', 'transfer-aeroporto-luanda', 'rent-a-car-empresas-angola'],
    copy: {
      pt: {
        metaTitle: 'Aluguer de Carros de Luxo e Blindados em Angola | PEPEK GRUPO',
        metaDescription: 'Range Rover blindado, Mercedes-Benz Classe S, Lexus LX 600, G63 e Land Cruiser LC300 para protocolo, diplomacia e eventos em Luanda e Angola. Com motorista.',
        eyebrow: 'Luxo, protocolo e segurança',
        h1: 'Aluguer de carros de luxo e blindados em Angola',
        lead: 'Viaturas de topo para protocolo de Estado, missões diplomáticas, administração de empresas e eventos: do Range Rover blindado ao Mercedes-Benz Classe S, sempre com a discrição e o rigor operacional que a PEPEK GRUPO pratica desde 2014.',
        highlights: ['Range Rover blindado disponível', 'Berlinas e SUVs de luxo 2023–2025', 'Motoristas com formação em protocolo', 'Planeamento e acompanhamento 24/7'],
        sections: [
          { title: 'Frota de luxo e segurança', body: 'Range Rover blindado 2025, novo Range Rover Autobiography, Mercedes-Benz Classe S 2025, Lexus LX 600, Mercedes-AMG G63 e Toyota Land Cruiser LC300, além da Mercedes-Benz Classe V para delegações. Cada viatura é preparada para uma apresentação impecável.' },
          { title: 'Protocolo e discrição', body: 'Servimos corpos diplomáticos, entidades do Estado e empresas de sectores estratégicos. Os nossos motoristas são formados em protocolo executivo, condução defensiva e sigilo profissional, com a central de operações a coordenar cada movimento.' },
          { title: 'Eventos e comitivas', body: 'Coordenamos várias viaturas para cimeiras, conferências, casamentos e visitas oficiais, com planeamento de rotas, horários e contactos directos com a organização.' },
        ],
        fleetTitle: 'Viaturas de luxo e blindadas',
        faq: [
          { q: 'É possível alugar uma viatura blindada em Luanda?', a: 'Sim. A frota inclui o Range Rover blindado 2025, disponível com motorista formado em protocolo e segurança.' },
          { q: 'As viaturas de luxo são alugadas com motorista?', a: 'Recomendamos o serviço com motorista para viaturas de luxo e protocolo; as condições de livre condução são avaliadas caso a caso.' },
          { q: 'Coordenam várias viaturas para eventos oficiais?', a: 'Sim. Planeamos comitivas com várias viaturas, rotas e horários, com acompanhamento da central de operações 24/7.' },
        ],
      },
      en: {
        metaTitle: 'Luxury & Armoured Car Rental in Angola | PEPEK GRUPO Luanda',
        metaDescription: 'Armoured Range Rover, Mercedes-Benz S-Class, Lexus LX 600, G63 and Land Cruiser LC300 for protocol, diplomacy and events in Luanda and Angola. With driver.',
        eyebrow: 'Luxury, protocol and security',
        h1: 'Luxury and armoured car rental in Angola',
        lead: 'Top-tier vehicles for state protocol, diplomatic missions, corporate leadership and events — from the armoured Range Rover to the Mercedes-Benz S-Class — with the discretion and operational rigour PEPEK GRUPO has delivered since 2014.',
        highlights: ['Armoured Range Rover available', '2023–2025 luxury sedans and SUVs', 'Protocol-trained drivers', '24/7 planning and support'],
        sections: [
          { title: 'Luxury and security fleet', body: 'Armoured Range Rover 2025, the new Range Rover Autobiography, Mercedes-Benz S-Class 2025, Lexus LX 600, Mercedes-AMG G63 and Toyota Land Cruiser LC300, plus the Mercedes-Benz V-Class for delegations.' },
          { title: 'Protocol and discretion', body: 'We serve diplomatic missions, government bodies and strategic-sector companies. Our drivers are trained in executive protocol, defensive driving and confidentiality, coordinated by our operations centre.' },
          { title: 'Events and motorcades', body: 'We coordinate multiple vehicles for summits, conferences, weddings and official visits, with route planning, timings and direct contact with organisers.' },
        ],
        fleetTitle: 'Luxury and armoured vehicles',
        faq: [
          { q: 'Can I rent an armoured vehicle in Luanda?', a: 'Yes. Our fleet includes the 2025 armoured Range Rover, available with a protocol- and security-trained driver.' },
          { q: 'Are luxury vehicles rented with a driver?', a: 'We recommend chauffeur service for luxury and protocol vehicles; self-drive is assessed case by case.' },
          { q: 'Do you coordinate several vehicles for official events?', a: 'Yes. We plan motorcades with several vehicles, routes and timings, supported 24/7 by our operations centre.' },
        ],
      },
      fr: {
        metaTitle: 'Location de voitures de luxe et blindées en Angola | PEPEK GRUPO',
        metaDescription: 'Range Rover blindé, Mercedes-Benz Classe S, Lexus LX 600, G63 et Land Cruiser LC300 pour protocole, diplomatie et événements à Luanda. Avec chauffeur.',
        eyebrow: 'Luxe, protocole et sécurité',
        h1: 'Location de voitures de luxe et blindées en Angola',
        lead: 'Des véhicules haut de gamme pour le protocole d’État, les missions diplomatiques, les dirigeants et les événements — du Range Rover blindé à la Mercedes-Benz Classe S — avec la discrétion de PEPEK GRUPO depuis 2014.',
        highlights: ['Range Rover blindé disponible', 'Berlines et SUV de luxe 2023–2025', 'Chauffeurs formés au protocole', 'Planification et suivi 24h/24'],
        sections: [
          { title: 'Flotte de luxe et de sécurité', body: 'Range Rover blindé 2025, nouveau Range Rover Autobiography, Mercedes-Benz Classe S 2025, Lexus LX 600, Mercedes-AMG G63 et Toyota Land Cruiser LC300, ainsi que la Mercedes-Benz Classe V pour les délégations.' },
          { title: 'Protocole et discrétion', body: 'Nous servons corps diplomatiques, institutions publiques et entreprises stratégiques, avec des chauffeurs formés au protocole, à la conduite défensive et à la confidentialité.' },
          { title: 'Événements et cortèges', body: 'Nous coordonnons plusieurs véhicules pour sommets, conférences, mariages et visites officielles.' },
        ],
        fleetTitle: 'Véhicules de luxe et blindés',
        faq: [
          { q: 'Peut-on louer un véhicule blindé à Luanda ?', a: 'Oui. Notre flotte comprend le Range Rover blindé 2025, disponible avec chauffeur formé au protocole et à la sécurité.' },
          { q: 'Les véhicules de luxe sont-ils loués avec chauffeur ?', a: 'Nous recommandons le service avec chauffeur ; la location sans chauffeur est étudiée au cas par cas.' },
          { q: 'Coordonnez-vous plusieurs véhicules pour des événements officiels ?', a: 'Oui, avec planification des itinéraires et horaires et un suivi 24h/24.' },
        ],
      },
    },
  },
  {
    slug: 'aluguer-de-carrinhas-e-vans-angola',
    icon: 'van',
    serviceType: 'Aluguer de carrinhas, vans e minibus',
    areaServed: ANGOLA,
    vehicleIds: ['hyundai-h1', 'hyundai-staria-atual', 'hyundai-staria-executiva', 'new-toyota-hiace', 'mercedes-sprinter-atual', 'toyota-coaster', 'mercedes-benz-v300-class'],
    priceMode: 'day',
    related: ['transfer-aeroporto-luanda', 'aluguer-de-carros-com-motorista', 'rent-a-car-empresas-angola'],
    copy: {
      pt: {
        metaTitle: 'Aluguer de Carrinhas, Vans e Minibus em Luanda desde {{from}}/dia | PEPEK',
        metaDescription: 'Hyundai Staria, Toyota Hiace, Mercedes Sprinter, Toyota Coaster e Classe V para grupos, equipas, eventos e delegações em Luanda e Angola. Com motorista.',
        eyebrow: 'Transporte de grupos',
        h1: 'Aluguer de carrinhas, vans e minibus em Angola',
        lead: 'Para equipas de trabalho, delegações, eventos, casamentos e transfers de grupo: vans e minibus com motorista profissional, desde {{from}} por dia.',
        highlights: ['Da van familiar ao minibus Toyota Coaster', 'Vans VIP para delegações', 'Espaço para bagagem e equipamento', 'Com motorista e apoio 24/7'],
        sections: [
          { title: 'Vans para cada tamanho de grupo', body: 'Hyundai H1 e Hyundai Staria para pequenos grupos e famílias, Toyota Hiace e Mercedes-Benz Sprinter para equipas maiores, Toyota Coaster para grupos numerosos e Mercedes-Benz Classe V e Staria Executiva para delegações VIP.' },
          { title: 'Eventos, obras e deslocações de equipas', body: 'Transportamos convidados de eventos, equipas de projectos industriais em Viana e Cacuaco e comitivas em viagens interprovinciais, com planeamento de horários e pontos de recolha.' },
          { title: 'Transfers de grupo no aeroporto', body: 'Recolha de grupos no AIAAN e no 4 de Fevereiro com motorista à espera, voo monitorizado e espaço para toda a bagagem.' },
        ],
        fleetTitle: 'Vans e minibus disponíveis',
        faq: [
          { q: 'Quanto custa alugar uma van em Luanda?', a: 'As vans começam em {{from}} por dia; o valor depende do modelo e da duração. Cada viatura mostra a sua diária.' },
          { q: 'As vans são alugadas com motorista?', a: 'Sim, disponibilizamos motorista profissional para vans e minibus, recomendado para grupos e eventos.' },
          { q: 'Podem transportar grupos para outras províncias?', a: 'Sim. Organizamos deslocações interprovinciais com planeamento de rota e assistência em viagem.' },
        ],
      },
      en: {
        metaTitle: 'Van & Minibus Rental in Luanda from {{from}}/day | PEPEK GRUPO',
        metaDescription: 'Hyundai Staria, Toyota Hiace, Mercedes Sprinter, Toyota Coaster and V-Class for groups, teams, events and delegations in Luanda and Angola. With driver.',
        eyebrow: 'Group transport',
        h1: 'Van and minibus rental in Angola',
        lead: 'For work teams, delegations, events, weddings and group transfers: vans and minibuses with a professional driver from {{from}} per day.',
        highlights: ['From family vans to the Toyota Coaster', 'VIP vans for delegations', 'Room for luggage and equipment', 'With driver and 24/7 support'],
        sections: [
          { title: 'Vans for every group size', body: 'Hyundai H1 and Staria for small groups and families, Toyota Hiace and Mercedes-Benz Sprinter for larger teams, Toyota Coaster for big groups, and Mercedes-Benz V-Class and Staria Executive for VIP delegations.' },
          { title: 'Events, projects and team travel', body: 'We move event guests, project teams in Viana and Cacuaco, and delegations on interprovincial trips, with planned schedules and pick-up points.' },
          { title: 'Group airport transfers', body: 'Group pick-ups at AIAAN and 4 de Fevereiro with a driver waiting, flight tracking and space for all luggage.' },
        ],
        fleetTitle: 'Available vans and minibuses',
        faq: [
          { q: 'How much does it cost to rent a van in Luanda?', a: 'Vans start at {{from}} per day; the price depends on model and duration.' },
          { q: 'Are vans rented with a driver?', a: 'Yes, a professional driver is available and recommended for groups and events.' },
          { q: 'Can you take groups to other provinces?', a: 'Yes. We organise interprovincial trips with route planning and on-trip assistance.' },
        ],
      },
      fr: {
        metaTitle: 'Location de vans et minibus à Luanda dès {{from}}/jour | PEPEK',
        metaDescription: 'Hyundai Staria, Toyota Hiace, Mercedes Sprinter, Toyota Coaster et Classe V pour groupes, équipes, événements et délégations à Luanda. Avec chauffeur.',
        eyebrow: 'Transport de groupes',
        h1: 'Location de vans et minibus en Angola',
        lead: 'Pour équipes, délégations, événements, mariages et transferts de groupe : vans et minibus avec chauffeur professionnel dès {{from}} par jour.',
        highlights: ['Du van familial au Toyota Coaster', 'Vans VIP pour délégations', 'Espace bagages et matériel', 'Avec chauffeur et assistance 24h/24'],
        sections: [
          { title: 'Un van pour chaque groupe', body: 'Hyundai H1 et Staria pour les petits groupes, Toyota Hiace et Mercedes-Benz Sprinter pour les équipes, Toyota Coaster pour les grands groupes, Classe V et Staria Executive pour les délégations VIP.' },
          { title: 'Événements, chantiers et équipes', body: 'Nous transportons invités, équipes de projets à Viana et Cacuaco et délégations en déplacement interprovincial.' },
          { title: 'Transferts aéroport de groupe', body: 'Accueil de groupes à l’AIAAN et au 4 de Fevereiro avec chauffeur, suivi du vol et place pour tous les bagages.' },
        ],
        fleetTitle: 'Vans et minibus disponibles',
        faq: [
          { q: 'Combien coûte la location d’un van à Luanda ?', a: 'Les vans commencent à {{from}} par jour selon le modèle et la durée.' },
          { q: 'Les vans sont-ils loués avec chauffeur ?', a: 'Oui, un chauffeur professionnel est disponible et recommandé pour les groupes.' },
          { q: 'Allez-vous dans d’autres provinces ?', a: 'Oui, avec planification d’itinéraire et assistance en route.' },
        ],
      },
    },
  },
  {
    slug: 'aluguer-de-carros-huambo',
    icon: 'map',
    serviceType: 'Aluguer de viaturas no Huambo e viagens interprovinciais',
    areaServed: ['Huambo', 'Planalto Central', 'Luanda', 'Benguela', 'Angola'],
    vehicleIds: ['toyota-hilux', 'mitsubishi-l200', 'toyota-lc-hz', 'toyota-lc-v8-2021', 'toyota-fortuner-2023', 'toyota-prado-atual', 'hyundai-santa-fe'],
    priceMode: 'day',
    related: ['aluguer-de-carros-luanda', 'aluguer-de-carros-com-motorista', 'rent-a-car-empresas-angola'],
    copy: {
      pt: {
        metaTitle: 'Aluguer de Carros no Huambo e 4x4 para o Planalto Central | PEPEK',
        metaDescription: 'Rent-a-car no Huambo desde 2014: 4x4, pick-ups e SUVs para missões no Centro e Sul de Angola e viagens Luanda–Huambo. Com ou sem motorista, assistência 24/7.',
        eyebrow: 'Huambo · Planalto Central',
        h1: 'Aluguer de carros no Huambo e 4x4 para o Planalto Central',
        lead: 'A PEPEK GRUPO nasceu no Huambo em 2014 e mantém ali o seu pólo regional do Planalto Central, com frota 4x4 e pilotos locais credenciados para missões no Centro e Sul de Angola.',
        highlights: ['Base operacional regional no Huambo', 'Frota 4x4 todo-o-terreno', 'Pilotos locais credenciados', 'Oficina de apoio rápido'],
        sections: [
          { title: 'Onde a PEPEK começou', body: 'Fundada no Huambo em 2014, a empresa cresceu para Luanda e Bengo sem deixar o Planalto Central. O pólo do Huambo apoia missões no Centro e Sul do país com viaturas 4x4, oficina de apoio rápido e pilotos que conhecem o terreno.' },
          { title: 'Viaturas para estrada e picada', body: 'Toyota Hilux e Mitsubishi L200 para projectos e trabalho de campo, Toyota Land Cruiser HZ e V8 para percursos exigentes, e Fortuner, Prado e Santa Fe para deslocações executivas com conforto.' },
          { title: 'Missões Luanda–Huambo', body: 'Organizamos itinerários de longa distância entre Luanda e o Huambo, com viaturas rastreadas por GPS 24/7 e assistência mecânica móvel ao longo do percurso.' },
        ],
        fleetTitle: 'Viaturas 4x4 e SUVs para o Huambo',
        faq: [
          { q: 'A PEPEK tem base no Huambo?', a: 'Sim. O Huambo é o pólo regional do Planalto Central, com frota 4x4, oficina de apoio rápido e pilotos locais credenciados.' },
          { q: 'Posso alugar em Luanda e viajar para o Huambo?', a: 'Sim. A frota de 4x4 e SUVs tem autorização e cobertura para viagens interprovinciais, com rastreio GPS 24/7.' },
          { q: 'Quanto custa alugar um 4x4 no Huambo?', a: 'Os preços dependem da viatura; cada modelo mostra a sua diária, a partir de {{from}}.' },
        ],
      },
      en: {
        metaTitle: 'Car Rental in Huambo & 4x4 Hire for Angola’s Central Highlands | PEPEK',
        metaDescription: 'Car rental in Huambo since 2014: 4x4s, pick-ups and SUVs for missions in central and southern Angola and Luanda–Huambo trips. With or without driver, 24/7 support.',
        eyebrow: 'Huambo · Central Highlands',
        h1: 'Car rental in Huambo and 4x4 hire for the Central Highlands',
        lead: 'PEPEK GRUPO was founded in Huambo in 2014 and keeps its Central Highlands regional base there, with a 4x4 fleet and accredited local drivers for missions across central and southern Angola.',
        highlights: ['Regional operating base in Huambo', 'All-terrain 4x4 fleet', 'Accredited local drivers', 'Rapid-support workshop'],
        sections: [
          { title: 'Where PEPEK began', body: 'Founded in Huambo in 2014, the company grew into Luanda and Bengo without leaving the Central Highlands. The Huambo base supports missions in central and southern Angola with 4x4 vehicles, a rapid-support workshop and drivers who know the terrain.' },
          { title: 'Vehicles for tarmac and dirt roads', body: 'Toyota Hilux and Mitsubishi L200 for projects and field work, Toyota Land Cruiser HZ and V8 for demanding routes, and Fortuner, Prado and Santa Fe for comfortable executive travel.' },
          { title: 'Luanda–Huambo missions', body: 'We organise long-distance itineraries between Luanda and Huambo with GPS-tracked vehicles and mobile mechanical assistance along the way.' },
        ],
        fleetTitle: '4x4s and SUVs for Huambo',
        faq: [
          { q: 'Does PEPEK have a base in Huambo?', a: 'Yes. Huambo is our Central Highlands regional base, with a 4x4 fleet, rapid-support workshop and accredited local drivers.' },
          { q: 'Can I rent in Luanda and drive to Huambo?', a: 'Yes. Our 4x4 and SUV fleet is authorised and covered for interprovincial trips, with 24/7 GPS tracking.' },
          { q: 'How much is a 4x4 rental in Huambo?', a: 'Prices depend on the vehicle; each model shows its daily rate, from {{from}}.' },
        ],
      },
      fr: {
        metaTitle: 'Location de voiture à Huambo et 4x4 pour le Planalto Central | PEPEK',
        metaDescription: 'Location de voitures à Huambo depuis 2014 : 4x4, pick-up et SUV pour le centre et le sud de l’Angola et les trajets Luanda–Huambo. Assistance 24h/24.',
        eyebrow: 'Huambo · Planalto Central',
        h1: 'Location de voiture à Huambo et 4x4 pour le Planalto Central',
        lead: 'PEPEK GRUPO est née à Huambo en 2014 et y conserve sa base régionale, avec une flotte 4x4 et des chauffeurs locaux accrédités pour les missions dans le centre et le sud de l’Angola.',
        highlights: ['Base opérationnelle régionale à Huambo', 'Flotte 4x4 tout-terrain', 'Chauffeurs locaux accrédités', 'Atelier d’intervention rapide'],
        sections: [
          { title: 'Là où PEPEK a commencé', body: 'Fondée à Huambo en 2014, l’entreprise s’est développée à Luanda et Bengo sans quitter le Planalto Central, où la base de Huambo appuie les missions avec des 4x4 et un atelier rapide.' },
          { title: 'Des véhicules pour route et piste', body: 'Toyota Hilux et Mitsubishi L200 pour le terrain, Land Cruiser HZ et V8 pour les parcours exigeants, Fortuner, Prado et Santa Fe pour le confort.' },
          { title: 'Missions Luanda–Huambo', body: 'Itinéraires longue distance avec véhicules suivis par GPS et assistance mécanique mobile.' },
        ],
        fleetTitle: '4x4 et SUV pour Huambo',
        faq: [
          { q: 'PEPEK a-t-elle une base à Huambo ?', a: 'Oui, c’est notre base régionale du Planalto Central, avec flotte 4x4, atelier et chauffeurs locaux.' },
          { q: 'Puis-je louer à Luanda et aller à Huambo ?', a: 'Oui. Nos 4x4 et SUV sont autorisés pour les trajets interprovinciaux, avec suivi GPS 24h/24.' },
          { q: 'Combien coûte un 4x4 à Huambo ?', a: 'Le prix dépend du véhicule, à partir de {{from}} par jour.' },
        ],
      },
    },
  },
  {
    slug: 'rent-a-car-empresas-angola',
    icon: 'building',
    serviceType: 'Aluguer de viaturas para empresas e contratos corporativos',
    areaServed: ANGOLA,
    vehicleIds: ['hyundai-tucson', 'toyota-hilux', 'toyota-fortuner-2023', 'toyota-prado-atual', 'hyundai-staria-atual', 'toyota-lc300-2023'],
    priceMode: 'day',
    related: ['aluguer-de-carros-com-motorista', 'aluguer-de-carros-luanda', 'aluguer-de-carros-de-luxo-angola'],
    copy: {
      pt: {
        metaTitle: 'Rent-a-Car para Empresas em Angola | Contratos e Faturação a 30 Dias | PEPEK',
        metaDescription: 'Aluguer de viaturas para empresas, embaixadas e governo em Angola: contratos de longa duração, faturação em AOA, USD ou EUR, conta-corrente a 30 dias e portal do cliente.',
        eyebrow: 'Soluções corporativas',
        h1: 'Rent-a-car para empresas, embaixadas e instituições em Angola',
        lead: 'Contratos de mobilidade à medida para empresas e instituições: viaturas e motoristas dedicados, faturação em AOA, USD ou EUR e conta-corrente com pagamento a 30 dias mediante acreditação.',
        highlights: ['Contratos de curta e longa duração', 'Faturação em AOA, USD ou EUR', 'Conta-corrente a 30 dias', 'Portal do cliente com faturas e comprovativos'],
        sections: [
          { title: 'Quem confia na PEPEK', body: 'Embaixadas, entidades do Governo angolano, organismos internacionais como o PNUD e empresas como a Bestfly e a DP World confiam a sua mobilidade à PEPEK GRUPO, em sectores onde segurança, discrição e pontualidade são o padrão.' },
          { title: 'Faturação e pagamentos', body: 'Faturas em moeda nacional ou estrangeira, comprovativos disponibilizados após confirmação da liquidação e pagamento por Multicaixa Express, cartão, transferência bancária ou MB WAY. Clientes acreditados beneficiam de conta-corrente a 30 dias.' },
          { title: 'Gestão de frota e motoristas', body: 'Viaturas de substituição da mesma categoria ou superior, motoristas dedicados, gestor de conta disponível 24/7 e acompanhamento das deslocações da sua equipa em Luanda e nas províncias.' },
        ],
        fleetTitle: 'Viaturas mais pedidas por empresas',
        faq: [
          { q: 'Fazem contratos de aluguer de longa duração para empresas?', a: 'Sim. Propomos contratos à medida, com viaturas e motoristas dedicados e condições ajustadas ao volume e à duração.' },
          { q: 'Em que moedas posso ser faturado?', a: 'Em AOA, USD ou EUR, conforme a fatura. Clientes acreditados podem trabalhar em conta-corrente com pagamento a 30 dias.' },
          { q: 'Têm experiência com embaixadas e governo?', a: 'Sim. Servimos corpos diplomáticos, entidades do Estado e organismos internacionais em Angola.' },
        ],
      },
      en: {
        metaTitle: 'Corporate Car Rental in Angola | Contracts & 30-Day Invoicing | PEPEK',
        metaDescription: 'Vehicle rental for companies, embassies and government in Angola: long-term contracts, invoicing in AOA, USD or EUR, 30-day credit accounts and a client portal.',
        eyebrow: 'Corporate solutions',
        h1: 'Car rental for companies, embassies and institutions in Angola',
        lead: 'Tailored mobility contracts for companies and institutions: dedicated vehicles and drivers, invoicing in AOA, USD or EUR, and 30-day credit accounts subject to accreditation.',
        highlights: ['Short and long-term contracts', 'Invoicing in AOA, USD or EUR', '30-day credit accounts', 'Client portal with invoices and receipts'],
        sections: [
          { title: 'Who trusts PEPEK', body: 'Embassies, Angolan government bodies, international organisations such as UNDP and companies such as Bestfly and DP World trust PEPEK GRUPO with their mobility, in sectors where security, discretion and punctuality are the standard.' },
          { title: 'Invoicing and payments', body: 'Invoices in local or foreign currency, receipts issued once payment is confirmed, and payment by Multicaixa Express, card, bank transfer or MB WAY. Accredited clients get 30-day credit accounts.' },
          { title: 'Fleet and driver management', body: 'Replacement vehicles of the same or higher category, dedicated drivers, a 24/7 account manager and support for your team’s travel in Luanda and the provinces.' },
        ],
        fleetTitle: 'Vehicles most requested by companies',
        faq: [
          { q: 'Do you offer long-term rental contracts for companies?', a: 'Yes. We propose tailored contracts with dedicated vehicles and drivers, adjusted to volume and duration.' },
          { q: 'Which currencies can I be invoiced in?', a: 'AOA, USD or EUR, depending on the invoice. Accredited clients can use a 30-day credit account.' },
          { q: 'Do you work with embassies and government?', a: 'Yes. We serve diplomatic missions, government bodies and international organisations in Angola.' },
        ],
      },
      fr: {
        metaTitle: 'Location de voitures pour entreprises en Angola | Facturation à 30 jours',
        metaDescription: 'Location de véhicules pour entreprises, ambassades et institutions en Angola : contrats longue durée, facturation en AOA, USD ou EUR, compte à 30 jours.',
        eyebrow: 'Solutions entreprises',
        h1: 'Location de voitures pour entreprises, ambassades et institutions en Angola',
        lead: 'Contrats de mobilité sur mesure : véhicules et chauffeurs dédiés, facturation en AOA, USD ou EUR et compte courant à 30 jours après accréditation.',
        highlights: ['Contrats courte et longue durée', 'Facturation en AOA, USD ou EUR', 'Compte courant à 30 jours', 'Portail client avec factures et reçus'],
        sections: [
          { title: 'Ils font confiance à PEPEK', body: 'Ambassades, institutions du gouvernement angolais, organisations internationales comme le PNUD et entreprises comme Bestfly et DP World confient leur mobilité à PEPEK GRUPO.' },
          { title: 'Facturation et paiements', body: 'Factures en monnaie locale ou étrangère, reçus après confirmation du paiement, paiement par Multicaixa Express, carte, virement ou MB WAY.' },
          { title: 'Gestion de flotte et chauffeurs', body: 'Véhicules de remplacement, chauffeurs dédiés et gestionnaire de compte disponible 24h/24.' },
        ],
        fleetTitle: 'Véhicules les plus demandés par les entreprises',
        faq: [
          { q: 'Proposez-vous des contrats longue durée ?', a: 'Oui, sur mesure, avec véhicules et chauffeurs dédiés.' },
          { q: 'Dans quelles devises puis-je être facturé ?', a: 'En AOA, USD ou EUR. Les clients accrédités peuvent bénéficier d’un compte à 30 jours.' },
          { q: 'Travaillez-vous avec des ambassades ?', a: 'Oui, nous servons corps diplomatiques, institutions publiques et organisations internationales.' },
        ],
      },
    },
  },
];

export const LANDING_LABELS: Record<LandingLang, {
  from: string; perDay: string; perTransfer: string; book: string; whatsapp: string;
  faqTitle: string; relatedTitle: string; viewFleet: string; popularSearches: string; seats: string;
}> = {
  pt: { from: 'desde', perDay: '/dia', perTransfer: '/transfer', book: 'Reservar agora', whatsapp: 'Pedir pelo WhatsApp', faqTitle: 'Perguntas frequentes', relatedTitle: 'Serviços relacionados', viewFleet: 'Ver toda a frota', popularSearches: 'Serviços mais procurados', seats: 'lugares' },
  en: { from: 'from', perDay: '/day', perTransfer: '/transfer', book: 'Book now', whatsapp: 'Request on WhatsApp', faqTitle: 'Frequently asked questions', relatedTitle: 'Related services', viewFleet: 'View the full fleet', popularSearches: 'Popular services', seats: 'seats' },
  fr: { from: 'dès', perDay: '/jour', perTransfer: '/transfert', book: 'Réserver', whatsapp: 'Demander sur WhatsApp', faqTitle: 'Questions fréquentes', relatedTitle: 'Services associés', viewFleet: 'Voir toute la flotte', popularSearches: 'Services les plus demandés', seats: 'places' },
};

export const toLandingLang = (language?: string): LandingLang => {
  const code = (language ?? 'pt').slice(0, 2);
  return code === 'en' || code === 'fr' ? code : 'pt';
};

export const findLandingPage = (slug: string) => LANDING_PAGES.find((page) => page.slug === slug);
