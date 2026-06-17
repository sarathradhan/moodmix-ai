# MoodMix Backend — File Reference

This document explains **every source file** in `backend/`: what it does, how it connects to other files, and where it sits in the request flow.

**Related docs:** [ARCHITECTURE.md](./ARCHITECTURE.md) · [API.md](./API.md) · [PROJECT_GUIDE.md](./PROJECT_GUIDE.md)

---

## Architecture at a glance

The backend is a **layered Express API** (MVC-style naming + a **service** layer for business logic):

```
HTTP request
    ↓
app.js          (Express setup, CORS, session, mount routes)
    ↓
routes/         (URL → handler)
    ↓
middleware/     (auth, logging — where applied)
    ↓
controllers/    (validate input, call services, send JSON)
    ↓
services/       (mood pipeline, ML, iTunes, auth logic)
    ↓
models/         (PostgreSQL queries)
    ↓
JSON response
```

**Main mood pipeline** (`POST /api/v1/mood`):

```
mood.controller
  → mood.service
       → ml.service (+ mlLabel.mapper) OR emotion.stub
       → emotion.mapper (keywords)
       → musicRecommendations.service
            → emotionGenre.mapper + genres.js
            → itunes.service (fetch 50, shuffle, pick 3)
            → mockGenres.service (fallback)
       → MoodHistory.model + PlaylistHistory.model
```

---

## Root & deployment files

| File | Purpose |
|------|---------|
| `package.json` | npm package: `dev` / `start` scripts, dependencies (Express, `pg`, bcrypt, axios, session). Entry: `src/server.js`. |
| `.env.example` | Template for `PORT`, `DATABASE_URL`, `ML_SERVICE_URL`, `USE_ML_SERVICE`, `FRONTEND_URL`, `SESSION_SECRET`. |
| `.env` | Local secrets (not committed). Copy from `.env.example`. |
| `Dockerfile` | Container image: install deps, run `uvicorn`-style start via `node src/server.js`, expose port 5000. |
| `render.yaml` | Render.com deploy config for hosting the API. |
| `README.md` | Short setup and structure summary. |

---

## `src/` — Application entry

| File | Purpose |
|------|---------|
| `server.js` | **Process entry.** Connects to PostgreSQL (`connectDatabase`), dynamically imports `app.js`, calls `app.listen(env.PORT)`. Exits on startup failure. |
| `app.js` | **Express application.** CORS, `express.json()`, session middleware, request logger, `GET /health`, mounts `/api/v1` routes, global `errorHandler`. |

---

## `src/config/` — Environment & infrastructure

| File | Purpose |
|------|---------|
| `env.js` | Loads `dotenv`. Exports `env` object: `PORT`, `DATABASE_URL`, `ML_SERVICE_URL`, `USE_ML_SERVICE`, `FRONTEND_URL`, `SESSION_SECRET`, `NODE_ENV`. Used across the app. |
| `database.js` | Creates `pg` connection pool. On first connect: runs `db/schema.sql`; if `users` lacks `password_hash`, runs `db/migrate-auth.sql`. Exports `getPool()`, `isDatabaseConnected()`, `connectDatabase()`. |
| `session.js` | `express-session` with cookie name `moodmix.sid`. When DB is up, stores sessions in PostgreSQL via `connect-pg-simple` (`session` table). |

---

## `src/db/` — SQL definitions

| File | Purpose |
|------|---------|
| `schema.sql` | **Fresh database** DDL: `users`, `mood_history`, `playlist_history`, `session`, indexes. Applied automatically on startup. |
| `migrate-auth.sql` | **One-time upgrade** for old DBs (e.g. Spotify OAuth schema): recreates tables with email/password `users`. Run only when `password_hash` column is missing. |

**Tables (summary)**

| Table | Stores |
|-------|--------|
| `users` | `email`, `password_hash`, `display_name` |
| `mood_history` | Mood text, `emotions[]`, `primary_emotion`, `spotify_keywords[]` per user |
| `playlist_history` | JSONB per mood — today `{ genres: [...] }` with tracks |
| `session` | Express session payloads for login cookies |

---

## `src/routes/` — URL routing

| File | Purpose |
|------|---------|
| `index.js` | Aggregates routers: `/mood`, `/auth`, `/history` under `/api/v1`. |
| `mood.routes.js` | `POST /` → `moodController.analyzeMood`, guarded by `requireAuth`. |
| `auth.routes.js` | `POST /signup`, `POST /login`, `GET /me`, `POST /logout`. |
| `history.routes.js` | `GET /` → `historyController.getHistory`, guarded by `requireAuth`. |

---

## `src/controllers/` — HTTP handlers (thin layer)

Controllers parse/validate the request, call **services** or **models**, and return JSON. They should not contain heavy business logic.

| File | Purpose |
|------|---------|
| `mood.controller.js` | `analyzeMood`: validates mood text (`mood.validator`), calls `mood.service.processMoodText(text, req.userId)`, returns analysis + genres. |
| `auth.controller.js` | `signup` / `login`: validate body, `auth.service`, set `req.session.userId`. `me`: return current user or `null`. `logout`: destroy session, clear cookie. |
| `history.controller.js` | `getHistory`: loads recent moods for `req.userId`, joins `playlist_history`, parses stored `genres` (and legacy `playlists`/`tracks` shapes). |

---

## `src/middleware/` — Cross-cutting HTTP concerns

| File | Purpose |
|------|---------|
| `auth.middleware.js` | `requireAuth`: 401 if no `req.session.userId`; sets `req.userId` for downstream handlers. |
| `errorHandler.js` | Express error middleware: maps `ApiError` to status + JSON; logs unexpected errors. |
| `requestLogger.js` | Logs HTTP method and path for each request. |

---

## `src/validators/` — Request input checks

| File | Purpose |
|------|---------|
| `mood.validator.js` | `validateMoodText`: non-empty, max length. Used by `mood.controller`. |
| `auth.validator.js` | `validateSignUp` / `validateLogin`: email format, password rules. Used by `auth.controller`. |

---

## `src/models/` — Data access (PostgreSQL)

Models run SQL via `getPool()` and map rows with `rowMapper.js`. They are **not** full ORM entities.

| File | Purpose |
|------|---------|
| `User.model.js` | `findById`, `findByEmail`, `create`; `toPublic()` strips password hash from API responses. |
| `MoodHistory.model.js` | `create` mood row; `findRecentByUserId` for history list. |
| `PlaylistHistory.model.js` | `create` JSONB blob linked to `mood_history_id`; `findByMoodHistoryId` for history enrichment. |

---

## `src/constants/` — Static configuration data

| File | Purpose |
|------|---------|
| `emotions.js` | `EMOTIONS` list (app vocabulary). `EMOTION_KEYWORD_MAP`: emotion → search keyword arrays (stored in DB column `spotify_keywords`). |
| `genres.js` | `EMOTION_GENRES`: each emotion → genre definitions (`id`, `name`, `searchQuery`). `DEFAULT_GENRES` fallback. `TRACKS_PER_GENRE` (3), `ITUNES_FETCH_POOL` (50). |

---

## `src/utils/` — Shared helpers

| File | Purpose |
|------|---------|
| `rowMapper.js` | Maps SQL snake_case columns → camelCase for JSON (`spotifyKeywords`, `primaryEmotion`, etc.). |
| `logger.js` | Simple leveled console logger (`info`, `warn`, `error`). |
| `ApiError.js` | Custom error class with HTTP `statusCode` for auth and services. |
| `shuffle.js` | `shuffle()` (Fisher–Yates) and `pickRandom(items, count)` for varied track picks. |

---

## `src/services/auth/` — Authentication logic

| File | Purpose |
|------|---------|
| `auth.service.js` | `signUp`: hash password with bcrypt, create user. `logIn`: verify email/password. Throws `ApiError` on duplicate email or bad credentials. |

---

## `src/services/ml/` — ML microservice integration

| File | Purpose |
|------|---------|
| `ml.service.js` | `callMlPredict(text)` → HTTP `POST` to Python service. `getEmotionPrediction(text)`: if `USE_ML_SERVICE`, try ML; on failure or disabled, use `emotion.stub`. Returns `emotions`, `primary`, `source` (`ml` \| `stub`), `mlPredictions`. |
| `mlLabel.mapper.js` | Maps HuggingFace labels (`joy`, `fear`, …) to MoodMix emotions (`happy`, `anxious`, …). `normalizeMlPredictions()` picks primary + ranked emotions from scores. |

---

## `src/services/mood/` — Mood analysis orchestration

| File | Purpose |
|------|---------|
| `mood.service.js` | **Central orchestrator** for `POST /mood`. Runs: emotion prediction → keywords → music recommendations → optional DB save. Builds API response (`genres`, `emotionSource`, `musicSource`, etc.). |
| `emotion.stub.js` | Rule-based emotion detection from keywords in text. Fallback when ML is off or unreachable. |
| `emotion.mapper.js` | `mapEmotionsToKeywords()`: flattens `EMOTION_KEYWORD_MAP` for detected emotions. |
| `emotionGenre.mapper.js` | `pickGenresForMood()`: from `emotions` + `primary`, picks up to 3 unique genres from `EMOTION_GENRES` / `DEFAULT_GENRES`, attaches `matchedEmotion`. |

---

## `src/services/music/` — Music recommendations

| File | Purpose |
|------|---------|
| `musicRecommendations.service.js` | For each picked genre: iTunes search → shuffle pool → return `TRACKS_PER_GENRE` tracks. Sets `musicSource` (`itunes` \| `mock`) and `musicMessage`. |
| `itunes.service.js` | `searchTracks(query, limit)`: calls Apple iTunes Search API (no API key). Maps results to track objects (`name`, `artist`, `previewUrl`, `externalUrl`, …). |
| `mockGenres.service.js` | Static per-genre sample tracks when iTunes returns nothing. Uses `pickRandom` for order variety. |

---

## API endpoints (implemented)

| Method | Path | Auth | Controller |
|--------|------|------|------------|
| GET | `/health` | No | Inline in `app.js` |
| POST | `/api/v1/mood` | Yes | `mood.controller` |
| POST | `/api/v1/auth/signup` | No | `auth.controller` |
| POST | `/api/v1/auth/login` | No | `auth.controller` |
| GET | `/api/v1/auth/me` | No | `auth.controller` |
| POST | `/api/v1/auth/logout` | No | `auth.controller` |
| GET | `/api/v1/history` | Yes | `history.controller` |

---

## Environment variables

| Variable | Default / example | Used by |
|----------|-------------------|---------|
| `PORT` | `5000` | `server.js` |
| `DATABASE_URL` | `postgresql://.../moodmix` | `database.js` |
| `ML_SERVICE_URL` | `http://localhost:8000` | `ml.service.js` |
| `USE_ML_SERVICE` | `true` (set `false` for stub only) | `ml.service.js` |
| `SESSION_SECRET` | (required in prod) | `session.js` |
| `FRONTEND_URL` | `http://127.0.0.1:5173` | `app.js` CORS (production) |
| `NODE_ENV` | `development` | CORS, cookie `secure` |

---

## File count by folder (`src/`)

| Folder | Files | Role |
|--------|-------|------|
| Root `src/` | 2 | `server.js`, `app.js` |
| `config/` | 3 | Env, DB, sessions |
| `db/` | 2 | SQL schema + migration |
| `routes/` | 4 | URL mapping |
| `controllers/` | 3 | HTTP handlers |
| `middleware/` | 3 | Auth, errors, logging |
| `validators/` | 2 | Input validation |
| `models/` | 3 | PostgreSQL access |
| `constants/` | 2 | Emotions + genres data |
| `utils/` | 4 | Helpers |
| `services/auth/` | 1 | Sign up / log in |
| `services/ml/` | 2 | ML client + label map |
| `services/mood/` | 4 | Mood pipeline |
| `services/music/` | 3 | iTunes + recommendations |

**Total:** 38 files under `backend/src/` (excluding `node_modules`).

---

## What to read first (learning order)

1. `server.js` → `app.js` → `routes/index.js`
2. `controllers/mood.controller.js` → `services/mood/mood.service.js`
3. `services/ml/ml.service.js` + `services/music/musicRecommendations.service.js`
4. `models/MoodHistory.model.js` + `db/schema.sql`
5. `middleware/auth.middleware.js` + `controllers/auth.controller.js`

---

*Last updated: includes iTunes fetch-pool shuffle (`ITUNES_FETCH_POOL = 50`) and removal of legacy Spotify/mock-playlist code.*
