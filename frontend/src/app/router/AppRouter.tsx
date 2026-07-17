import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { AdminLayout } from '@/app/layouts/AdminLayout';
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { UserLayout } from '@/app/layouts/UserLayout';
import { ROUTES } from '@/constants/routes';
import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage';
import { BookDetailsPage } from '@/features/books/pages/BookDetailsPage';
import { BooksListPage } from '@/features/books/pages/BooksListPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { EventsPage } from '@/features/events/pages/EventsPage';
import { LandingPage } from '@/features/landing';
import { LeaderboardPage } from '@/features/leaderboard/pages/LeaderboardPage';
import { NotificationsPage } from '@/features/notifications/pages/NotificationsPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { ReadingProgressPage } from '@/features/reading-progress/pages/ReadingProgressPage';
import { ReservationsPage } from '@/features/reservations/pages/ReservationsPage';
import { ReviewsPage } from '@/features/reviews/pages/ReviewsPage';
import { SeatBookingPage } from '@/features/seat-booking/pages/SeatBookingPage';
import { Login } from '@/pages/Login';
import { NotFound } from '@/pages/NotFound';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { Register } from '@/pages/Register';

import { ProtectedRoute, PublicRoute, RoleRoute } from './guards';

// react-router children paths are relative to their (pathless) layout parent.
const relative = (path: string) => path.slice(1);

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      {
        element: (
          <PublicRoute>
            <Outlet />
          </PublicRoute>
        ),
        children: [
          { path: relative(ROUTES.LOGIN), element: <Login /> },
          { path: relative(ROUTES.REGISTER), element: <Register /> },
          {
            path: relative(ROUTES.FORGOT_PASSWORD),
            element: (
              <PlaceholderPage
                titleKey="placeholder.forgotPassword.title"
                descriptionKey="placeholder.forgotPassword.description"
              />
            ),
          },
        ],
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: relative(ROUTES.DASHBOARD), element: <DashboardPage /> },
      { path: relative(ROUTES.BOOKS), element: <BooksListPage /> },
      { path: relative(ROUTES.BOOK_DETAILS), element: <BookDetailsPage /> },
      { path: relative(ROUTES.RESERVATIONS), element: <ReservationsPage /> },
      { path: relative(ROUTES.SEAT_BOOKING), element: <SeatBookingPage /> },
      {
        path: relative(ROUTES.COMMUNITY),
        element: (
          <PlaceholderPage titleKey="nav.community" descriptionKey="placeholder.community.description" />
        ),
      },
      { path: relative(ROUTES.EVENTS), element: <EventsPage /> },
      { path: relative(ROUTES.NOTIFICATIONS), element: <NotificationsPage /> },
      { path: relative(ROUTES.PROFILE), element: <ProfilePage /> },
      { path: relative(ROUTES.READING_PROGRESS), element: <ReadingProgressPage /> },
      { path: relative(ROUTES.LEADERBOARD), element: <LeaderboardPage /> },
      { path: relative(ROUTES.REVIEWS), element: <ReviewsPage /> },
      {
        path: relative(ROUTES.SETTINGS),
        element: (
          <PlaceholderPage titleKey="nav.settings" descriptionKey="placeholder.settings.description" />
        ),
      },
    ],
  },
  {
    element: (
      <RoleRoute allow={['admin']}>
        <AdminLayout />
      </RoleRoute>
    ),
    children: [{ path: relative(ROUTES.ADMIN), element: <AdminDashboardPage /> }],
  },
  { path: '*', element: <NotFound /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
