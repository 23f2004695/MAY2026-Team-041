# 📚 Community Reading Club & Library Management Platform

> **Project Specification & Development Guide**
>
> This document serves as the **single source of truth** for the entire project.
> Every AI assistant (Claude Code, Codex, GitHub Copilot, Cursor, ChatGPT, etc.) should read this document before generating code.
>
> **Do NOT redesign the architecture unless explicitly instructed.**
>
> Version: 1.0

---

# 1. Project Overview

## Project Name

Community Reading Club & Library Management Platform

## Problem Statement

Community libraries still rely heavily on paper registers, spreadsheets, WhatsApp groups, and manual workflows to manage books, members, borrowing, reservations, events, and volunteers.

The goal of this project is to build a modern web application that digitizes library operations while promoting community engagement through reading clubs, AI-powered recommendations, seat booking, gamification, and analytics.

---

# 2. Project Goals

The platform should:

- Digitize library management
- Manage members and memberships
- Automate borrowing and returns
- Support book reservations
- Manage study seat bookings
- Organize reading clubs and events
- Encourage community participation
- Support AI-powered book recommendations
- Track reading progress
- Generate analytics and reports

---

# 3. User Roles

## Admin

Responsible for:

- User Management
- Roles & Permissions
- Analytics
- Reports
- Platform Configuration
- Audit Logs

---

## Librarian

Responsible for:

- Book Management
- Inventory
- Issue & Return Books
- Reservations
- Fine Management
- QR Code Borrowing

---

## Member

Responsible for:

- Borrow Books
- Reserve Books
- Seat Booking
- Book Reviews
- Reading Progress
- Reading Challenges
- Community Discussions

---

## Volunteer

Responsible for:

- Event Management
- Attendance
- Reading Sessions
- Community Activities

---

# 4. Core Modules

## Authentication

Features

- Login
- Register
- Forgot Password
- JWT Authentication
- Refresh Token
- Role Based Access Control

---

## Library

Features

- Books
- Authors
- Categories
- Book Copies
- QR Codes
- Search
- Filters

---

## Borrowing

Features

- Issue Book
- Return Book
- Renew Book
- Borrow History
- Fine Calculation

---

## Reservation

Features

- Book Reservation
- Reservation Queue
- Availability Notification

---

## Seat Booking

Features

- Live Seat Availability
- Seat Reservation
- Booking History

---

## Membership

Features

- Membership Plans
- Expiry Tracking
- Membership Fee Payment

---

## Community

Features

- Reading Clubs
- Discussion Rooms
- Reviews
- Ratings
- Reading Challenges

---

## Donations

Features

- Donate Books
- Donation Approval
- Donation Tracking

---

## Notifications

Features

- Email
- In-App
- Telegram (Future)

---

## AI

Features

- AI Librarian
- Mood-Based Recommendations
- Smart Search
- Book Suggestions

---

## Analytics

Features

- Dashboard
- Reports
- Leaderboard
- Reading Trends
- Popular Books

---

# 5. Advanced Features

- AI Librarian
- QR Code Borrowing
- Live Seat Availability
- Mood-Based Book Recommendation
- Leaderboards
- Achievements
- Reading Challenges
- Book Discussions
- Quote of the Day
- Email Notifications
- Book Donation System

---

# 6. Technology Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM
- TanStack Query
- React Hook Form
- Zod
- Axios
- Framer Motion
- Lucide React
- Sonner

---

## Backend

- FastAPI
- Python 3.12
- Prisma Client Python
- JWT Authentication
- Pydantic
- Uvicorn

---

## Database

- PostgreSQL
- Prisma ORM

---

## Storage

- Cloudinary

---

## Deployment

Frontend

- Vercel

Backend

- Railway

Database

- PostgreSQL

---

# 7. Project Architecture

Architecture Pattern

- Clean Architecture
- Feature-Based Architecture
- Component-Based UI
- REST API

Frontend

```text
React
    ↓
Reusable Components
    ↓
Feature Modules
    ↓
API Layer
```

Backend

```text
FastAPI Routers
        ↓
Application Services
        ↓
Repositories
        ↓
Prisma ORM
        ↓
PostgreSQL
```

---

# 8. Development Principles

Always follow:

- SOLID Principles
- DRY
- KISS
- Reusable Components
- Strict TypeScript
- Responsive Design
- Accessibility
- Semantic HTML
- Mobile First
- Feature-Based Folder Structure

Never duplicate UI components.

Always reuse existing components.

---

# 9. Reusable Components

The following components should be reused throughout the application.

## Layout

- Navbar
- Sidebar
- Footer
- Header
- PageHeader

---

## UI

- Button
- Input
- Select
- Checkbox
- Switch
- Badge
- Avatar
- Card
- Modal
- Drawer
- Dialog
- Loader
- EmptyState
- Pagination
- Table
- SearchBar

---

## Feature Components

- BookCard
- SeatCard
- EventCard
- FeatureCard
- ReviewCard
- NotificationCard
- AchievementBadge
- StatisticCard

---

# 10. Frontend Pages

Public

- Landing
- Login
- Register
- Forgot Password

User

- Dashboard
- Books
- Book Details
- Borrow
- Reservations
- Seat Booking
- Community
- Events
- Profile
- Notifications
- Settings

Admin

- Dashboard
- Books
- Members
- Reports
- Analytics
- Donations
- Events
- User Management

---

# 11. Backend Modules

- Authentication
- Users
- Library
- Borrowing
- Reservation
- Membership
- Seat Booking
- Community
- Donation
- Notification
- Analytics
- AI

---

# 12. API Style

- REST API
- Versioned APIs
- `/api/v1`
- JWT Protected Routes
- OpenAPI Documentation
- Swagger

---

# 13. Database

Database

- PostgreSQL

ORM

- Prisma ORM

Schema

- Already finalized.

Do NOT redesign the schema unless requested.

---

# 14. AI Features

- AI Librarian
- Mood Recommendation
- Smart Search
- Personalized Recommendations

Use an abstraction layer so AI providers can be changed later.

---

# 15. Coding Guidelines

When generating code:

- Do NOT generate duplicate components.
- Prefer reusable abstractions.
- Follow the existing architecture.
- Keep files small and focused.
- Use feature-based organization.
- Write readable code.
- Add comments only where necessary.
- Use meaningful names.

---

# 16. Git Workflow

Feature Branches

Examples

```
feature/auth

feature/books

feature/landing

feature/dashboard

feature/seat-booking
```

Commit Style

```
feat:

fix:

refactor:

docs:

style:

test:

chore:
```

---

# 17. Milestone Plan

## ✅ Milestone 1 — Requirements & Analysis (Completed)

Completed:

- Problem Statement
- User Research
- Personas
- User Stories
- Functional Requirements
- Non-Functional Requirements
- Initial Scope
- Feature List

---

## 🚧 Milestone 2 — Design & Frontend Foundation (Current)

### Architecture

- Database Design
- ER Diagram
- UML Class Diagram
- Component Diagram
- Prisma Schema

### Frontend

- Project Setup
- Folder Structure
- Routing
- Layouts
- Design System
- Reusable Components
- Landing Page
- Authentication UI
- Dashboard Layout
- Placeholder Pages
- Mock Data
- Theme

### Backend

Only project foundation

- FastAPI Setup
- Project Structure
- Environment Configuration
- Health Check
- Swagger
- Prisma Initialization
- Mock Authentication Routes

No business logic.

No database operations.

---

## 🔜 Milestone 3 — Backend Development

Develop feature modules in this order:

1. Authentication
2. User Management
3. Library
4. Books
5. Authors
6. Categories
7. Book Copies
8. Borrowing
9. Reservations
10. Membership
11. Seat Booking
12. Notifications
13. Community
14. Donations
15. AI Services
16. Analytics

Integrate PostgreSQL using Prisma ORM.

---

## 🔜 Milestone 4 — Frontend Integration

Replace mock data with backend APIs.

Implement:

- Authentication
- CRUD Operations
- Forms
- API Integration
- Protected Routes
- Error Handling
- Loading States

---

## 🔜 Milestone 5 — Advanced Features

Implement:

- AI Librarian
- Mood Recommendation
- QR Code Borrowing
- Email Notifications
- Reading Challenges
- Leaderboards
- Analytics
- Reports

---

## 🔜 Milestone 6 — Testing & Deployment

Testing

- Unit Tests
- Integration Tests
- UI Testing

Deployment

- Frontend → Vercel
- Backend → Railway
- Database → PostgreSQL

Deliverables

- Documentation
- Demo Video
- Final Presentation
- Production Deployment

---

# 18. Important Notes for AI Assistants

Before generating code:

1. Reuse existing components whenever possible.
2. Do not redesign the architecture.
3. Follow the finalized database schema.
4. Follow the existing folder structure.
5. Keep components modular and reusable.
6. Prefer composition over duplication.
7. Maintain consistent naming conventions.
8. Generate code incrementally instead of creating the whole application at once.
9. Ask for clarification if a requested feature conflicts with this specification.

This document is the authoritative reference for all future development.
