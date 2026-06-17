"""
Loads the HuggingFace pipeline once at startup.
Avoids reloading the model on every /predict request.
"""

from transformers import pipeline

from app.config.settings import settings


class ModelLoader:
    """Singleton-style holder for the text-classification pipeline."""

    _pipeline = None

    @classmethod
    def load(cls) -> None:
        """Download (first run) and load the pretrained emotion model."""
        if cls._pipeline is not None:
            return

        print(f"[ML] Loading model: {settings.HF_MODEL_NAME} ...")
        cls._pipeline = pipeline(
            task="text-classification",
            model=settings.HF_MODEL_NAME,
            top_k=None,  # return scores for all emotion labels
        )
        print("[ML] Model ready.")

    @classmethod
    def get_pipeline(cls):
        if cls._pipeline is None:
            raise RuntimeError("Model not loaded. Server may still be starting.")
        return cls._pipeline

    @classmethod
    def is_loaded(cls) -> bool:
        return cls._pipeline is not None
