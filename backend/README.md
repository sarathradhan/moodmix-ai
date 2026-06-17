# MoodMix Backend

Express REST API — mood analysis (ML + stub), iTunes genre recommendations, PostgreSQL history, session auth.

**Docs:** [../docs/BACKEND.md](../docs/BACKEND.md) (every file explained) · [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) · [../docs/API.md](../docs/API.md)

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Health: `GET http://127.0.0.1:5000/health`

## Structure

- `src/routes/` — `/mood`, `/auth`, `/history` under `/api/v1`
- `src/controllers/` — Request handlers
- `src/services/mood/` — Mood pipeline orchestration
- `src/services/ml/` — ML microservice client
- `src/services/music/` — iTunes search + genre mock fallback
- `src/models/` — PostgreSQL data access
- `src/db/schema.sql` — Tables (applied on startup)

## Deploy (Render)

Start command: `npm start`  
Root directory: `backend`
