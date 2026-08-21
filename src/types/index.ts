export type ServiceType = 'rent-a-car' | 'executive' | 'transfer' | 'corporate';

export type ProvinceLocation = 'Luanda' | 'Huambo' | 'Bengo' | 'Benguela' | 'Cabinda' | 'Outra Província';

export interface BookingData {
  id?: string;
  service: ServiceType;
  location: ProvinceLocation;
  destination?: string;
  startDate: string;
  endDate?: string;
  vehicleCategory?: string;
  withDriver: boolean;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  companyName?: string;
  flightNumber?: string;
  passengersCount?: number;
  notes?: string;
  status?: 'pending' | 'contacted' | 'confirmed' | 'cancelled';
  source?: string;
  createdAt?: string;
}

export interface VehicleCategory {
  id: string;
  name: string;
  subtitle: string;
  category: 'suv' | '4x4' | 'van' | 'protocol';
  description: string;
  passengers: number;
  luggage: number;
  transmission: string;
  traction: string;
  features: string[];
  image: string;
  badge?: string;
}

export interface InstitutionalClient {
  id: string;
  name: string;
  category: 'diplomatic' | 'state' | 'corporate' | 'ngo';
  description: string;
  acronym: string;
  logoSvg?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
