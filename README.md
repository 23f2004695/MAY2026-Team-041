# MAY2026-Team-041

Production-ready starter repo with:

- Backend: FastAPI, uv, Prisma, PostgreSQL
- Frontend: React, Vite, TypeScript
- Testing: pytest for backend, Playwright for end-to-end tests
- Tooling: Ruff, ESLint, Prettier, Docker Compose

## Repository Layout

```text
.
├── backend/              # FastAPI service, Prisma schema, migrations
├── frontend/             # React + Vite app
├── docker-compose.yml    # Local PostgreSQL
├── package.json          # Root Playwright/e2e scripts
└── Makefile              # Common developer commands
```

## Prerequisites

- Python 3.12+
- uv
- Node.js 20+
- npm
- Docker

## Environment Setup

Copy the example environment files:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

The root `.env` owns shared infrastructure values such as `DATABASE_URL`. Keep
backend-only settings in `backend/.env` so Prisma does not see duplicate database
environment variables.

Install dependencies:

```bash
make install
```

Start PostgreSQL:

```bash
docker compose up -d db
```

Generate the Prisma client and apply migrations:

```bash
make db-generate
make db-migrate
```

## Development

Run the backend:

```bash
make backend-dev
```

Run the frontend in a second terminal:

```bash
make frontend-dev
```

Open the app at http://localhost:5173.

Backend API:

- Live health: http://localhost:8000/health/live
- Readiness health: http://localhost:8000/health/ready
- OpenAPI docs: http://localhost:8000/docs

## Quality Checks

```bash
make lint
make format
make test
```

Run Playwright tests:

```bash
make test-e2e
```

Install Playwright browsers once before the first e2e run:

```bash
npm run test:e2e:install
```

## Database

The Prisma schema lives at [backend/prisma/schema.prisma](backend/prisma/schema.prisma).
New database migrations should be committed under `backend/prisma/migrations`.

Create a migration after changing the schema:

```bash
cd backend
uv run prisma migrate dev --schema prisma/schema.prisma --name describe_change
```

Generate the Prisma Python client:

```bash
cd backend
uv run prisma generate --schema prisma/schema.prisma
```

## Production Notes

- Keep secrets out of git and provide them through the deployment environment.
- Run migrations as a release step before starting new application instances.
- Use `uv run uvicorn app.main:app --app-dir src --host 0.0.0.0 --port 8000` behind a production process manager or container runtime.
- Build the frontend with `npm --prefix frontend run build` and serve the generated `frontend/dist` through a CDN or static host.
