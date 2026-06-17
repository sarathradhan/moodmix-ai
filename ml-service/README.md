# MoodMix ML Service

FastAPI microservice that classifies emotions in mood text using a pretrained HuggingFace model.

**Model:** [`j-hartmann/emotion-english-distilroberta-base`](https://huggingface.co/j-hartmann/emotion-english-distilroberta-base)

**Labels:** `anger`, `disgust`, `fear`, `joy`, `neutral`, `sadness`, `surprise`

---

## Project structure (what each file does)

```
ml-service/
├── app/
│   ├── main.py                 # FastAPI app, CORS, loads model on startup
│   ├── config/
│   │   └── settings.py         # Env vars (PORT, HF_MODEL_NAME)
│   ├── routes/
│   │   ├── health.py           # GET / — health + model_loaded flag
│   │   └── predict.py          # POST /predict — emotion classification
│   ├── schemas/
│   │   └── predict.py          # Pydantic request/response models
│   └── services/
│       ├── model_loader.py     # Loads HuggingFace pipeline once
│       ├── huggingface_service.py  # Runs inference (raw pipeline output)
│       └── emotion_service.py  # Thin layer between route and HF service
├── requirements.txt
├── .env.example
└── README.md
```

| File | Role |
|------|------|
| `main.py` | Creates the app; `lifespan` calls `ModelLoader.load()` before accepting requests |
| `model_loader.py` | `transformers.pipeline("text-classification", ...)` — expensive, run once |
| `huggingface_service.py` | `classifier(text)` → list of `{label, score}` |
| `emotion_service.py` | Wraps raw output as `{ text, predictions }` |
| `predict.py` (route) | Validates body with Pydantic, returns JSON |
| `schemas/predict.py` | Documents API shape; validates `text` length |

---

## Required pip installs

From the `ml-service` folder (with venv activated):

```bash
pip install -r requirements.txt
```

Main packages:

| Package | Purpose |
|---------|---------|
| `fastapi` | Web API framework |
| `uvicorn` | ASGI server |
| `pydantic` | Request/response validation |
| `transformers` | HuggingFace models + `pipeline` |
| `torch` | Backend for the model (CPU is fine) |

**First run:** the model weights download from HuggingFace (~300MB). Later starts are faster.

---

## Environment

```bash
cp .env.example .env
```

Optional overrides in `.env`:

```env
HF_MODEL_NAME=j-hartmann/emotion-english-distilroberta-base
PORT=8000
```

---

## Run the server

```bash
cd ml-service
python -m venv venv

# Windows Git Bash
source venv/Scripts/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Wait until you see:

```text
[ML] Loading model: j-hartmann/emotion-english-distilroberta-base ...
[ML] Model ready.
```

---

## API endpoints

### `GET /`

Health check.

```bash
curl http://127.0.0.1:8000/
```

```json
{
  "status": "ok",
  "service": "moodmix-ml",
  "model_loaded": true
}
```

### `POST /predict`

```bash
curl -X POST http://127.0.0.1:8000/predict \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"I feel tired and stressed but want to focus\"}"
```

**Example response (raw model scores):**

```json
{
  "text": "I feel tired and stressed but want to focus",
  "predictions": [
    { "label": "fear", "score": 0.42 },
    { "label": "sadness", "score": 0.31 },
    { "label": "neutral", "score": 0.12 },
    { "label": "joy", "score": 0.05 },
    { "label": "anger", "score": 0.04 },
    { "label": "surprise", "score": 0.03 },
    { "label": "disgust", "score": 0.02 }
  ]
}
```

### Interactive docs

- Swagger UI: http://127.0.0.1:8000/docs  
- ReDoc: http://127.0.0.1:8000/redoc  

---

## Notes

- No database or Spotify logic in this service (by design).
- The Node backend can call `POST /predict` when you wire Phase 3 (`backend/src/services/ml/ml.service.js`).
- CPU inference is supported; GPU is optional and not required.
