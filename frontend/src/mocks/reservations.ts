export type ReservationStatus = 'ready' | 'waiting' | 'expired';

export interface Reservation {
  id: string;
  bookTitle: string;
  reservedOn: string;
  status: ReservationStatus;
  queuePosition?: number;
}

export const currentReservations: Reservation[] = [
  { id: 'r1', bookTitle: 'The Overstory', reservedOn: 'Jun 20, 2026', status: 'ready' },
  {
    id: 'r2',
    bookTitle: "Can't Hurt Me",
    reservedOn: 'Jun 30, 2026',
    status: 'waiting',
    queuePosition: 2,
  },
  { id: 'r3', bookTitle: 'Project Hail Mary', reservedOn: 'May 15, 2026', status: 'expired' },
];

export interface ReservationQueueEntry {
  bookTitle: string;
  position: number;
  totalInQueue: number;
  estimatedWait: string;
}

export const reservationQueue: ReservationQueueEntry[] = [
  { bookTitle: "Can't Hurt Me", position: 2, totalInQueue: 5, estimatedWait: '~1 week' },
];
