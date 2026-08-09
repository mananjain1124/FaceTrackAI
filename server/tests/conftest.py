import os
import tempfile

os.environ["MONGO_URI"] = "mongodb://localhost/"
os.environ["DATABASE_NAME"] = "test_facetrack"
os.environ["SECRET_KEY"] = "test_secret_key_min_32_bytes_long!"
os.environ["UPLOAD_FOLDER"] = tempfile.mkdtemp()
os.environ["EMBEDDING_FOLDER"] = tempfile.mkdtemp()
os.environ["TEMP_FOLDER"] = tempfile.mkdtemp()

import mongomock
import pytest

import database

database.MongoClient = mongomock.MongoClient

from services import settings_service


@pytest.fixture
def client():
    database.init_db()
    database.create_indexes()

    from app import create_app
    flask_app = create_app()

    with flask_app.test_client() as test_client:
        yield test_client

    if database.db is not None:
        database.db.client.drop_database(database.db.name)

    settings_service._cache = None


@pytest.fixture
def auth_token(client):
    client.post("/api/auth/signup", json={
        "email": "admin@test.com",
        "password": "password123",
    })
    resp = client.post("/api/auth/login", json={
        "email": "admin@test.com",
        "password": "password123",
    })
    return resp.get_json()["token"]


@pytest.fixture
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}
