import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { AdminLayout } from '@/app/layouts/AdminLayout';
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { UserLayout } from '@/app/layouts/UserLayout';
import { ROUTES } from '@/constants/routes';
import { Login } from '@/pages/Login';
import { NotFound } from '@/pages/NotFound';
import { PlaceholderPage } from '@/pages/PlaceholderPage';

import { ProtectedRoute, PublicRoute, RoleRoute } from './guards';

// react-router children paths are relative to their (pathless) layout parent.
const relative = (path: string) => path.slice(1);

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <PlaceholderPage
            title="Community Reading Club & Library Management Platform"
            description="Digitize your library, join reading clubs, and get AI-powered book recommendations."
          />
        ),
      },
      {
        element: (
          <PublicRoute>
            <Outlet />
          </PublicRoute>
        ),
        children: [
          { path: relative(ROUTES.LOGIN), element: <Login /> },
          {
            path: relative(ROUTES.REGISTER),
            element: <PlaceholderPage title="Register" description="Create a new account." />,
          },
          {
            path: relative(ROUTES.FORGOT_PASSWORD),
            element: <PlaceholderPage title="Forgot Password" description="Reset your password." />,
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
      {
        path: relative(ROUTES.DASHBOARD),
        element: (
          <PlaceholderPage title="Dashboard" description="Your reading activity at a glance." />
        ),
      },
      {
        path: relative(ROUTES.BOOKS),
        element: <PlaceholderPage title="Books" description="Browse the library catalog." />,
      },
      {
        path: relative(ROUTES.BOOK_DETAILS),
        element: <PlaceholderPage title="Book Details" description="Details for a single book." />,
      },
      {
        path: relative(ROUTES.RESERVATIONS),
        element: (
          <PlaceholderPage title="Reservations" description="Track your book reservations." />
        ),
      },
      {
        path: relative(ROUTES.SEAT_BOOKING),
        element: <PlaceholderPage title="Seat Booking" description="Reserve a study seat." />,
      },
      {
        path: relative(ROUTES.COMMUNITY),
        element: <PlaceholderPage title="Community" description="Reading clubs and discussions." />,
      },
      {
        path: relative(ROUTES.EVENTS),
        element: <PlaceholderPage title="Events" description="Upcoming library events." />,
      },
      {
        path: relative(ROUTES.NOTIFICATIONS),
        element: <PlaceholderPage title="Notifications" description="Your recent notifications." />,
      },
      {
        path: relative(ROUTES.PROFILE),
        element: <PlaceholderPage title="Profile" description="Manage your account details." />,
      },
      {
        path: relative(ROUTES.SETTINGS),
        element: <PlaceholderPage title="Settings" description="Manage your preferences." />,
      },
    ],
  },
  {
    element: (
      <RoleRoute allow={['admin']}>
        <AdminLayout />
      </RoleRoute>
    ),
    children: [
      {
        path: relative(ROUTES.ADMIN),
        element: <PlaceholderPage title="Admin" description="Platform administration." />,
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
