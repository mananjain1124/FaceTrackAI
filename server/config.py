import os
from dotenv import load_dotenv

load_dotenv()


class Config:

    # MongoDB
    MONGO_URI = os.getenv(
        "MONGO_URI",
        "mongodb://localhost:27017/"
    )

    DATABASE_NAME = os.getenv(
        "DATABASE_NAME",
        "facetrackai"
    )

    # Flask JWT Secret Key
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "facetrackai_secret"
    )

    # Base Directory
    BASE_DIR = os.path.dirname(
        os.path.abspath(__file__)
    )

    # Upload Folder
    UPLOAD_FOLDER = os.path.join(
        BASE_DIR,
        "uploads",
        "employees"
    )

    # Embedding Folder
    EMBEDDING_FOLDER = os.path.join(
        BASE_DIR,
        "embeddings"
    )

    # Temp Folder
    TEMP_FOLDER = os.path.join(
        BASE_DIR,
        "temp"
    )

    # Default Settings
    RECOGNITION_THRESHOLD = float(
        os.getenv("RECOGNITION_THRESHOLD", "0.75")
    )

    WORK_START_HOUR = int(
        os.getenv("WORK_START_HOUR", "9")
    )

    WORK_END_HOUR = int(
        os.getenv("WORK_END_HOUR", "18")
    )

    ORG_NAME = os.getenv(
        "ORG_NAME",
        "FaceTrackAI"
    )
