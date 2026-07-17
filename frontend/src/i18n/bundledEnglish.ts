// English is the source of truth and fallback, so it is bundled eagerly (never
// lazy-loaded). The other 16 languages are code-split via resourcesToBackend.

import admin from './locales/en/admin.json';
import auth from './locales/en/auth.json';
import books from './locales/en/books.json';
import common from './locales/en/common.json';
import dashboard from './locales/en/dashboard.json';
import events from './locales/en/events.json';
import landing from './locales/en/landing.json';
import leaderboard from './locales/en/leaderboard.json';
import notifications from './locales/en/notifications.json';
import profile from './locales/en/profile.json';
import progress from './locales/en/progress.json';
import reservations from './locales/en/reservations.json';
import reviews from './locales/en/reviews.json';
import seats from './locales/en/seats.json';

export const en = {
  common,
  landing,
  auth,
  dashboard,
  books,
  reservations,
  seats,
  events,
  reviews,
  progress,
  leaderboard,
  notifications,
  profile,
  admin,
};
