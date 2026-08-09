"""Authentication service: admin signup / login."""

from datetime import datetime, timezone

from werkzeug.security import (
    generate_password_hash,
    check_password_hash,
)
from flask_jwt_extended import create_access_token

import database
from errors import AppError


def signup(email, password):
    email = (email or "").strip().lower()
    password = password or ""

    if not email or not password:
        raise AppError("Email and password are required", 400)

    if database.admins.find_one({"email": email}):
        raise AppError(
            "Admin with this email already exists.",
            400,
        )

    admin_document = {
        "email": email,
        "password": generate_password_hash(password),
        "role": "admin",
        "created_at": datetime.now(timezone.utc),
    }

    database.admins.insert_one(admin_document)

    return {
        "success": True,
        "message": "Admin created successfully.",
        "email": email,
    }


def login(email, password):
    email = (email or "").strip().lower()
    password = password or ""

    if not email or not password:
        raise AppError("Email and password are required", 400)

    admin = database.admins.find_one({"email": email})

    if not admin or not check_password_hash(admin["password"], password):
        raise AppError("Invalid email or password", 401)

    access_token = create_access_token(identity=email)

    return {
        "success": True,
        "message": "Login successful",
        "token": access_token,
        "admin": {
            "email": admin["email"],
            "role": admin.get("role", "admin"),
        },
    }
