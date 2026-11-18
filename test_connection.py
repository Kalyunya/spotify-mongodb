import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))

try:
    client.admin.command("ping")
    print("MongoDB Atlas: connection successful!")
except Exception as e:
    print("Connection error:", e)
finally:
    client.close()