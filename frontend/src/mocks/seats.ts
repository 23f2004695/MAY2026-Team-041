import type { SeatStatus } from '@/components/common';

export interface Seat {
  id: string;
  status: SeatStatus;
}

const rows = ['A', 'B', 'C', 'D'];
const seatsPerRow = 8;
const occupiedIds = new Set(['A3', 'A4', 'B1', 'C6', 'C7', 'D2', 'D5', 'D8']);
const reservedIds = new Set(['A7', 'B4', 'B5', 'C2', 'D1']);

export const seats: Seat[] = rows.flatMap((row) =>
  Array.from({ length: seatsPerRow }, (_, index) => {
    const id = `${row}${index + 1}`;
    const status: SeatStatus = occupiedIds.has(id)
      ? 'occupied'
      : reservedIds.has(id)
        ? 'reserved'
        : 'available';
    return { id, status };
  }),
);
