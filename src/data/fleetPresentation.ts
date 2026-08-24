import type { VehicleDetail } from './fleetData';

export const FLEET_STUDIO_BACKGROUNDS = {
  default: '/studio/background-options/official-blue-premium.png',
  luxury: '/studio/background-options/official-blue-premium.png'
} as const;

export const getVehicleStudioBackground = (_vehicle: Pick<VehicleDetail, 'category'>): string =>
  FLEET_STUDIO_BACKGROUNDS.default;
