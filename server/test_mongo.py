from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["facetrack_ai"]

print("Connected successfully!")
print(db.list_collection_names())