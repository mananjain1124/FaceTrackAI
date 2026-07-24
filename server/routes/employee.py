import os
import base64
import uuid
from datetime import datetime

from flask import Blueprint, request, jsonify

from database import employees
from config import Config
from ai.face_embedding import FaceEmbedding

employee_bp = Blueprint(
    "employee",
    __name__,
    url_prefix="/api/employees"
)


@employee_bp.route("/register", methods=["POST"])
def register_employee():

    print("Content-Type:", request.content_type)
    print("Raw Data:", request.data)

    data = request.get_json(force=True)

    print("Parsed Data:", data)

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received"
        }), 400

    employee = data.get("employee")
    images = data.get("images")

    if employee is None:
        return jsonify({
            "success": False,
            "message": "Employee data missing"
        }), 400

    if images is None:
        return jsonify({
            "success": False,
            "message": "Images missing"
        }), 400

    print("=" * 60)
    print("New Employee Registration")
    print("Employee ID :", employee["id"])
    print("Name        :", employee["name"])
    print("Email       :", employee["email"])
    print("Department  :", employee["department"])
    print("Position    :", employee["position"])
    print("Images      :", len(images))
    print("=" * 60)

    employee_id = employee["id"]

    folder = os.path.join(
        Config.UPLOAD_FOLDER,
        employee_id
    )

    os.makedirs(folder, exist_ok=True)

    saved_images = []

    # ----------------------------
    # Save Images
    # ----------------------------

    for image in images:

        image_data = image.split(",")[1]

        image_bytes = base64.b64decode(image_data)

        filename = f"{uuid.uuid4()}.jpg"

        filepath = os.path.join(
            folder,
            filename
        )

        with open(filepath, "wb") as file:
            file.write(image_bytes)

        saved_images.append(filepath)

    print(f"Saved {len(saved_images)} images")

    # ----------------------------
    # Generate Embedding
    # ----------------------------

    print("Generating Face Embedding...")

    embedding_model = FaceEmbedding()

    embedding = embedding_model.generate_employee_embedding(folder)

    if embedding is None:

        return jsonify({
            "success": False,
            "message": "No valid face found in images"
        }), 400

    embedding_path = embedding_model.save_embedding(
        embedding,
        employee_id
    )

    print("Embedding Saved :", embedding_path)

    # ----------------------------
    # Save Employee to MongoDB
    # ----------------------------

    employee_document = {

        "employee_id": employee["id"],
        "name": employee["name"],
        "email": employee["email"],
        "phone": employee["phone"],
        "department": employee["department"],
        "position": employee["position"],

        "image_folder": folder,
        "images": saved_images,

        "embedding_path": embedding_path,

        "created_at": datetime.utcnow()

    }

    result = employees.insert_one(employee_document)

    print("MongoDB Inserted ID :", result.inserted_id)

    print("=" * 60)
    print("Employee Registration Completed Successfully")
    print("=" * 60)

    return jsonify({

        "success": True,
        "message": "Employee Registered Successfully",

        "employee_id": employee_id,

        "images_saved": len(saved_images),

        "embedding_path": embedding_path,

        "mongodb_id": str(result.inserted_id)

    }), 201
@employee_bp.route("", methods=["GET"])
def get_all_employees():

    try:

        employee_list = []

        for employee in employees.find():

            employee["_id"] = str(employee["_id"])

            employee_list.append(employee)

        return jsonify({
            "success": True,
            "count": len(employee_list),
            "employees": employee_list
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@employee_bp.route("/<employee_id>", methods=["PUT"])
def update_employee(employee_id):

    print("=" * 60)
    print("UPDATE API CALLED")
    print("Employee ID:", employee_id)

    print("Content-Type:", request.content_type)
    print("Headers:", request.headers)
    print("Raw Body:", request.data)

    data = request.get_json(force=True)

    print("Parsed JSON:", data)

    if not data:
        return jsonify({
            "success": False,
            "message": "No JSON data received"
        }), 400

    result = employees.update_one(
        {"employee_id": employee_id},
        {
            "$set": {
                "name": data.get("name"),
                "email": data.get("email"),
                "phone": data.get("phone"),
                "department": data.get("department"),
                "position": data.get("position")
            }
        }
    )

    print("Matched:", result.matched_count)
    print("Modified:", result.modified_count)

    if result.matched_count == 0:
        return jsonify({
            "success": False,
            "message": "Employee not found"
        }), 404

    return jsonify({
        "success": True,
        "message": "Employee updated successfully"
    }), 200