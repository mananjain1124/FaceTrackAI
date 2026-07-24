from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URI)

db = client[Config.DATABASE_NAME]

employees = db["employees"]

attendance = db["attendance"]