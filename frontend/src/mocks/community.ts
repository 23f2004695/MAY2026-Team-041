export interface PostComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  replies?: PostComment[];
}

export interface CommunityPost {
  id: string;
  author: string;
  bookTitle?: string;
  content: string;
  images?: string[];
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
  isSaved: boolean;
  /** True when the signed-in member authored this post, enabling edit/delete. */
  isOwn?: boolean;
  comments: PostComment[];
}

export const communityPosts: CommunityPost[] = [
  {
    id: 'post1',
    author: 'Rahul Nair',
    bookTitle: 'Atomic Habits',
    content:
      "Just finished this one and I can't stop thinking about the 1% better every day idea. Anyone else building a new habit this month?",
    createdAt: '2h ago',
    likeCount: 12,
    isLiked: false,
    isSaved: false,
    comments: [
      {
        id: 'c1',
        author: 'Neha Kapoor',
        content: 'Same here! Trying to read 10 pages before bed every night.',
        createdAt: '1h ago',
      },
    ],
  },
  {
    id: 'post2',
    author: 'Priya Sharma',
    bookTitle: 'The Midnight Library',
    content:
      'The idea that every regret is its own parallel life hit different. Slow start but the last 100 pages made it worth it.',
    images: [],
    createdAt: '5h ago',
    likeCount: 8,
    isLiked: true,
    isSaved: true,
    isOwn: true,
    comments: [
      {
        id: 'c2',
        author: 'Arjun Mehta',
        content: 'Adding this to my list, thanks for the nudge!',
        createdAt: '4h ago',
        replies: [
          {
            id: 'c2r1',
            author: 'Priya Sharma',
            content: "You'll love the ending, let me know what you think!",
            createdAt: '4h ago',
          },
        ],
      },
      {
        id: 'c3',
        author: 'Rohan Verma',
        content: 'The library-between-lives concept still lives in my head rent-free.',
        createdAt: '3h ago',
      },
    ],
  },
  {
    id: 'post3',
    author: 'Ananya Iyer',
    content:
      'Not book-related, but does anyone want to start a monthly meetup here at the library to discuss what we\'re all reading?',
    createdAt: '1d ago',
    likeCount: 21,
    isLiked: false,
    isSaved: false,
    comments: [],
  },
  {
    id: 'post4',
    author: 'Simran Kaur',
    bookTitle: 'Sapiens',
    content:
      "The chapter on shared myths (money, nations, corporations) completely reframed how I think about society. Highly recommend for the reading challenge.",
    createdAt: '2d ago',
    likeCount: 34,
    isLiked: true,
    isSaved: false,
    comments: [
      {
        id: 'c4',
        author: 'Rahul Nair',
        content: 'One of my all-time favorites. The agricultural revolution chapter is wild too.',
        createdAt: '1d ago',
      },
    ],
  },
];
