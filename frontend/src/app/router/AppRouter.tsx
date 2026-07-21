import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { AdminLayout } from '@/app/layouts/AdminLayout';
import { GuardianLayout } from '@/app/layouts/GuardianLayout';
import { ITHeadLayout } from '@/app/layouts/ITHeadLayout';
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { UserLayout } from '@/app/layouts/UserLayout';
import { PageLoader } from '@/components/common';
import { ErrorState } from '@/components/feedback';
import { ROUTES } from '@/constants/routes';
import { NotFound } from '@/pages/NotFound';
import { PlaceholderPage } from '@/pages/PlaceholderPage';

import { ProtectedRoute, PublicRoute, RoleRoute } from './guards';

// react-router children paths are relative to their (pathless) layout parent.
const relative = (path: string) => path.slice(1);

// Wraps a lazily-loaded page element so its chunk can download without a blank
// screen; layouts and small static pages (NotFound, PlaceholderPage) stay eager.
function withSuspense(element: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

const LandingPage = lazy(() =>
  import('@/features/landing').then((m) => ({ default: m.LandingPage })),
);
const PricingPage = lazy(() =>
  import('@/features/pricing').then((m) => ({ default: m.PricingPage })),
);
const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('@/pages/Register').then((m) => ({ default: m.Register })));

const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const BooksListPage = lazy(() =>
  import('@/features/books/pages/BooksListPage').then((m) => ({ default: m.BooksListPage })),
);
const BookDetailsPage = lazy(() =>
  import('@/features/books/pages/BookDetailsPage').then((m) => ({ default: m.BookDetailsPage })),
);
const ReservationsPage = lazy(() =>
  import('@/features/reservations/pages/ReservationsPage').then((m) => ({
    default: m.ReservationsPage,
  })),
);
const SeatBookingPage = lazy(() =>
  import('@/features/seat-booking/pages/SeatBookingPage').then((m) => ({
    default: m.SeatBookingPage,
  })),
);
const PaymentPage = lazy(() =>
  import('@/features/payment/pages/PaymentPage').then((m) => ({ default: m.PaymentPage })),
);
const EventsPage = lazy(() =>
  import('@/features/events/pages/EventsPage').then((m) => ({ default: m.EventsPage })),
);
const CommunityPage = lazy(() =>
  import('@/features/community/pages/CommunityPage').then((m) => ({ default: m.CommunityPage })),
);
const SettingsPage = lazy(() =>
  import('@/features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const NotificationsPage = lazy(() =>
  import('@/features/notifications/pages/NotificationsPage').then((m) => ({
    default: m.NotificationsPage,
  })),
);
const ProfilePage = lazy(() =>
  import('@/features/profile/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const ReadingProgressPage = lazy(() =>
  import('@/features/reading-progress/pages/ReadingProgressPage').then((m) => ({
    default: m.ReadingProgressPage,
  })),
);
const LeaderboardPage = lazy(() =>
  import('@/features/leaderboard/pages/LeaderboardPage').then((m) => ({
    default: m.LeaderboardPage,
  })),
);
const ReviewsPage = lazy(() =>
  import('@/features/reviews/pages/ReviewsPage').then((m) => ({ default: m.ReviewsPage })),
);

const AdminDashboardPage = lazy(() =>
  import('@/features/admin/pages/AdminDashboardPage').then((m) => ({
    default: m.AdminDashboardPage,
  })),
);
const ITHeadDashboardPage = lazy(() =>
  import('@/features/it-head/pages/ITHeadDashboardPage').then((m) => ({
    default: m.ITHeadDashboardPage,
  })),
);
const GuardianDashboardPage = lazy(() =>
  import('@/features/guardian/pages/GuardianDashboardPage').then((m) => ({
    default: m.GuardianDashboardPage,
  })),
);

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <ErrorState />,
    children: [
      { index: true, element: withSuspense(<LandingPage />) },
      { path: relative(ROUTES.PRICING), element: withSuspense(<PricingPage />) },
      {
        element: (
          <PublicRoute>
            <Outlet />
          </PublicRoute>
        ),
        children: [
          { path: relative(ROUTES.LOGIN), element: withSuspense(<Login />) },
          { path: relative(ROUTES.REGISTER), element: withSuspense(<Register />) },
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
    errorElement: <ErrorState />,
    children: [
      { path: relative(ROUTES.DASHBOARD), element: withSuspense(<DashboardPage />) },
      { path: relative(ROUTES.BOOKS), element: withSuspense(<BooksListPage />) },
      { path: relative(ROUTES.BOOK_DETAILS), element: withSuspense(<BookDetailsPage />) },
      { path: relative(ROUTES.RESERVATIONS), element: withSuspense(<ReservationsPage />) },
      { path: relative(ROUTES.SEAT_BOOKING), element: withSuspense(<SeatBookingPage />) },
      { path: relative(ROUTES.PAYMENT), element: withSuspense(<PaymentPage />) },
      { path: relative(ROUTES.COMMUNITY), element: withSuspense(<CommunityPage />) },
      { path: relative(ROUTES.EVENTS), element: withSuspense(<EventsPage />) },
      { path: relative(ROUTES.NOTIFICATIONS), element: withSuspense(<NotificationsPage />) },
      { path: relative(ROUTES.PROFILE), element: withSuspense(<ProfilePage />) },
      { path: relative(ROUTES.READING_PROGRESS), element: withSuspense(<ReadingProgressPage />) },
      { path: relative(ROUTES.LEADERBOARD), element: withSuspense(<LeaderboardPage />) },
      { path: relative(ROUTES.REVIEWS), element: withSuspense(<ReviewsPage />) },
      { path: relative(ROUTES.SETTINGS), element: withSuspense(<SettingsPage />) },
    ],
  },
  {
    element: (
      <RoleRoute allow={['admin']}>
        <AdminLayout />
      </RoleRoute>
    ),
    errorElement: <ErrorState />,
    children: [{ path: relative(ROUTES.ADMIN), element: withSuspense(<AdminDashboardPage />) }],
  },
  {
    element: (
      <RoleRoute allow={['it-head']}>
        <ITHeadLayout />
      </RoleRoute>
    ),
    errorElement: <ErrorState />,
    children: [{ path: relative(ROUTES.IT_HEAD), element: withSuspense(<ITHeadDashboardPage />) }],
  },
  {
    element: (
      <RoleRoute allow={['guardian']}>
        <GuardianLayout />
      </RoleRoute>
    ),
    errorElement: <ErrorState />,
    children: [
      { path: relative(ROUTES.GUARDIAN), element: withSuspense(<GuardianDashboardPage />) },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
