"""
Runs inference using the HuggingFace text-classification pipeline.
Returns raw label + score output from the model (no extra mapping).
"""

from app.services.model_loader import ModelLoader


class HuggingFaceService:
    def predict(self, text: str) -> list[dict]:
        """
        Classify emotion in the given text.

        Returns the pipeline's raw output, e.g.:
        [
          {"label": "joy", "score": 0.82},
          {"label": "sadness", "score": 0.05},
          ...
        ]
        """
        classifier = ModelLoader.get_pipeline()
        result = classifier(text)

        # pipeline may return a single list or nested list depending on input
        if isinstance(result, list) and result and isinstance(result[0], list):
            return result[0]
        return result
