# Features — What's Built, Where It Lives, How It Works

A reference for the team: every feature currently implemented in the app, where its code
lives, and the real mechanism behind it — so you can look something up here instead of
re-reading the whole codebase. This describes what's actually built, not what was
originally planned (see `FINAL_SPEC.md` / `PROJECT_SPECIFICATION.md` for the original spec).

Every backend module follows the same layering: `router.py` (routes + request/response
schemas) → `service.py` (business logic) → `repository.py` (Prisma queries). That pattern
isn't repeated per feature below — assume it unless noted otherwise.

---

## Roles

Six roles, each with its own landing page after login:

| Role | Lands on | Dashboard covers |
|---|---|---|
| **Member** | `/dashboard` | Borrowed books, due dates, reservations, seat bookings, reading streak, membership status, notifications, upcoming events, library-review prompt |
| **Guardian** | `/guardian` | Linked children's live library presence, borrowed books, reading progress, fines/subscription per child, seat booking + tickets on a child's behalf |
| **Manager / Librarian** | `/dashboard` (auto-switches) | Walk-in check-in/out, issue loans, pending reservations, overdue fines, revenue/seat/borrowing charts, front-desk actions |
| **Admin** | `/admin` | Financial reports, budget/expenses, live seat occupancy, pending billing/permission requests, audit log, pricing, announcements, library-review moderation |
| **IT Head** | `/it-head` | Access control (roles/permissions), book records, support-ticket queue, fee/collections charts, system activity, security alerts |

---

## Core Library Operations

### Authentication
Email/password with a hashed password (`backend/src/app/modules/auth/`), plus Google
OAuth (`/auth/google`). JWT access + refresh tokens; refresh rotation on use. Role is
fixed at registration and drives every `require_role(...)` gate across the API.
**Frontend:** `frontend/src/features/auth/`.

### Book Catalog
Browse/search/filter the catalog, book detail pages, related-books suggestions.
`BookOut.from_prisma` attaches a computed `average_rating`/`review_count` per book (see
Book Reviews below) so star ratings show up on every card without an extra request.
Staff can create/update/delete books and even get an AI-suggested description
(`POST /books/{id}/suggest-description`, using the same local LLM as the chat assistant).
**Backend:** `backend/src/app/modules/books/`. **Frontend:**
`frontend/src/features/books/pages/BooksListPage.tsx`, `BookDetailsPage.tsx`.

### Loans (Borrow / Return)
Borrow and return books, view active loans and full history, staff-side fine tracking and
overdue reminders. Fines are computed on read from `dueDate` vs. `returnedAt`/now — not
stored — so they never drift out of sync.
**Backend:** `backend/src/app/modules/loans/`. **Frontend:**
`frontend/src/features/dashboard/components/ActiveLoans.tsx`,
`frontend/src/features/dashboard/components/LateReturnFines.tsx`.

### Reservations
Place a hold on a book that's currently unavailable; staff approve/reject pending
reservations (approving one creates a real Loan). **Backend:**
`backend/src/app/modules/reservations/`. **Frontend:**
`frontend/src/features/reservations/pages/ReservationsPage.tsx`.

### Library Visits (Check-In / Check-Out)
A **manual staff action**, not a QR scan or self-service kiosk — staff pick a member and
click check-in/check-out. "Active visitor" status is just "has an open `LibraryVisit` row
(`checkedInAt` set, `checkedOutAt` null)"; a second check-in is rejected until checked out.
No polling/push — staff just refresh the active-visitor list. CSV export is available.
**Backend:** `backend/src/app/modules/visits/`. **Frontend:**
`frontend/src/features/dashboard/components/CheckInCheckOutCard.tsx`.

---

## Member Engagement

### Reading Progress, Goals & Streaks
Track currently-reading/completed books, set a yearly/monthly reading goal, and a login
streak counter. Lives inside the `members` module rather than its own — `/me/reading-progress`,
`/me/reading-goal`, `/me/reading-streak`. **Frontend:**
`frontend/src/features/reading-progress/pages/ReadingProgressPage.tsx`.

### Leaderboard
Ranked member list by reading activity. **Backend:**
`backend/src/app/modules/leaderboard/`. **Frontend:**
`frontend/src/features/leaderboard/pages/LeaderboardPage.tsx`.

### Book Reviews
Rate and review a **specific book** — any time, no loan required (one review per member
per book, enforced by a DB unique constraint; a duplicate attempt returns a friendly 409
telling them to edit instead). Author or a moderator (Admin/IT-Head) can edit/delete.
This is a **different feature** from Library Reviews/Testimonials below — don't confuse
the two, they share a `frontend/src/features/reviews/` folder but are separate backend
modules with separate purposes.
**Backend:** `backend/src/app/modules/reviews/`. **Frontend:**
`frontend/src/features/reviews/pages/ReviewsPage.tsx` (renders three different views off
one route: a book's reviews, staff moderation, or "my reviews," depending on context),
`WriteReviewModal.tsx`, `RatingSummary.tsx`.

### Library Reviews (Testimonials)
A member's review of the **library as a whole**, not a specific book — goes into a
`pending → approved/rejected` queue (mirrors the billing-request approval pattern). Only
`approved` reviews are ever shown publicly, on the landing page's "What Our Members Say"
section, fetched from a no-auth public endpoint. Admin gets a "Review Library Reviews"
quick action to approve/reject. Resubmitting doesn't edit in place — it files a new pending
row, so "your review" always shows the most recent one.
**Backend:** `backend/src/app/modules/library_reviews/`. **Frontend:**
`frontend/src/features/reviews/components/LibraryReviewCard.tsx`,
`LeaveLibraryReviewModal.tsx`; moderation at
`frontend/src/features/admin/components/PendingLibraryReviewsModal.tsx`; public display at
`frontend/src/features/landing/components/Testimonials.tsx`.

### Community
A social feed: posts (with images), likes, saves, comments (one level of nesting via
`parentId` — a reply-to-a-reply still attaches to its immediate parent, so display nesting
is effectively unlimited even though the data model only tracks one level), and reporting.
Images are stored as `data:` URLs directly in the database — there's no object storage yet,
by design, at this scale. **Reporting is flag-only**: it sets a `reported` flag and notifies
moderators, but the content stays fully visible — nothing auto-hides. A moderator has to
manually ban the author (blocks future posting, doesn't retroactively hide old content) or
separately delete the specific post/comment.
**Backend:** `backend/src/app/modules/community/`. **Frontend:**
`frontend/src/features/community/pages/CommunityPage.tsx`,
`components/PostCard.tsx`, `CreatePostModal.tsx`.

### Events
Library events with registration and analytics. Registration is a **hard capacity cap,
no overbooking** — enforced race-safely via a Postgres advisory lock, so two people can't
grab the last spot at the same moment. There's no separate attendance/check-in step for
events; "attendance summary" is really a registration-based aggregate (fill rate, total
registrants). Per-event analytics (registrant list, role breakdown) only unlock after the
event date has passed.
**Backend:** `backend/src/app/modules/events/`. **Frontend:**
`frontend/src/features/events/pages/EventsPage.tsx`, `components/CreateEventModal.tsx`,
`EventAnalyticsPanel.tsx`.

### Seat Booking
Study seats: a **fixed grid of 32 seats** (rows A–D × 8), bookable by date + hour, up to 2
days ahead. Availability is computed live (count existing bookings for that slot, subtract
from 32) — never stored as a separate number. A member can only hold one seat per slot,
enforced both in code and by a DB unique constraint. **"Notify me" is real and
event-driven**: when a booked seat gets cancelled, the system finds anyone waiting on that
exact seat/date/hour and notifies them immediately — it only fires on an actual
cancellation, there's no background sweep checking for openings.
**Backend:** `backend/src/app/modules/seat_booking/`. **Frontend:**
`frontend/src/features/seat-booking/pages/SeatBookingPage.tsx`,
`components/DateSlider.tsx`, `BookingSummary.tsx`.

---

## AI-Powered Features

*(See `ai-features.html` in the project root for a full plain-English walkthrough with
diagrams — this section is the short version.)*

### Library Assistant (Chat)
The one feature that's a genuine AI model: a LangGraph ReAct agent running **Ollama
llama3.2:3b** locally, with 26 tools that query the same real service-layer functions the
REST API uses — so it never answers account/library questions from guesswork. Input and
output both pass through a guardrail layer (prompt-injection block-list, PII redaction).
Conversation history lives in Redis, capped at ~5 exchanges, expiring after an hour. The
model is swappable to OpenAI or Bedrock via one config value (`LLM_MODE`).
**Backend:** `backend/src/app/modules/chat/`. **Frontend:**
`frontend/src/components/layout/ChatbotWidget.tsx`,
`frontend/src/hooks/useChatbotConversation.ts`.

### Find My Next Book (Recommendations)
**Not AI-powered** — a 4-question quiz (author, era, story type, popularity), each only
offered if the catalog has enough real variety to make it meaningful, feeding a
hand-written weighted scoring formula over real catalog data. An LLM-based re-ranker was
built for this at one point and deliberately removed in favor of the deterministic
version — predictable, instant, free, and easy to explain.
**Backend:** `backend/src/app/modules/recommendations/`. **Frontend:**
`frontend/src/features/books/components/FindMyNextBookModal.tsx`.

### Translation
Plain machine translation (Google Translate via `deep-translator`), not an LLM — no
prompting or context involved. Its real job is auto-translating the app's own UI text into
languages without a hand-written locale file (batched, cached client-side per language);
there's a standalone demo page for translating arbitrary typed text, but no "translate this
review" button wired into user content anywhere yet.
**Backend:** `backend/src/app/modules/translate/`. **Frontend:**
`frontend/src/i18n/autoTranslate.ts` (UI auto-translate),
`frontend/src/features/translate/pages/TranslateDemoPage.tsx` (demo).

---

## Billing & Payments

### Payments
Two real paths. **Razorpay:** create an order (server computes the trusted amount — plan
price or sum of unpaid fines, never trusts a client-sent number) → client-side Razorpay
checkout → signature verification, which re-fetches the order from Razorpay's own API
(not the client) before recording anything. Verification is idempotent — replaying the
same payment ID returns the already-recorded payment instead of double-charging. **Cash
("pay at library"):** doesn't create a payment record at all — it just notifies managers
that cash is expected, and a manager reconciles it in person; there's no dedicated
"staff records cash" endpoint yet.
**Backend:** `backend/src/app/modules/payments/`. **Frontend:**
`frontend/src/features/payment/pages/PaymentPage.tsx`.

### Coupons
Percent-off only (no fixed-amount discounts), admin-generated 8-character codes with a
use-count cap. A coupon is only actually *consumed* (its use count incremented) after
payment verification succeeds, inside the same transaction that records the payment — so
a failed/abandoned checkout never burns a use.
**Backend:** `backend/src/app/modules/coupons/`. **Frontend:**
`frontend/src/features/admin/components/AdjustPricingModal.tsx` (generation),
coupon entry on `PaymentPage.tsx`.

### Pricing Plans
Admin-editable rows in the database (price, save-percent) for a fixed set of plan
lengths — plans aren't created/deleted through the UI, only their price/discount.
**Backend:** `backend/src/app/modules/pricing_plans/`. **Frontend:**
`frontend/src/features/pricing/components/`.

### Billing Requests
Member-filed requests (e.g. asking for a fine waiver) that queue for staff approval —
the same `pending → approved/rejected` pattern as Library Reviews and Permission Requests.
**Backend:** `backend/src/app/modules/billing_requests/`. **Frontend:**
`frontend/src/features/admin/components/PendingRequests.tsx`,
`frontend/src/features/admin/components/WaiveFineModal.tsx`.

---

## Staff & Admin Operations

### Guardian Accounts
Parents/guardians linked to one or more child member accounts. From the guardian
dashboard: see which linked children are currently checked into the library, their
borrowed books and reading progress, pay a child's fines, renew a child's membership, and
book a seat or raise a support ticket on a child's behalf.
**Backend:** `backend/src/app/modules/guardian/`. **Frontend:**
`frontend/src/features/guardian/pages/GuardianDashboardPage.tsx`.

### Permission Requests
Staff (Manager/Librarian) can request an elevated permission — the permission itself is a
free-form string, not a fixed enum, so it's flexible but not validated against a known
list. Only IT Head can approve or deny. Every decision is written to the audit log.
**Backend:** `backend/src/app/modules/permission_requests/`. **Frontend (request):**
`frontend/src/features/dashboard/components/RequestPermissionModal.tsx`.
**Frontend (decide):** `frontend/src/features/it-head/components/AccessControl.tsx`.

### Support Tickets
Categories are role-gated — members can raise most categories except `attendance`;
guardians can only raise `attendance`, `seat_booking`, `payment`, `other`. Status
lifecycle: **open → resolved → closed**, but the person who raised it gets the final say —
after staff resolve it, they either confirm it (closes it) or reopen it (staff get
re-notified that the fix didn't work). All the status transitions use conditional updates
that safely no-op instead of double-processing if two people act on the same ticket at once.
**Backend:** `backend/src/app/modules/support_tickets/`. **Frontend:**
`frontend/src/features/support/pages/SupportPage.tsx`,
`components/StaffTicketQueue.tsx`.

### Book Records
An audit trail of catalog changes (lost / donated / purchased) that IT Head logs
manually — feeds the "Book Records" log on their dashboard.
**Backend:** `backend/src/app/modules/book_records/`. **Frontend:**
`frontend/src/features/it-head/components/BookRecords.tsx`,
`LogBookChangeModal.tsx`.

### Audit Log
A single admin-only log (`GET /admin/audit-log`, Admin role only — not Manager, not IT
Head) covering both financial actions (expenses, refunds, fee waivers, pricing changes,
coupons) **and** privileged non-financial actions (role changes, account
activation/deactivation, permission decisions, community bans, library-review decisions) —
broader than "just money," it's really "who did anything sensitive."
**Backend:** `backend/src/app/modules/audit_log/` (shared service, no own router — exposed
through `admin`). **Frontend:** `frontend/src/features/admin/components/AuditLog.tsx`.

### Notifications
Pure in-app, database-backed, polled every 30 seconds by the frontend (no
websocket/real-time push) — the bell icon, the notifications panel, and both dashboards
all share one React Query cache, so marking something read updates everywhere instantly
without waiting for the next poll. Triggered from all over the app: seat booking, loan
reminders, community likes/comments, support ticket status changes, payments,
reservations, pending-approval queues, admin announcements, and the contact form.
**Backend:** `backend/src/app/modules/notifications/`. **Frontend:**
`frontend/src/features/notifications/hooks/useNotificationsQuery.ts`,
`components/NotificationsPanel.tsx`.

### Contact
A public "contact us" form (no login required) that notifies staff.
**Backend:** `backend/src/app/modules/contact/`. **Frontend:**
`frontend/src/features/landing/` contact section / `/contact-us` page.

---

## Known Gaps (not built yet, in case you're planning what's next)

Wishlist exists but is **browser-only** (`localStorage`, doesn't sync across devices —
no backend model). No e-book/in-app reading, no barcode/QR scanning, no peer-to-peer book
swapping, single-location only (no multi-branch), no web push or email digests, no 2FA, and
no real book-club/reading-group data model (the chat assistant answers FAQ questions about
one, but nothing behind it actually exists).

---

## Quick Reference — Adding a New Backend Feature

Every module follows: `backend/src/app/modules/<name>/{router.py, service.py,
repository.py, schemas.py}`. Router owns routes + Pydantic schemas + role gating via
`require_role(...)`; service owns business rules and cross-module orchestration;
repository only touches that module's own Prisma tables. Register the new router in
`backend/src/app/main.py`. See `docs/System_Components.md` for the fuller layering
rationale and `docs/Database_Design.md` for the schema.
