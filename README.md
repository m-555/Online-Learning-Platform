<div align="center">

# Aula

**A multilingual language-learning platform — book tutors, take an AI placement test, and learn in Lëtzebuergesch, English or French.**

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

</div>

---

Aula is a full-stack EdTech application built around a real design system: one type scale, accessible
colour tokens, a reusable component library, light **and** dark themes, and layouts that hold up across
three languages. The product matches students to tutors with AI-style recommendations and tracks their
progress.

This repository contains a **Next.js** front end and a **FastAPI** back end sharing a **PostgreSQL**
database, wired together with Docker Compose and a GitHub Actions CI pipeline.

## Highlights

- **Design system first** — colour, type, spacing, radius and elevation are defined as design tokens
  (CSS variables mapped to Tailwind utilities). Dark mode is a pure token swap, not a per-component
  restyle.
- **Accessible by default** — semantic landmarks, labelled inputs, visible focus rings, 44px touch
  targets, and a focus-trapping modal that restores focus on close. Contrast targets WCAG AA.
- **Multilingual (LB / EN / FR)** — translations via `next-intl`, locale persisted per user, `<html lang>`
  kept in sync, and locale-aware date/currency formatting through `Intl`. Buttons size to their label so
  longer French and Luxembourgish strings never clip.
- **Typed end to end** — TypeScript on the front end, Pydantic schemas and SQLAlchemy 2.0 models on the
  back end, with a typed API client between them.
- **JWT authentication** — sign-up, log-in, and a single-step email-verification flow (the original UI
  stacked a verify modal on top of the login modal; this version replaces it with one clear step plus a
  non-blocking in-app banner).
- **Tested & linted** — `pytest` against PostgreSQL on the back end, `Vitest` + Testing Library on the
  front end, with Ruff/Black and ESLint/Prettier enforced in CI.

## Tech stack

| Layer      | Technology |
| ---------- | ---------- |
| Front end  | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, next-intl, next-themes |
| Back end   | FastAPI, SQLAlchemy 2.0, Alembic, Pydantic v2, python-jose (JWT), bcrypt |
| Database   | PostgreSQL 16 |
| Tooling    | Docker & Docker Compose, GitHub Actions, Ruff, Black, ESLint, Prettier, Vitest, pytest |

## Screens

| Screen | What it shows |
| ------ | ------------- |
| **Landing** | Sticky nav, announcement pill, hero with dual CTAs and social proof, and a grid of top-rated tutors loaded from the API (server-rendered). |
| **Auth** | A single modal with a Log in / Sign up segmented control, social sign-in stubs, and a calm "check your inbox" verification step. |
| **Student dashboard** | Persistent sidebar, verify banner, profile/next-class/lessons/messages stats, upcoming classes, an AI recommendation panel, and an AI-matched tutor — all wired to the API, in light and dark. |

## Architecture

```
.
├── frontend/                 # Next.js App Router app
│   └── src/
│       ├── app/              # routes: / , /verify , /dashboard
│       ├── components/       # ui/ design-system primitives, screen sections
│       ├── i18n/             # next-intl config + locale cookie
│       ├── lib/              # typed API client, auth, helpers
│       └── messages/         # en / fr / lb translation catalogs
├── backend/                  # FastAPI service
│   ├── app/
│   │   ├── api/routes/       # auth, teachers, dashboard, me
│   │   ├── core/             # settings, JWT & password hashing
│   │   ├── db/               # session, seed data
│   │   ├── models/           # SQLAlchemy models
│   │   └── schemas/          # Pydantic request/response models
│   ├── alembic/              # database migrations
│   └── tests/                # pytest suite (runs on PostgreSQL)
├── docker-compose.yml        # db + backend + frontend
└── .github/workflows/ci.yml  # lint + test + build
```

The browser calls the API at `NEXT_PUBLIC_API_URL`; server-side rendering can reach it over the internal
network via `INTERNAL_API_URL`. JWTs are issued by the back end and stored client-side for authenticated
requests.

## Getting started

### Option A — Docker Compose (one command)

```bash
cp .env.example .env        # optional: adjust secrets
docker compose up --build
```

- Front end → http://localhost:3000
- API docs (Swagger) → http://localhost:8000/docs

The backend container runs migrations and seeds demo data on startup.

### Option B — Run locally

**Prerequisites:** Node 22+, Python 3.11+, and a PostgreSQL 16 instance.

**Back end**

```bash
cd backend
python -m venv .venv && source .venv/Scripts/activate   # .venv/bin/activate on macOS/Linux
pip install -e ".[dev]"
export DATABASE_URL="postgresql+psycopg2://aula:aula@localhost:5432/aula"
alembic upgrade head
python -m app.db.seed
uvicorn app.main:app --reload --port 8000
```

**Front end**

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

### Demo accounts

Seeded by `app/db/seed.py` (all share the password **`password123`**):

| Email | Role |
| ----- | ---- |
| `anne@school.lu`  | Student (left unverified to demo the verify banner) |
| `marc@aula.lu`    | Teacher |
| `sophie@aula.lu` · `amal@aula.lu` · `julie@aula.lu` | Teachers |

## Testing & quality

```bash
# Back end (expects a PostgreSQL test database — see TEST_DATABASE_URL in .env.example)
cd backend && pytest && ruff check . && black --check .

# Front end
cd frontend && npm run test && npm run lint && npm run format:check
```

CI (`.github/workflows/ci.yml`) runs both suites on every push and pull request: the back-end job spins
up a PostgreSQL service for `pytest`, and the front-end job runs ESLint, Prettier, Vitest and a
production build.

## Roadmap

The current build ships the design system and three flagship screens. Planned next:

- Find-a-teacher marketplace with filters and semantic search
- Live lesson room (video + lesson plan + AI live notes)
- Teacher dashboard (schedule, earnings, booking requests)
- Adaptive AI placement test mapping to CEFR levels

## License

Released under the MIT License.
