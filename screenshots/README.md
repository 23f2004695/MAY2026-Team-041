# Screenshots

Page-by-page screenshots of the frontend, captured against mock data (Milestone 2 —
see [PROJECT_SPECIFICATION.md](../PROJECT_SPECIFICATION.md)). No backend integration yet,
so anything shown here is illustrative, not live data.

## Public

| Page            | Screenshot                                 |
| --------------- | ------------------------------------------ |
| Landing         | [landing.png](landing.png)                 |
| Login           | [login.png](login.png)                     |
| Register        | [register.png](register.png)               |
| Forgot Password | [forgot-password.png](forgot-password.png) |
| 404             | [404-not-found.png](404-not-found.png)     |

## Member (signed in via the mock role picker on Login)

| Page             | Screenshot                                   |
| ---------------- | -------------------------------------------- |
| Dashboard        | [dashboard.png](dashboard.png)               |
| Books            | [books.png](books.png)                       |
| Book Details     | [book-details.png](book-details.png)         |
| Reservations     | [reservations.png](reservations.png)         |
| Seat Booking     | [seat-booking.png](seat-booking.png)         |
| Community        | [community.png](community.png)               |
| Events           | [events.png](events.png)                     |
| Notifications    | [notifications.png](notifications.png)       |
| Profile          | [profile.png](profile.png)                   |
| Reading Progress | [reading-progress.png](reading-progress.png) |
| Leaderboard      | [leaderboard.png](leaderboard.png)           |
| Reviews          | [reviews.png](reviews.png)                   |
| Settings         | [settings.png](settings.png)                 |

## Admin

| Page            | Screenshot                                 |
| --------------- | ------------------------------------------ |
| Admin Dashboard | [admin-dashboard.png](admin-dashboard.png) |

Regenerate these any time the UI changes — there's no saved script for it in the repo;
it was a one-off Playwright pass driving the local dev server (`npm run frontend`) with
`mock-auth` seeded in `localStorage` per role.
