from fastapi import APIRouter, HTTPException

from app.schemas.predict import PredictRequest, PredictResponse, PredictionScore
from app.services.emotion_service import EmotionService
from app.services.model_loader import ModelLoader

router = APIRouter()
emotion_service = EmotionService()


@router.post("/predict", response_model=PredictResponse)
async def predict_emotions(body: PredictRequest):
    """
    Classify emotions in the user's mood text.

    Uses j-hartmann/emotion-english-distilroberta-base via HuggingFace pipeline.
    Returns raw label/score pairs from the model.
    """
    if not ModelLoader.is_loaded():
        raise HTTPException(status_code=503, detail="Model is still loading. Try again shortly.")

    result = emotion_service.predict(body.text)
    predictions = [PredictionScore(**p) for p in result["predictions"]]
    return PredictResponse(text=result["text"], predictions=predictions)
