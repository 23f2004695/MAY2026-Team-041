export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  available: boolean;
  rating: number;
  description: string;
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
    description: 'A practical guide to building good habits and breaking bad ones.',
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
    description: 'A brief history of humankind, from the Stone Age to the present.',
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
    description:
      'An intricate novel connecting nine Americans through their relationship with trees.',
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
    description: 'A practical guide to machine learning with Scikit-Learn, Keras, and TensorFlow.',
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
    description: 'An accessible journey through the history of science.',
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
    description:
      "David Goggins' account of overcoming a difficult childhood to become a top athlete.",
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
    description: 'Rules for focused success in a distracted world.',
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
    description: 'A concise introduction to the core ideas of machine learning.',
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
    description: 'A nostalgic story of loss and burgeoning sexuality in 1960s Tokyo.',
    totalCopies: 3,
    availableCopies: 1,
  },
];
