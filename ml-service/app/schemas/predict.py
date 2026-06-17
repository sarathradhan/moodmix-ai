from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    """POST /predict body — mood text from the user."""

    text: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="User mood sentence, e.g. 'I feel tired and stressed'",
        json_schema_extra={"example": "I feel tired and stressed but want to focus"},
    )


class PredictionScore(BaseModel):
    """One label + confidence score from the HuggingFace model."""

    label: str
    score: float


class PredictResponse(BaseModel):
    """Raw model output wrapped with the input text."""

    text: str
    predictions: list[PredictionScore]
