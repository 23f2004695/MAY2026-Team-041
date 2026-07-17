# Frontend — Community Reading Club & Library Management Platform

The React frontend for the Community Reading Club platform: browsing the catalogue,
borrowing/reserving books, booking study seats, joining events, tracking reading
progress, and role-specific dashboards for Members, Librarians, Managers, and Admins.

For the full product context (problem statement, architecture decisions, what's
mocked vs. real, presentation notes), see
[`../FRONTEND_WALKTHROUGH.txt`](../FRONTEND_WALKTHROUGH.txt) and
[`../PROJECT_SPECIFICATION.md`](../PROJECT_SPECIFICATION.md). This file only covers
running and developing the frontend itself.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router v7 (routing + role-based route guards)
- TanStack Query (wired up, not yet used for real fetching — see "Current Status")
- React Hook Form + Zod (forms/validation)
- Framer Motion (landing page animations)
- Sonner (toasts)
- Vitest + Testing Library (unit tests), Playwright (e2e, configured at the repo root)

## Current Status

Every screen is built and fully interactive against **mock data** (`src/mocks/*.ts`),
not a real backend yet — that's Milestone 3. Auth is also mocked: the Login page is a
role picker (Member / Librarian / Manager / Admin) that sets a fake signed-in state,
which is enough to exercise real route guards and role-specific UI end-to-end. See
`FRONTEND_WALKTHROUGH.txt` for the reasoning behind this approach.

## Prerequisites

- Node.js 20+
- npm

## Setup

From this `frontend/` directory:

```bash
cp .env.example .env
npm install
```

`.env` only needs `VITE_API_URL` (the backend base URL — unused by the app until
Milestone 3 wires up real API calls).

## Development

```bash
npm run dev
```

Opens the app at http://localhost:5173 with hot module reload.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) then production-build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier (writes changes) |
| `npm test` | Run Vitest unit tests |

End-to-end tests (Playwright) live in `tests/e2e/` but are run from the **repo root**
(`npm run test:e2e` there), since the Playwright config also manages starting the dev
server.

## Project Structure

```text
src/
├── main.tsx                 # Entry point — renders <AppProviders><AppRouter />
├── app/
│   ├── router/               # AppRouter (route tree) + guards.tsx (Protected/Public/RoleRoute)
│   └── layouts/               # PublicLayout, UserLayout, AdminLayout, AppShellLayout
├── providers/                # QueryClientProvider, ThemeProvider, AuthProvider (mocked)
├── components/
│   ├── ui/                    # Shared primitives: Button, Card, Input, Modal, Table, ...
│   ├── layout/                 # Navbar, Sidebar, TopBar, Footer, UserMenu, ThemeToggle
│   └── common/                 # Cross-feature cards: BookCard, EventCard, StatisticCard, ...
├── features/                 # One folder per screen — each owns its pages/ and components/
│   ├── landing/                # Marketing site (Hero, AI Librarian preview, FAQ, ...)
│   ├── dashboard/               # Role-aware: Member/Librarian/Manager dashboards
│   ├── admin/                   # Admin dashboard (roles, audit log, reports)
│   ├── books/ | reservations/ | seat-booking/ | events/ | reviews/
│   ├── leaderboard/ | notifications/ | profile/ | reading-progress/
├── mocks/                    # Mock data per feature, shaped like the future real API
├── pages/                    # Login, NotFound, PlaceholderPage (Register/Settings/etc.)
├── constants/                # ROUTES, navigation items
├── lib/                      # cn() helper, comingSoonToast, useLocalStorageState
├── styles.css                # Theme tokens (CSS variables) + Tailwind
└── test/                     # Vitest setup
```

**Rule of thumb:** every page is built from `components/ui`/`components/common` —
never bespoke one-off markup. If you're adding UI that doesn't fit an existing
primitive, add it to the shared kit rather than hand-rolling it in a feature folder.

## Routing & Roles

Three top-level layouts, gated by route guards in `app/router/guards.tsx`:

- **`PublicLayout`** — Landing, Login, Register, Forgot Password (`PublicRoute` bounces
  already-signed-in users to their dashboard)
- **`UserLayout`** — Dashboard (role-aware — renders a different component per role),
  Books, Reservations, Seat Booking, Events, Community, Profile, Notifications,
  Reading Progress, Leaderboard, Reviews, Settings (`ProtectedRoute` requires sign-in)
- **`AdminLayout`** — Admin Dashboard (`RoleRoute` requires the `admin` role
  specifically)

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend base URL — not yet consumed; reserved for Milestone 3 |

## Notes for Milestone 3

Swapping mocks for real data should mostly mean replacing `mocks/<feature>.ts`
imports with `useQuery(...)` calls inside the same components — `QueryClientProvider`
is already mounted in `providers/AppProviders.tsx`, and page components already treat
their data as a variable, not a live call. `AuthProvider` (`providers/AuthProvider.tsx`)
is the other piece to replace — swap the mocked `login()`/`logout()` for real
JWT-backed calls without changing the route guards that consume it.
