"""
MoodMix ML Service — FastAPI entry point.

Run with:
  uvicorn app.main:app --reload --port 8000
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.routes import health, predict
from app.services.model_loader import ModelLoader


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the HuggingFace model once when the server starts."""
    ModelLoader.load()
    yield
    # Shutdown cleanup (optional for this phase)


app = FastAPI(
    title="MoodMix ML Service",
    description="Emotion classification API using HuggingFace Transformers",
    version="0.2.0",
    lifespan=lifespan,
)

# Allow the Node.js backend to call this service during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes: GET /  and  POST /predict
app.include_router(health.router, tags=["Health"])
app.include_router(predict.router, tags=["Predict"])
