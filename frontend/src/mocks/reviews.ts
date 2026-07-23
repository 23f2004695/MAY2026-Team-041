export const featuredBook = {
  id: 'atomic-habits',
  title: 'Atomic Habits',
  author: 'James Clear',
  averageRating: 4.6,
  totalReviews: 42,
};

export const ratingBreakdown = [
  { stars: 5, percent: 68 },
  { stars: 4, percent: 22 },
  { stars: 3, percent: 7 },
  { stars: 2, percent: 2 },
  { stars: 1, percent: 1 },
];

export interface BookReview {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
  /** True when the signed-in member authored this review, enabling edit. */
  isOwn?: boolean;
  /** Set on cross-book review lists (see `allReviews`) — omitted for single-book lists. */
  bookTitle?: string;
}

export const bookReviews: BookReview[] = [
  {
    id: 'rev1',
    reviewer: 'Rahul Nair',
    rating: 5,
    comment: 'Changed how I think about building routines. Recommended it to my whole book club.',
    date: 'Jun 2, 2026',
  },
  {
    id: 'rev2',
    reviewer: 'Neha Kapoor',
    rating: 4,
    comment: 'Practical and easy to read, though some ideas felt repeated from other habit books.',
    date: 'May 24, 2026',
  },
  {
    id: 'rev3',
    reviewer: 'Rohan Verma',
    rating: 5,
    comment: 'The 1% better every day framing finally made habit-building click for me.',
    date: 'May 10, 2026',
  },
  {
    id: 'rev4',
    reviewer: 'Arjun Mehta',
    rating: 4,
    comment: 'Solid, actionable advice. The identity-based habits chapter was my favorite.',
    date: 'Apr 29, 2026',
  },
];

// Reviews across the whole catalog, for the admin moderation view — bookReviews above stays
// scoped to the single featured-book page members see.
export const allReviews: BookReview[] = [
  ...bookReviews.map((review) => ({ ...review, bookTitle: 'Atomic Habits' })),
  {
    id: 'rev5',
    reviewer: 'Priya Sharma',
    rating: 5,
    comment: 'The idea that every regret is its own parallel life hit different.',
    date: 'Jun 8, 2026',
    bookTitle: 'The Midnight Library',
  },
  {
    id: 'rev6',
    reviewer: 'Simran Kaur',
    rating: 5,
    comment: 'The chapter on shared myths completely reframed how I think about society.',
    date: 'Jun 1, 2026',
    bookTitle: 'Sapiens',
  },
  {
    id: 'rev7',
    reviewer: 'Karan Malhotra',
    rating: 3,
    comment: 'Interesting premise but the pacing dragged in the middle third.',
    date: 'May 20, 2026',
    bookTitle: 'Project Hail Mary',
  },
];
