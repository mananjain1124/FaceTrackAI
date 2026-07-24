import os
from dotenv import load_dotenv

# Load environment variables
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

    # Flask Secret Key
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