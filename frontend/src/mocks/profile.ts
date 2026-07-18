export const profileOverview = {
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  joinDate: 'March 2023',
  membershipPlanKey: 'premium',
  role: 'member' as const,
};

export const readingStats = {
  booksRead: 34,
  pagesRead: 9_820,
  hoursRead: 210,
};

export interface ProfileAchievement {
  id: string;
  labelKey: string;
  descriptionKey: string;
}

export const profileAchievements: ProfileAchievement[] = [
  {
    id: 'first-book',
    labelKey: 'profile.achievements.items.firstBook.label',
    descriptionKey: 'profile.achievements.items.firstBook.description',
  },
  {
    id: 'book-worm',
    labelKey: 'profile.achievements.items.bookWorm.label',
    descriptionKey: 'profile.achievements.items.bookWorm.description',
  },
  {
    id: 'top-reader',
    labelKey: 'profile.achievements.items.topReader.label',
    descriptionKey: 'profile.achievements.items.topReader.description',
  },
];

export interface CurrentReadingItem {
  title: string;
  author: string;
  percentComplete: number;
}

export const currentReading: CurrentReadingItem[] = [
  { title: 'Atomic Habits', author: 'James Clear', percentComplete: 62 },
  { title: 'Sapiens', author: 'Yuval Noah Harari', percentComplete: 28 },
];

export interface BorrowHistoryEntry {
  title: string;
  borrowedOn: string;
  returnedOn: string;
}

export const borrowHistory: BorrowHistoryEntry[] = [
  {
    title: 'The Hundred-Page Machine Learning Book',
    borrowedOn: 'May 2, 2026',
    returnedOn: 'May 20, 2026',
  },
  { title: 'Deep Work', borrowedOn: 'Apr 10, 2026', returnedOn: 'Apr 28, 2026' },
  { title: 'Norwegian Wood', borrowedOn: 'Mar 5, 2026', returnedOn: 'Mar 22, 2026' },
  {
    title: 'A Short History of Nearly Everything',
    borrowedOn: 'Feb 1, 2026',
    returnedOn: 'Feb 19, 2026',
  },
];
