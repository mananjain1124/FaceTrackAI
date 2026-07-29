import os
from pymongo import MongoClient

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://localhost:27017/facetrack"
)

client = MongoClient(MONGO_URI)

db = client["facetrack"]

employees = db["employees"]
attendance = db["attendance"]