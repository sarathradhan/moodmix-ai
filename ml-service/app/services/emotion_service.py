"""
Thin service layer between the API route and HuggingFace inference.
Keeps routes clean and easy to test.
"""

from app.services.huggingface_service import HuggingFaceService


class EmotionService:
    def __init__(self):
        self._hf = HuggingFaceService()

    def predict(self, text: str) -> dict:
        predictions = self._hf.predict(text.strip())
        return {
            "text": text,
            "predictions": predictions,
        }
