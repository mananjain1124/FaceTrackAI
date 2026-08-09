"""Employee service: registration, listing, updates, face re-registration,
and deletion (including image and embedding file cleanup).
"""

import base64
import os
import shutil
import uuid
from datetime import datetime, timezone

import database
from config import Config
from errors import AppError
from ai.face_embedding import FaceEmbedding
from ai.face_recognition import invalidate_embedding_cache

REQUIRED_FIELDS = ("id", "name", "email", "phone", "department", "position")
EDITABLE_FIELDS = ("name", "email", "phone", "department", "position")


def _decode_images(images):
    """Validate and decode a list of base64 data-URL images.

    Returns a list of raw image bytes. Raises AppError on invalid input.
    """
    if not isinstance(images, list) or len(images) == 0:
        raise AppError("At least one image is required", 400)

    decoded = []
    for image in images:
        if not isinstance(image, str) or "," not in image:
            raise AppError("Invalid image payload", 400)
        try:
            decoded.append(base64.b64decode(image.split(",", 1)[1]))
        except (ValueError, TypeError):
            raise AppError("Invalid image data", 400)

    return decoded


def _save_images(employee_id, images_bytes):
    folder = os.path.join(Config.UPLOAD_FOLDER, employee_id)
    os.makedirs(folder, exist_ok=True)

    saved = []
    for image_bytes in images_bytes:
        filename = f"{uuid.uuid4()}.jpg"
        filepath = os.path.join(folder, filename)
        with open(filepath, "wb") as file:
            file.write(image_bytes)
        saved.append(filepath)

    return folder, saved


def _generate_embedding(folder):
    embedding_model = FaceEmbedding()
    embedding = embedding_model.generate_employee_embedding(folder)

    if embedding is None:
        raise AppError("No valid face found in images", 400)

    return embedding, embedding_model


def _insert_or_throw_duplicate(employee_document):
    try:
        return database.employees.insert_one(employee_document)
    except Exception:
        # Unique index on employee_id enforces this at the DB level too.
        raise AppError(
            f"Employee with ID '{employee_document['employee_id']}' already exists",
            409,
        )


def register_employee(data):
    employee = data.get("employee") if isinstance(data, dict) else None
    images = data.get("images") if isinstance(data, dict) else None

    if not isinstance(employee, dict):
        raise AppError("Employee data missing", 400)

    missing = [
        field for field in REQUIRED_FIELDS
        if not str(employee.get(field, "")).strip()
    ]
    if missing:
        raise AppError(
            f"Missing required field(s): {', '.join(missing)}",
            400,
        )

    employee_id = str(employee["id"]).strip()

    if database.employees.find_one({"employee_id": employee_id}):
        raise AppError(
            f"Employee with ID '{employee_id}' already exists",
            409,
        )

    image_bytes = _decode_images(images)
    folder, saved_images = _save_images(employee_id, image_bytes)
    embedding, embedding_model = _generate_embedding(folder)

    embedding_path = embedding_model.save_embedding(embedding, employee_id)

    employee_document = {
        "employee_id": employee_id,
        "name": employee["name"].strip(),
        "email": employee["email"].strip(),
        "phone": employee["phone"].strip(),
        "department": employee["department"].strip(),
        "position": employee["position"].strip(),
        "image_folder": folder,
        "images": saved_images,
        "embedding_path": embedding_path,
        "created_at": datetime.now(timezone.utc),
    }

    result = _insert_or_throw_duplicate(employee_document)
    invalidate_embedding_cache()

    return {
        "success": True,
        "message": "Employee Registered Successfully",
        "employee_id": employee_id,
        "images_saved": len(saved_images),
        "embedding_path": embedding_path,
        "mongodb_id": str(result.inserted_id),
    }


def list_employees():
    employee_list = []
    for employee in database.employees.find().sort("name", 1):
        employee["_id"] = str(employee["_id"])
        employee_list.append(employee)

    return {
        "success": True,
        "count": len(employee_list),
        "employees": employee_list,
    }


def update_employee(employee_id, data):
    if not isinstance(data, dict):
        raise AppError("No JSON data received", 400)

    updates = {
        field: data.get(field)
        for field in EDITABLE_FIELDS
        if data.get(field) is not None
    }

    if not updates:
        raise AppError("No editable fields provided", 400)

    result = database.employees.update_one(
        {"employee_id": employee_id},
        {"$set": updates},
    )

    if result.matched_count == 0:
        raise AppError("Employee not found", 404)

    return {
        "success": True,
        "message": "Employee updated successfully",
    }


def re_register_face(employee_id, images):
    employee = database.employees.find_one({"employee_id": employee_id})

    if employee is None:
        raise AppError("Employee not found", 404)

    image_bytes = _decode_images(images)

    folder = os.path.join(Config.UPLOAD_FOLDER, employee_id)

    # Remove the previous images for this employee.
    old_images = employee.get("images", [])
    for path in old_images:
        if os.path.exists(path):
            os.remove(path)

    _, saved_images = _save_images(employee_id, image_bytes)
    embedding, embedding_model = _generate_embedding(folder)

    embedding_path = embedding_model.save_embedding(embedding, employee_id)

    database.employees.update_one(
        {"employee_id": employee_id},
        {
            "$set": {
                "image_folder": folder,
                "images": saved_images,
                "embedding_path": embedding_path,
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )

    invalidate_embedding_cache()

    return {
        "success": True,
        "message": "Face re-registered successfully",
        "employee_id": employee_id,
        "images_saved": len(saved_images),
        "embedding_path": embedding_path,
    }


def delete_employee(employee_id):
    employee = database.employees.find_one({"employee_id": employee_id})

    if employee is None:
        raise AppError("Employee not found", 404)

    database.employees.delete_one({"employee_id": employee_id})

    folder = employee.get("image_folder")
    if folder and os.path.isdir(folder):
        shutil.rmtree(folder, ignore_errors=True)

    embedding_path = employee.get("embedding_path")
    if embedding_path and os.path.exists(embedding_path):
        os.remove(embedding_path)

    invalidate_embedding_cache()

    return {
        "success": True,
        "message": "Employee deleted successfully",
        "employee_id": employee_id,
    }
