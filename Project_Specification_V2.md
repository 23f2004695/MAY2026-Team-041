7e# Community Reading Club & Library Management Platform
## Functional Specification — Step 0 (Pre-Development)

Status: **Draft for sign-off** — once approved, this becomes the frozen scope for Phase 0–4.

---

## 1. Architectural Review: Overlaps, Redundancies & Consolidations

Several features in the original list are *user-facing labels* for what should be a *single backend subsystem*. Building them as separate features leads to duplicated logic, inconsistent behavior, and rework later. Before categorizing anything, these need to be merged at the architecture level:

| Overlapping Features | Consolidate Into | Why |
|---|---|---|
| AI Librarian + Mood-Based Recommendation | **One Recommendation Service** with two entry points: a conversational query interface and a tag/mood filter interface. Both should query the same underlying book-tagging/embedding layer. | Building two separate recommendation engines doubles the maintenance burden and will drift out of sync (e.g. a book tagged `#calm` should also surface when a user asks the AI Librarian for "something relaxing"). |
| QR Codes (Book Management) + QR Code Borrowing + Seat "Scan QR codes" | **One Scanning/Check-in Subsystem** — a generic `scan_token` type used for both books and seats, resolved by a single endpoint that checks the token type and routes accordingly. | Staff will use the same physical scanner/camera for both. Two parallel QR implementations means two bugs to fix instead of one. |
| Achievements + Community Score + Leaderboard + Reading Badges | **One Gamification Engine** — a rules-driven point/event system. Badges and leaderboard rank are *derived views* over the same event stream, not separate features. | These are one feature with three visualizations, not four features. |
| Reservation Notification + Email Notifications + Telegram Notifications + "Configure Notifications" (admin) | **One Notification Service** with pluggable channels (email first, Telegram later) and a template/trigger registry that any feature (reservations, fines, seat expiry, discussion replies) can publish events to. | Otherwise every future feature that needs to notify a user re-implements delivery, retries, and preferences from scratch. |
| Borrow History + Payment History + (implied) Reservation History | **One Activity Ledger per member**, filterable by type. | Avoids three near-identical "history" tables and three near-identical list UIs. |
| Book Heatmap + Seat Occupancy Dashboard + Admin Analytics (Revenue, Popular Books, Monthly Reports) | **One Analytics/Aggregation Pipeline**, feeding multiple dashboard widgets. | Same aggregation infrastructure (scheduled jobs writing to pre-aggregated tables), different chart components on top. |

**Architectural recommendation:** design these as five backend services/modules from day one — `RecommendationService`, `ScanningService`, `GamificationEngine`, `NotificationService`, `AnalyticsService` — even though only a subset of their capabilities ships in the MVP. This is the single biggest thing that will "minimize rework" later, because the *feature list* implies four separate gamification features, but the *system* only needs one engine.

---

## 2. Missing Features a Real-World Library System Needs

The list is strong on member-facing "wow" features but under-specifies the operational backbone. Recommended additions:

**Operational / Policy**
- **Configurable fine rules**: grace period, per-day rate, maximum cap, per-category overrides — this must be data, not hardcoded logic, or every policy change becomes a code deploy.
- **Book condition & loss handling**: mark copies as damaged/lost, replacement cost billing, write-off workflow.
- **Reservation expiry**: auto-cancel a reservation if the member doesn't collect the book within X hours of it becoming available, and auto-promote the next person in queue.
- **Membership plans/tiers**: expiry dates, renewal reminders, borrowing limits tied to plan (not just a one-time fee).

**Trust & Safety**
- **Content moderation** for discussion rooms and reviews (report/flag, admin review queue, auto-hide on threshold).
- **Admin audit trail**: who issued/waived a fine, who approved a donation, who edited a book record — needed for accountability in a shared-staff environment.

**Discovery**
- **Full-text/faceted search** (author, category, availability, tags) — this is more foundational than "AI Librarian" and was missing as an explicit feature.
- **External ISBN lookup** (e.g. Google Books/Open Library API) to auto-fill title/author/cover when staff add a book, instead of full manual entry.

**Operations**
- **Data export**: CSV/PDF for reports, required by most real libraries for record-keeping or compliance.
- **Backup/restore policy** — not a "feature" in the UI, but must be decided before go-live given PostgreSQL is the primary relational database for financial (payments/fines) data.

**Growth path**
- **Multi-branch/location support**: even a single-location deployment benefits from modeling `Branch` as an entity now, so it isn't a painful migration later.

---

## 3. Security, Scalability & Usability Recommendations

### Security
- **Granular RBAC**, not just three fixed roles — model permissions as capabilities (`can_issue_book`, `can_waive_fine`, `can_approve_donation`) assigned to roles, so future roles (e.g. "volunteer") don't require code changes.
- **Short-lived JWT access tokens + refresh tokens**, refresh token rotation on use.
- **Rate limiting on the AI Librarian endpoint specifically** — conversational AI features are the easiest attack surface for cost-abuse (someone scripting thousands of queries against your LLM bill).
- **File upload validation** for Cloudinary uploads (type, size, image dimension limits) to prevent abuse of storage/bandwidth.
- **Payment webhook signature verification** if a third-party gateway is used for fees/fines — never trust client-reported payment success.
- **Server-side authorization on every mutating endpoint**, independent of frontend role checks (frontend RBAC is UX only, never the security boundary).

### Scalability
- **Separate OLTP paths from analytics/dashboard reads.** Live "heatmap" and "occupancy dashboard" queries should not run expensive aggregations against live tables on every page load — use scheduled jobs (APScheduler/Celery) to write pre-aggregated snapshots.
- **PostgreSQL indexing strategy decided up front**: text index for book search, compound indexes for `(status, due_date)` on loans, `(date, seat_id)` on bookings — retrofitting indexes under load is painful.
- **Caching layer (Redis)** for high-read, low-latency data: live seat availability, popular books, leaderboard — these are read far more often than they change.
- **Background job architecture** for anything time-based: fine accrual, reservation expiry, renewal reminders — don't compute these synchronously on user requests.
- **Pagination and cursor-based queries** on every list endpoint from the start (borrow history, discussion threads, leaderboard) — MVP scale doesn't need it, but retrofitting pagination into a frontend that assumed "get all" is a real cost.

### Usability
- **Mobile-first design** — students/members will overwhelmingly use this on phones, especially for seat booking and QR check-in.
- **Explicit empty/loading/error states** for every list view (borrowed books, discussions, leaderboard) — cheap to design now, expensive to retrofit.
- **Progressive disclosure of gamification** — don't surface leaderboards/badges to a brand-new user with zero activity; it should appear once there's something to show.
- **A single global search**, not book search and discussion search as separate UIs.

---

## 4. Feature Categorization

### 🟢 Core MVP
*The platform is unusable as a replacement for paper/spreadsheets/WhatsApp without these.*

- Authentication: Register, Login, JWT, Role-Based Access, Forgot Password
- Book Management: CRUD, Categories, Authors, ISBN, Covers, Multiple Copies
- Borrowing: Issue, Return, Renew, Borrow History, Automatic Fine (with **configurable fine rules**, added in §2)
- Reservations: basic single-queue Reserve Book (notification deferred — see Important)
- Seat Booking: basic day-level Seat Reservation (no live dashboard yet)
- Payments: Membership Fees, Fine Payments, Payment History
- Admin Dashboard: Revenue, Active Members, Overdue Books (basic numbers, not full analytics)
- Member Dashboard: Borrowed Books, Seat Booking
- **Full-text book search** (added — foundational, was implicit but unlisted)
- Staff workflows: Register Members, Allocate Seats

### 🟡 Important (Phase 2)
*Not required to replace paper processes, but expected soon after launch.*

- Unified QR Code Borrowing / Scanning (books + seats)
- Reservation Queue (multi-member) + Reservation Notification (via new Notification Service, email channel only)
- Book Reviews
- Book Donations (with admin approval workflow)
- Seat Plans (multiple zones/rooms) + Live Seat Availability + Seat Occupancy Dashboard
- Popular Books / Monthly Reports (via new Analytics Service)
- Granular RBAC refinement
- Content moderation basics (report/flag)
- Data export (CSV/PDF)

### 🟠 Advanced (Phase 3)
*Differentiators that build community engagement — needs an active user base to be meaningful.*

- Book Discussion Rooms (requires moderation to be built first)
- Mood-Based Book Recommendation (tag-based, no LLM required — cheaper stepping stone toward AI Librarian)
- Gamification Engine: Achievements, Community Score, Leaderboard, Badges (built as one engine per §1)
- Telegram Notifications (as second channel on the Notification Service)
- Quote of the Day

### 🔴 Future Scope (Phase 4+)
*High cost/complexity relative to MVP value, or dependent on data/usage the platform doesn't have yet.*

- AI Librarian (conversational, LLM-backed)
- Book Heatmap (needs months of real usage data to be meaningful)
- Multi-branch support
- Predictive analytics (e.g. demand forecasting for popular titles)
- Native mobile app

---

## 5. Features That Are Too Ambitious for Now / Should Be Postponed

- **AI Librarian** — this is the single biggest scope item disguised as a bullet point. It requires: catalogue-grounded retrieval (to avoid recommending books you don't own), LLM API cost management, abuse/rate-limiting, and conversation UI. Recommend shipping **Mood-Based Recommendation first** (simple tag-matching, same book-tagging schema) as the stepping stone — it delivers 70% of the perceived value at a fraction of the engineering cost, and validates whether members actually use AI discovery before you invest in the harder version.
- **Book Heatmap** — a heatmap is only insightful with real historical traffic. Building it before go-live means building a dashboard for a graph with no meaningful data. Defer until Phase 4, after 2–3 months of production data exists.
- **Telegram Notifications** — not ambitious technically, but it's a second delivery channel for a Notification Service that doesn't exist yet. Build the service with email only first; Telegram becomes a config addition, not a rebuild.
- **Full Gamification Suite at launch** — leaderboards and community scores need a critical mass of active members to feel rewarding rather than empty. Shipping this in the MVP risks a leaderboard with 3 names on it.

---

## 6. Recommended Development Order (Phased Roadmap)

The ordering below is chosen specifically to minimize rework, by ensuring each phase's data model is a stable foundation for the next phase, and by building shared services (Notification, Analytics, Scanning, Gamification, Recommendation) **once**, in the phase where they're first needed, rather than reinventing per-feature.

**Phase 0 — Foundation**
Auth, RBAC/permissions model, base schemas for Users, Books, Categories. Nothing else can be built correctly without this.

**Phase 1 — Core Library Operations** *(delivers the actual "replace paper registers" value)*
Book CRUD, Issue/Return/Renew, Borrow History, configurable Fines, basic Reservations, Membership + Fine Payments, basic Admin/Member dashboards, full-text search.
→ *At the end of Phase 1, the platform can fully replace the paper register and spreadsheet workflow. This is your first real go-live candidate.*

**Phase 2 — Operational Efficiency**
Build the **Notification Service** (email) and **Scanning/QR Service** here — first used for reservation alerts and book/seat check-in, reused by every later phase. Seat Plans, Live Seat Availability, Occupancy Dashboard. Build the **Analytics Service** (aggregation pipeline) here, first used for Popular Books/Monthly Reports.

**Phase 3 — Community & Engagement**
Donations, Reviews, Discussion Rooms (moderation first), then the **Gamification Engine** built on top of the Activity Ledger from Phase 1. Reuses Notification Service for badge/leaderboard alerts.

**Phase 4 — Smart & AI Features**
Mood-Based Recommendation (tag matching) → AI Librarian (once catalogue tagging from Phase 4a is in place) → Book Heatmap (once usage data exists) → Telegram channel on Notification Service.

This order means: the Notification Service is built once in Phase 2 and just gets new triggers plugged in during Phases 3–4; the Recommendation Service starts simple (tags) and only later gets an LLM layered on top of the *same* tagged-book data, instead of building two unrelated recommendation systems.

---

## 7. Finalized Feature List (Frozen Scope)

| # | Feature | Category | Phase |
|---|---|---|---|
| 1 | Register / Login / JWT / Forgot Password | Core MVP | 0 |
| 2 | Role-Based Access Control | Core MVP | 0 |
| 3 | Book CRUD, Categories, Authors, ISBN, Covers, Multiple Copies | Core MVP | 1 |
| 4 | Full-text Book Search | Core MVP | 1 |
| 5 | Issue / Return / Renew Book | Core MVP | 1 |
| 6 | Borrow History | Core MVP | 1 |
| 7 | Automatic Fine (configurable rules) | Core MVP | 1 |
| 8 | Basic Reservation (single queue, no notification) | Core MVP | 1 |
| 9 | Basic Seat Booking (day-level) | Core MVP | 1 |
| 10 | Membership Fees & Fine Payments + Payment History | Core MVP | 1 |
| 11 | Basic Admin Dashboard (Revenue, Active Members, Overdue) | Core MVP | 1 |
| 12 | Basic Member Dashboard (Borrowed Books, Seat Booking) | Core MVP | 1 |
| 13 | Notification Service (email) | Important | 2 |
| 14 | Reservation Queue + Notifications | Important | 2 |
| 15 | Unified QR Scanning (books + seats) | Important | 2 |
| 16 | Seat Plans, Live Availability, Occupancy Dashboard | Important | 2 |
| 17 | Analytics Service: Popular Books, Monthly Reports | Important | 2 |
| 18 | Data Export (CSV/PDF) | Important | 2 |
| 19 | Content Moderation (report/flag) | Important | 2 |
| 20 | Book Donations (with approval workflow) | Important | 2 |
| 21 | Book Reviews | Important | 2 |
| 22 | Book Discussion Rooms | Advanced | 3 |
| 23 | Gamification Engine (Achievements, Score, Leaderboard, Badges) | Advanced | 3 |
| 24 | Quote of the Day | Advanced | 3 |
| 25 | Mood-Based Recommendation (tag-based) | Advanced | 3 |
| 26 | AI Librarian (LLM-backed) | Future Scope | 4 |
| 27 | Book Heatmap | Future Scope | 4 |
| 28 | Telegram Notifications | Future Scope | 4 |
| 29 | Multi-Branch Support | Future Scope | 4 |
| 30 | Predictive Analytics | Future Scope | 4 |
| 31 | Native Mobile App | Future Scope | 4 |

**Additions not in the original list, now part of frozen scope:**
- Configurable fine rules (§2) — folded into item 7
- Reservation auto-expiry & queue promotion — folded into item 14
- Membership plan/tier expiry & renewal — folded into item 10
- Book condition/loss handling — Phase 2, alongside item 16
- Admin audit trail — Phase 2, cross-cutting
- External ISBN lookup — Phase 1, alongside item 3
- Backup/restore policy — operational decision, not a UI feature; decide before Phase 1 go-live

---



## Architecture Update (Prisma ORM)

The implementation stack has been finalized as:

- Frontend: React
- Backend: FastAPI
- Database: PostgreSQL
- ORM: Prisma ORM (Prisma Client Python)

All future design artifacts (ER Diagram, Prisma Schema, Class Diagrams, REST APIs) should treat the Prisma schema as the single source of truth. Database design should follow relational modeling and normalization principles rather than document-oriented modeling.


## Sign-off Note

This document intentionally does **not** include database schemas, API contracts, or UML — that is Step 1, once this scope is approved. The main structural decision this spec makes that affects every later step: **five shared backend services (Notification, Scanning, Analytics, Recommendation, Gamification) should be designed as reusable modules from Phase 0, even though most of their features don't ship until Phase 2–4.** Get sign-off on that architectural point specifically before moving to schema design, since it affects how Prisma models for Users, Books, Loans, and Seats are modeled from the very first migration.
