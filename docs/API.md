# MoodMix API Documentation

Base URL (development): `http://127.0.0.1:5000/api/v1`

The frontend typically calls `/api/v1` through the Vite proxy (`frontend/vite.config.js` → backend `:5000`).

> Pipeline and phase history: [PHASES.md](./PHASES.md) · [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Auth (session)

All auth routes use a session cookie (`moodmix.sid`). The frontend must send `credentials: 'include'` (Axios: `withCredentials: true`).

| Method | Path           | Description |
|--------|----------------|-------------|
| POST   | /auth/signup   | Create account and start session |
| POST   | /auth/login    | Log in |
| GET    | /auth/me       | Current user or `{ "user": null }` |
| POST   | /auth/logout   | Destroy session |

### `POST /auth/signup`

**Request:** `{ "email": "you@example.com", "password": "min8chars", "displayName": "Optional" }`

**Response (201):** `{ "user": { "id", "email", "displayName", "createdAt" } }`

### `POST /auth/login`

**Request:** `{ "email": "you@example.com", "password": "..." }`

**Response:** `{ "user": { ... } }`

**Errors:** `401` invalid credentials · `409` email already exists (signup)

---

## Mood

| Method | Path   | Description |
|--------|--------|-------------|
| POST   | /mood  | Analyze mood, return genre + track recommendations, save history (**requires login**) |

### `POST /mood`

**Request:**

```json
{
  "text": "I feel tired and stressed but want to focus"
}
```

**Response:**

```json
{
  "text": "I feel tired and stressed but want to focus",
  "emotions": ["anxious", "sad"],
  "primary": "anxious",
  "spotifyKeywords": ["ambient", "calming"],
  "genres": [
    {
      "id": "ambient",
      "name": "Ambient",
      "matchedEmotion": "anxious",
      "searchQuery": "calming ambient meditation",
      "tracks": [
        {
          "id": "123",
          "name": "Track title",
          "artist": "Artist",
          "imageUrl": "https://...",
          "previewUrl": "https://...",
          "externalUrl": "https://music.apple.com/..."
        }
      ]
    }
  ],
  "musicSource": "itunes",
  "musicMessage": null,
  "emotionSource": "ml",
  "mlPredictions": [
    { "label": "fear", "score": 0.45 },
    { "label": "sadness", "score": 0.28 }
  ],
  "historyId": "uuid"
}
```

| Field | Description |
|-------|-------------|
| `emotionSource` | `"ml"` = HuggingFace via ml-service; `"stub"` = rule-based fallback |
| `musicSource` | `"itunes"` = at least one genre had iTunes results; `"mock"` = sample tracks only |
| `musicMessage` | Warning when `musicSource` is `"mock"` (e.g. network/iTunes failure) |
| `mlPredictions` | Raw model scores; `null` when `emotionSource` is `"stub"` |
| `genres` | Up to 3 genres, each with up to 3 `tracks` |
| `spotifyKeywords` | Search keywords derived from emotions (legacy field name; stored in DB) |

**Backend pipeline:** `ml.service` → `mlLabel.mapper` → `emotion.mapper` → `musicRecommendations` → `itunes.service` → PostgreSQL

**Fallbacks:**

- ML unreachable or `USE_ML_SERVICE=false` → `emotion.stub.js`
- iTunes empty for a genre → `mockGenres.service.js` for that genre

**Errors:**

| Status | Body |
|--------|------|
| 400 | `{ "error": "Mood text is required" }` (validation) |
| 401 | `{ "error": "You must be logged in" }` |
| 500 | `{ "error": "...", "stack": "..." }` (dev only) |

---

## History

| Method | Path     | Description |
|--------|----------|-------------|
| GET    | /history | List mood entries for the logged-in user only |

### `GET /history`

**Response:**

```json
{
  "items": [
    {
      "id": "uuid",
      "userId": "uuid",
      "text": "I feel tired and stressed",
      "emotions": ["anxious", "calm"],
      "primaryEmotion": "anxious",
      "spotifyKeywords": ["ambient", "calming"],
      "createdAt": "2026-05-21T...",
      "updatedAt": "2026-05-21T...",
      "genres": [
        {
          "id": "ambient",
          "name": "Ambient",
          "matchedEmotion": "anxious",
          "tracks": [{ "id", "name", "artist", "imageUrl", "previewUrl", "externalUrl" }]
        }
      ],
      "playlists": [],
      "tracks": []
    }
  ]
}
```

- **`genres`** — primary music payload (saved from `POST /mood`).
- **`playlists` / `tracks`** — populated only for older JSONB shapes; usually empty.

If database is down:

```json
{
  "items": [],
  "message": "Database not connected"
}
```

**Errors:** `401` if not logged in

---

## Health

| Method | Path    | Service |
|--------|---------|---------|
| GET    | /health | Backend root (not under `/api/v1`) |

```json
{ "status": "ok", "service": "moodmix-backend" }
```

---

## ML service (called by backend, not browser)

Base URL: `http://127.0.0.1:8000` (set via `ML_SERVICE_URL`)

| Method | Path     | Description |
|--------|----------|-------------|
| GET    | /        | Health check + `model_loaded` |
| POST   | /predict | HuggingFace emotion classification |

**Request:** `{ "text": "I am so happy today" }`

**Response:** `{ "text": "...", "predictions": [{ "label": "joy", "score": 0.92 }, ...] }`

Called by `backend/src/services/ml/ml.service.js`.
