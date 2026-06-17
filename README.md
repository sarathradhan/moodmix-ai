# MoodMix

AI-powered mood-based music recommendation application.

## Architecture

| Service     | Stack              | Port (dev) |
|-------------|--------------------|------------|
| Frontend    | React, Vite, Tailwind | 5173    |
| Backend     | Node.js, Express   | 5000       |
| ML Service  | Python, FastAPI    | 8000       |

## Monorepo Structure

```
moodmix/
├── frontend/     # React SPA
├── backend/      # Express REST API
├── ml-service/   # FastAPI emotion analysis
└── docs/         # Architecture & API docs
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL 14+ (local or hosted, e.g. Supabase, Neon, Render)
- PostgreSQL database `moodmix` (see `backend/.env`)

### Install

```bash
npm install
cd ml-service && pip install -r requirements.txt
```

### Environment

Copy each `.env.example` to `.env` and fill in values:

- `frontend/.env.example` → `frontend/.env`
- `backend/.env.example` → `backend/.env`
- `ml-service/.env.example` → `ml-service/.env`

### Run (development)

**Full stack (recommended):**

```bash
# Terminal 1 — ML service (optional if USE_ML_SERVICE=false)
cd ml-service && source venv/Scripts/activate && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Terminal 2 — Backend (requires PostgreSQL)
cd backend && npm run dev

# Terminal 3 — Frontend
cd frontend && npm run dev
```

Open http://127.0.0.1:5173 — sign up or log in, then submit a mood.

Set `USE_ML_SERVICE=false` in `backend/.env` to skip ML and use rule-based stub only. Music uses iTunes Search (no Spotify credentials required).

Or use Docker:

```bash
docker-compose up
```

## API Overview

- `POST /api/v1/mood` — Analyze mood, genre + song recommendations (login required)
- `POST /api/v1/auth/signup` · `POST /login` · `GET /me` — Session auth
- `GET /api/v1/history` — Per-user mood history

### Documentation

| Doc | Contents |
|-----|----------|
| **[docs/PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md)** | Full monorepo file-by-file guide |
| **[docs/BACKEND.md](docs/BACKEND.md)** | **Backend only** — purpose of every file in `backend/` |
| [docs/PHASES.md](docs/PHASES.md) | Phase-by-phase build log and diagrams |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design overview |
| [docs/API.md](docs/API.md) | REST endpoint reference |

**Current dev stack:** frontend + backend + PostgreSQL + ML service (port 8000) + iTunes for music.

## Deployment

- **Frontend:** Vercel (`frontend/`)
- **Backend:** Render (`backend/`)
- **ML Service:** Separate container/host (`ml-service/`)
