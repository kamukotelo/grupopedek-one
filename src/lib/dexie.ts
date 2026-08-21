import Dexie, { type Table } from 'dexie';
import { BookingData } from '../types';

export class PepekDatabase extends Dexie {
  bookings!: Table<BookingData, string>;
  offlineQueue!: Table<{ id: string; action: string; payload: unknown; timestamp: number }, string>;

  constructor() {
    super('PepekGrupoDB');
    this.version(1).stores({
      bookings: '++id, service, location, clientPhone, status, createdAt',
      offlineQueue: 'id, action, timestamp'
    });
  }
}

export const db = new PepekDatabase();
