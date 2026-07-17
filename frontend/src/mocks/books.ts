export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  available: boolean;
  rating: number;
  totalCopies: number;
  availableCopies: number;
}

export const bookCategories = [
  'All',
  'Fiction',
  'Non-Fiction',
  'Science',
  'Technology',
  'Biography',
  'Self-Help',
] as const;

export const books: Book[] = [
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Help',
    available: true,
    rating: 4.8,
    totalCopies: 6,
    availableCopies: 2,
  },
  {
    id: 'sapiens',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'Non-Fiction',
    available: true,
    rating: 4.6,
    totalCopies: 4,
    availableCopies: 1,
  },
  {
    id: 'the-overstory',
    title: 'The Overstory',
    author: 'Richard Powers',
    category: 'Fiction',
    available: false,
    rating: 4.3,
    totalCopies: 3,
    availableCopies: 0,
  },
  {
    id: 'hands-on-ml',
    title: 'Hands-On Machine Learning',
    author: 'Aurélien Géron',
    category: 'Technology',
    available: true,
    rating: 4.7,
    totalCopies: 5,
    availableCopies: 3,
  },
  {
    id: 'a-short-history',
    title: 'A Short History of Nearly Everything',
    author: 'Bill Bryson',
    category: 'Science',
    available: true,
    rating: 4.5,
    totalCopies: 4,
    availableCopies: 4,
  },
  {
    id: 'cant-hurt-me',
    title: "Can't Hurt Me",
    author: 'David Goggins',
    category: 'Biography',
    available: false,
    rating: 4.7,
    totalCopies: 3,
    availableCopies: 0,
  },
  {
    id: 'deep-work',
    title: 'Deep Work',
    author: 'Cal Newport',
    category: 'Self-Help',
    available: true,
    rating: 4.4,
    totalCopies: 5,
    availableCopies: 2,
  },
  {
    id: 'the-hundred-page-ml',
    title: 'The Hundred-Page Machine Learning Book',
    author: 'Andriy Burkov',
    category: 'Technology',
    available: true,
    rating: 4.5,
    totalCopies: 2,
    availableCopies: 1,
  },
  {
    id: 'norwegian-wood',
    title: 'Norwegian Wood',
    author: 'Haruki Murakami',
    category: 'Fiction',
    available: true,
    rating: 4.2,
    totalCopies: 3,
    availableCopies: 1,
  },
];
