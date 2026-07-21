import type { SeatStatus } from '@/components/common';

export interface Seat {
  id: string;
  status: SeatStatus;
  /** Only set for occupied/reserved seats — the clock time they free up. */
  availableAt?: string;
  /** Only set for occupied/reserved seats — minutes from now until free. */
  availableInMinutes?: number;
}

const rows = ['A', 'B', 'C', 'D'];
const seatsPerRow = 8;
// Occupied/reserved seats each carry the time they free up, so the booking
// summary can tell the member exactly when the seat becomes available
// instead of just blocking selection.
const occupiedIds = new Map<string, { availableAt: string; availableInMinutes: number }>([
  ['A3', { availableAt: '11:15 AM', availableInMinutes: 10 }],
  ['A4', { availableAt: '12:30 PM', availableInMinutes: 45 }],
  ['B1', { availableAt: '1:00 PM', availableInMinutes: 30 }],
  ['C6', { availableAt: '2:30 PM', availableInMinutes: 90 }],
  ['C7', { availableAt: '11:05 AM', availableInMinutes: 10 }],
  ['D2', { availableAt: '12:00 PM', availableInMinutes: 30 }],
  ['D5', { availableAt: '3:00 PM', availableInMinutes: 120 }],
  ['D8', { availableAt: '11:45 AM', availableInMinutes: 30 }],
]);
const reservedIds = new Map<string, { availableAt: string; availableInMinutes: number }>([
  ['A7', { availableAt: '4:00 PM', availableInMinutes: 180 }],
  ['B4', { availableAt: '11:10 AM', availableInMinutes: 10 }],
  ['B5', { availableAt: '1:30 PM', availableInMinutes: 60 }],
  ['C2', { availableAt: '11:40 AM', availableInMinutes: 30 }],
  ['D1', { availableAt: '5:00 PM', availableInMinutes: 240 }],
]);

export const seats: Seat[] = rows.flatMap((row) =>
  Array.from({ length: seatsPerRow }, (_, index) => {
    const id = `${row}${index + 1}`;
    const occupiedInfo = occupiedIds.get(id);
    if (occupiedInfo) {
      return { id, status: 'occupied' as SeatStatus, ...occupiedInfo };
    }
    const reservedInfo = reservedIds.get(id);
    if (reservedInfo) {
      return { id, status: 'reserved' as SeatStatus, ...reservedInfo };
    }
    return { id, status: 'available' as SeatStatus };
  }),
);
