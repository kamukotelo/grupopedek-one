/**
 * URL da página SEO de cada viatura (/aluguer/<nome-da-viatura>), a partir do
 * nome comercial ("Toyota Land Cruiser 250" → /aluguer/toyota-land-cruiser-250).
 * Ficheiro sem dependências para poder ser usado nos cartões da frota sem
 * arrastar dados extra para o bundle.
 */
export const VEHICLE_PAGE_BASE = '/aluguer';

export const vehicleSlug = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const vehiclePagePath = (vehicle: { name: string }) => `${VEHICLE_PAGE_BASE}/${vehicleSlug(vehicle.name)}`;
