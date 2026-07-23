import { BookOpen, IndianRupee, UserCheck, Users, type LucideIcon } from 'lucide-react';

import type { ProgressBook } from './reading-progress';

export interface GuardianStat {
  icon: LucideIcon;
  labelKey: string;
  value: string;
}

export const guardianStats: GuardianStat[] = [
  { icon: Users, labelKey: 'guardian.stats.linkedChildren', value: '2' },
  { icon: UserCheck, labelKey: 'guardian.stats.currentlyInLibrary', value: '1' },
  { icon: BookOpen, labelKey: 'guardian.stats.booksBorrowed', value: '3' },
  { icon: IndianRupee, labelKey: 'guardian.stats.totalDues', value: '₹40' },
];

export type ChildPresenceStatus = 'in-library' | 'left';

export interface Child {
  id: string;
  name: string;
  membershipId: string;
  presenceStatus: ChildPresenceStatus;
  presenceTime: string;
  subscriptionExpiresOn: string;
  outstandingFine: string;
  /** Only set when outstandingFine is non-zero — powers the fine details modal. */
  fineReasonKey?: string;
  fineBookTitle?: string;
  fineDueDate?: string;
  fineDailyPenalty?: string;
  fineEscalatedAmount?: string;
}

export const children: Child[] = [
  {
    id: 'c1',
    name: 'Aarav Sharma',
    membershipId: 'MEM-2041',
    presenceStatus: 'in-library',
    presenceTime: '10:15 AM',
    subscriptionExpiresOn: 'Jul 28, 2026',
    outstandingFine: '₹0',
  },
  {
    id: 'c2',
    name: 'Diya Sharma',
    membershipId: 'MEM-2042',
    presenceStatus: 'left',
    presenceTime: '4:40 PM',
    subscriptionExpiresOn: 'Aug 3, 2026',
    outstandingFine: '₹40',
    fineReasonKey: 'lateReturn',
    fineBookTitle: "Charlotte's Web",
    fineDueDate: 'Jul 19, 2026',
    fineDailyPenalty: '₹5',
    fineEscalatedAmount: '₹80',
  },
];

export interface ChildReadingProgress {
  childId: string;
  currentlyReading: ProgressBook[];
  completed: ProgressBook[];
}

export const childrenReadingProgress: ChildReadingProgress[] = [
  {
    childId: 'c1',
    currentlyReading: [
      {
        id: 'percy-jackson',
        title: 'Percy Jackson: The Lightning Thief',
        author: 'Rick Riordan',
        percentComplete: 45,
      },
      {
        id: 'wimpy-kid',
        title: 'Diary of a Wimpy Kid',
        author: 'Jeff Kinney',
        percentComplete: 80,
      },
    ],
    completed: [
      {
        id: 'sorcerers-stone',
        title: "Harry Potter and the Sorcerer's Stone",
        author: 'J.K. Rowling',
        percentComplete: 100,
      },
    ],
  },
  {
    childId: 'c2',
    currentlyReading: [
      {
        id: 'charlottes-web',
        title: "Charlotte's Web",
        author: 'E. B. White',
        percentComplete: 90,
      },
    ],
    completed: [
      { id: 'matilda', title: 'Matilda', author: 'Roald Dahl', percentComplete: 100 },
      {
        id: 'cat-in-the-hat',
        title: 'The Cat in the Hat',
        author: 'Dr. Seuss',
        percentComplete: 100,
      },
    ],
  },
];

export type BorrowedBookStatus = 'on-time' | 'due-soon' | 'overdue';

export interface ChildBorrowedBook {
  id: string;
  childId: string;
  title: string;
  author: string;
  dueDate: string;
  status: BorrowedBookStatus;
  fineAccrued?: string;
}

export const childBorrowedBooks: ChildBorrowedBook[] = [
  {
    id: 'cb1',
    childId: 'c1',
    title: 'Percy Jackson: The Lightning Thief',
    author: 'Rick Riordan',
    dueDate: 'Jul 22, 2026',
    status: 'due-soon',
  },
  {
    id: 'cb2',
    childId: 'c1',
    title: 'Diary of a Wimpy Kid',
    author: 'Jeff Kinney',
    dueDate: 'Jul 30, 2026',
    status: 'on-time',
  },
  {
    id: 'cb3',
    childId: 'c2',
    title: "Charlotte's Web",
    author: 'E. B. White',
    dueDate: 'Jul 12, 2026',
    status: 'overdue',
    fineAccrued: '₹40',
  },
];
