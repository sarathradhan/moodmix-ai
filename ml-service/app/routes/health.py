from fastapi import APIRouter

from app.services.model_loader import ModelLoader

router = APIRouter()


@router.get("/")
async def health_check():
    """
    Health check — confirms the API is running.
    Also reports whether the HuggingFace model finished loading.
    """
    return {
        "status": "ok",
        "service": "moodmix-ml",
        "model_loaded": ModelLoader.is_loaded(),
    }
