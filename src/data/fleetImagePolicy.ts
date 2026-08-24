// Auditoria visual de 24/08/2026: estes IDs têm fotografias locais que não
// correspondem inequivocamente ao modelo anunciado. Permanecem bloqueadas até
// serem substituídas e aprovadas.
const LOCAL_IMAGE_REVIEW_IDS = new Set([
  'new-toyota-prado',
  'mercedes-benz-v300-class',
  'new-toyota-hiace',
  'hyundai-tucson',
  'chery-tiggo-7',
  'chery-tiggo-2',
  'toyota-lc-hz-18p',
  'limousine'
]);

export const isFleetLocalImageApproved = (vehicleId: string): boolean =>
  !LOCAL_IMAGE_REVIEW_IDS.has(vehicleId);

export const FLEET_IMAGE_REVIEW_PLACEHOLDER = '/studio/fleet-studio-background.png';
