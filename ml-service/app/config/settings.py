import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    ENV: str = os.getenv("ENV", "development")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    HF_MODEL_NAME: str = os.getenv(
        "HF_MODEL_NAME", "j-hartmann/emotion-english-distilroberta-base"
    )


settings = Settings()
