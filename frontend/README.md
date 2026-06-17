# MoodMix Frontend

React + Vite + TailwindCSS SPA.

**Phase docs:** [../docs/PHASES.md](../docs/PHASES.md) · [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Structure

- `src/components/` — Reusable UI (common, layout, mood, playlist)
- `src/pages/` — Route-level views
- `src/services/` — Axios API client
- `src/routes/` — React Router configuration

## Deploy (Vercel)

Root directory: `frontend`  
Build: `npm run build`  
Output: `dist`
