export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  badges: number;
  hoursRead: number;
  isCurrentUser?: boolean;
}

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Amara Okafor', points: 2840, badges: 9, hoursRead: 312 },
  { rank: 2, name: 'Daniel Cho', points: 2615, badges: 8, hoursRead: 289 },
  { rank: 3, name: 'Liam Fitzgerald', points: 2400, badges: 7, hoursRead: 260 },
  { rank: 4, name: 'Priya Sharma', points: 1280, badges: 5, hoursRead: 210, isCurrentUser: true },
  { rank: 5, name: 'Sofia Ramirez', points: 1190, badges: 4, hoursRead: 198 },
  { rank: 6, name: 'Noah Bennett', points: 1042, badges: 4, hoursRead: 176 },
  { rank: 7, name: 'Wei Zhang', points: 980, badges: 3, hoursRead: 162 },
];
