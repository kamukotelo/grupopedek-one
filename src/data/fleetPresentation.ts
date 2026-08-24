import type { VehicleDetail } from './fleetData';

export const FLEET_STUDIO_BACKGROUNDS = {
  default: '/studio/background-options/option-2-pearl-studio.png',
  luxury: '/studio/background-options/option-1-executive-dark.png'
} as const;

export const getVehicleStudioBackground = (vehicle: Pick<VehicleDetail, 'category'>): string =>
  vehicle.category === 'luxo' ? FLEET_STUDIO_BACKGROUNDS.luxury : FLEET_STUDIO_BACKGROUNDS.default;

