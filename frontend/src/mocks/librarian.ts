import { AlertTriangle, BookCopy, IndianRupee, Ticket, type LucideIcon } from 'lucide-react';

export interface LibrarianStat {
  icon: LucideIcon;
  label: string;
  value: string;
}

export const librarianStats: LibrarianStat[] = [
  { icon: BookCopy, label: 'Books Borrowed Today', value: '6' },
  { icon: AlertTriangle, label: 'Overdue Books', value: '5' },
  { icon: Ticket, label: 'Pending Reservations', value: '4' },
  { icon: IndianRupee, label: 'Fines Collected (MTD)', value: '₹640' },
];

export interface OverdueLoan {
  id: string;
  bookTitle: string;
  borrower: string;
  dueDate: string;
  daysOverdue: number;
  fineAccrued: string;
}

export const overdueLoans: OverdueLoan[] = [
  {
    id: 'ol1',
    bookTitle: 'The Overstory',
    borrower: 'Arjun Mehta',
    dueDate: 'Jul 2, 2026',
    daysOverdue: 7,
    fineAccrued: '₹35',
  },
  {
    id: 'ol2',
    bookTitle: 'Sapiens',
    borrower: 'Rohan Verma',
    dueDate: 'Jul 5, 2026',
    daysOverdue: 4,
    fineAccrued: '₹20',
  },
  {
    id: 'ol3',
    bookTitle: "Can't Hurt Me",
    borrower: 'Priya Sharma',
    dueDate: 'Jul 7, 2026',
    daysOverdue: 2,
    fineAccrued: '₹10',
  },
];

export interface QueuedReservation {
  id: string;
  bookTitle: string;
  member: string;
  position: number;
  totalInQueue: number;
}

export const pendingReservationQueue: QueuedReservation[] = [
  { id: 'q1', bookTitle: "Can't Hurt Me", member: 'Rahul Nair', position: 1, totalInQueue: 5 },
  { id: 'q2', bookTitle: 'Project Hail Mary', member: 'Ananya Iyer', position: 1, totalInQueue: 3 },
  { id: 'q3', bookTitle: 'Atomic Habits', member: 'Karan Malhotra', position: 2, totalInQueue: 4 },
];
