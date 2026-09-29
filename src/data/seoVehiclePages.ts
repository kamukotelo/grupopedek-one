import { PUBLIC_FLEET } from './fleetFlyer2026';
import { vehiclePagePath, vehicleSlug } from '../lib/vehicleSlug';

/**
 * Uma página por viatura do catálogo oficial ("aluguer Toyota Prado Luanda",
 * "rent Land Cruiser Angola", …). Todo o conteúdo vem de PUBLIC_FLEET: ao
 * mudar a frota, as páginas, o sitemap e a pré-renderização acompanham.
 */
export const VEHICLE_PAGES = PUBLIC_FLEET.map((vehicle) => ({ slug: vehicleSlug(vehicle.name), path: vehiclePagePath(vehicle), vehicle }));

const duplicated = VEHICLE_PAGES.filter((page, index) => VEHICLE_PAGES.findIndex((other) => other.slug === page.slug) !== index);
if (duplicated.length) throw new Error(`Viaturas com o mesmo URL: ${duplicated.map((page) => page.slug).join(', ')}`);

export const findVehiclePage = (slug: string | undefined) => VEHICLE_PAGES.find((page) => page.slug === slug);

type Lang = 'pt' | 'en' | 'fr';

export interface VehicleCopyInput {
  name: string;
  city: string;
  price: string;
  transfer: string;
  seats: number;
}

export const VEHICLE_COPY: Record<Lang, {
  metaTitle: (v: VehicleCopyInput) => string;
  metaDescription: (v: VehicleCopyInput & { specs: string }) => string;
  h1: (v: VehicleCopyInput) => string;
  eyebrow: string;
  fleet: string;
  specsTitle: string;
  pricesTitle: string;
  perDay: string;
  transferLabel: string;
  transferNote: string;
  featuresTitle: string;
  inclusionsTitle: string;
  recommendedTitle: string;
  similarTitle: string;
  seats: string;
  doors: string;
  luggage: string;
  transmission: string;
  fuel: string;
  traction: string;
  engine: string;
  faq: (v: VehicleCopyInput) => { q: string; a: string }[];
}> = {
  pt: {
    metaTitle: ({ name, price }) => `Aluguer ${name} em Luanda desde ${price}/dia | PEPEK`,
    metaDescription: ({ name, specs, price }) => `Alugue ${name} em Luanda e em Angola: ${specs}. Desde ${price}/dia, com ou sem motorista, transfers e apoio 24/7. Reserve online ou pelo WhatsApp.`,
    h1: ({ name }) => `Aluguer de ${name} em Luanda e Angola`,
    eyebrow: 'Catálogo oficial 2026',
    fleet: 'Frota',
    specsTitle: 'Especificações',
    pricesTitle: 'Preços',
    perDay: 'Diária',
    transferLabel: 'Transfer',
    transferNote: 'Preços do catálogo oficial 2026. Viagens para fora de Luanda têm taxa de deslocação tabelada por província.',
    featuresTitle: 'Equipamento',
    inclusionsTitle: 'Incluído no aluguer',
    recommendedTitle: 'Recomendado para',
    similarTitle: 'Viaturas semelhantes',
    seats: 'Lugares',
    doors: 'Portas',
    luggage: 'Malas',
    transmission: 'Caixa',
    fuel: 'Combustível',
    traction: 'Tracção',
    engine: 'Motor',
    faq: ({ name, price, transfer, seats }) => [
      { q: `Quanto custa alugar um ${name} em Luanda?`, a: `A diária do ${name} é de ${price} e o serviço de transfer custa ${transfer}, segundo o catálogo oficial 2026 da PEPEK.` },
      { q: `Posso alugar o ${name} com motorista?`, a: `Sim. O ${name} pode ser contratado em livre condução ou com motorista profissional fardado, formado em condução defensiva e protocolo executivo.` },
      { q: `Quantas pessoas leva o ${name}?`, a: `O ${name} tem ${seats} lugares.` },
      { q: 'Que documentos preciso para alugar em livre condução?', a: 'Bilhete de Identidade ou Passaporte válido, Carta de Condução com mais de 2 anos, comprovativo de morada ou estadia em Angola e caução por cartão ou transferência.' },
    ],
  },
  en: {
    metaTitle: ({ name, price }) => `${name} Rental in Luanda from ${price}/day | PEPEK Angola`,
    metaDescription: ({ name, specs, price }) => `Rent a ${name} in Luanda and across Angola: ${specs}. From ${price}/day, self-drive or with driver, transfers and 24/7 support. Book online or on WhatsApp.`,
    h1: ({ name }) => `${name} rental in Luanda and Angola`,
    eyebrow: 'Official 2026 catalogue',
    fleet: 'Fleet',
    specsTitle: 'Specifications',
    pricesTitle: 'Prices',
    perDay: 'Daily rate',
    transferLabel: 'Transfer',
    transferNote: 'Prices from the official 2026 catalogue. Trips outside Luanda carry a fixed provincial travel fee.',
    featuresTitle: 'Equipment',
    inclusionsTitle: 'Included in the rental',
    recommendedTitle: 'Recommended for',
    similarTitle: 'Similar vehicles',
    seats: 'Seats',
    doors: 'Doors',
    luggage: 'Bags',
    transmission: 'Gearbox',
    fuel: 'Fuel',
    traction: 'Drive',
    engine: 'Engine',
    faq: ({ name, price, transfer, seats }) => [
      { q: `How much does it cost to rent a ${name} in Luanda?`, a: `The ${name} daily rate is ${price} and a transfer costs ${transfer}, according to PEPEK’s official 2026 catalogue.` },
      { q: `Can I rent the ${name} with a driver?`, a: `Yes. The ${name} is available self-drive or with a uniformed professional driver trained in defensive driving and executive protocol.` },
      { q: `How many people does the ${name} seat?`, a: `The ${name} has ${seats} seats.` },
      { q: 'What documents do I need for self-drive?', a: 'A valid ID card or passport, a driving licence held for more than 2 years, proof of address or stay in Angola, and a deposit by card or bank transfer.' },
    ],
  },
  fr: {
    metaTitle: ({ name, price }) => `Location ${name} à Luanda dès ${price}/jour | PEPEK`,
    metaDescription: ({ name, specs, price }) => `Louez ${name} à Luanda et en Angola : ${specs}. Dès ${price}/jour, avec ou sans chauffeur, transferts et assistance 24h/24.`,
    h1: ({ name }) => `Location ${name} à Luanda et en Angola`,
    eyebrow: 'Catalogue officiel 2026',
    fleet: 'Flotte',
    specsTitle: 'Caractéristiques',
    pricesTitle: 'Tarifs',
    perDay: 'Tarif journalier',
    transferLabel: 'Transfert',
    transferNote: 'Tarifs du catalogue officiel 2026. Les trajets hors de Luanda ont un forfait de déplacement par province.',
    featuresTitle: 'Équipement',
    inclusionsTitle: 'Inclus dans la location',
    recommendedTitle: 'Recommandé pour',
    similarTitle: 'Véhicules similaires',
    seats: 'Places',
    doors: 'Portes',
    luggage: 'Bagages',
    transmission: 'Boîte',
    fuel: 'Carburant',
    traction: 'Transmission',
    engine: 'Moteur',
    faq: ({ name, price, transfer, seats }) => [
      { q: `Combien coûte la location d’un ${name} à Luanda ?`, a: `Le tarif journalier du ${name} est de ${price} et le transfert coûte ${transfer}, selon le catalogue officiel 2026.` },
      { q: `Puis-je louer le ${name} avec chauffeur ?`, a: `Oui, sans chauffeur ou avec un chauffeur professionnel en uniforme.` },
      { q: `Combien de places a le ${name} ?`, a: `Le ${name} a ${seats} places.` },
      { q: 'Quels documents pour louer sans chauffeur ?', a: 'Pièce d’identité ou passeport, permis de plus de 2 ans, justificatif d’adresse ou de séjour en Angola et caution par carte ou virement.' },
    ],
  },
};
