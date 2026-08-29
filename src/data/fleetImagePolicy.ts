// Auditoria visual de 24/08/2026: estes IDs tinham fotografias locais que não
// correspondiam inequivocamente ao modelo anunciado.
// 30/08/2026: todos receberam a fotografia oficial dedicada da colecção
// "Carros PNG" (/fleet-flyer-2026/<pasta>/01-oficial.webp) — quarentena limpa.
const LOCAL_IMAGE_REVIEW_IDS = new Set<string>([]);

export const isFleetLocalImageApproved = (vehicleId: string): boolean =>
  !LOCAL_IMAGE_REVIEW_IDS.has(vehicleId);

export const FLEET_IMAGE_REVIEW_PLACEHOLDER = '/studio/fleet-showroom-background-v2.png';
