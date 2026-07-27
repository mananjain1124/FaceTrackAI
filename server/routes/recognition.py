import os
import uuid
import base64
from datetime import datetime

from flask import Blueprint, request, jsonify

from config import Config
from database import attendance
from ai.face_recognition import FaceRecognition

recognition_bp = Blueprint(
    "recognition",
    __name__,
    url_prefix="/api/recognition"
)

recognizer = FaceRecognition()


# ---------------------------------------------------------
# API Check
# ---------------------------------------------------------

@recognition_bp.route("/", methods=["GET"])
def home():

    return {
        "success": True,
        "message": "Recognition API Working"
    }


# ---------------------------------------------------------
# Face Recognition API
# ---------------------------------------------------------

@recognition_bp.route("/recognize", methods=["POST"])
def recognize():

    # ----------------------------
    # Receive Request
    # ----------------------------

    data = request.get_json()

    if not data:

        return jsonify({

            "success": False,

            "message": "No data received"

        }), 400

    image = data.get("image")

    if image is None:

        return jsonify({

            "success": False,

            "message": "Image missing"

        }), 400

    # ----------------------------
    # Create Temp Folder
    # ----------------------------

    temp_folder = os.path.join(
        Config.BASE_DIR,
        "temp"
    )

    os.makedirs(
        temp_folder,
        exist_ok=True
    )

    filename = f"{uuid.uuid4()}.jpg"

    filepath = os.path.join(
        temp_folder,
        filename
    )

    # ----------------------------
    # Save Image
    # ----------------------------

    image_data = image.split(",")[1]

    image_bytes = base64.b64decode(image_data)

    with open(filepath, "wb") as file:
        file.write(image_bytes)

    # ----------------------------
    # Face Recognition
    # ----------------------------

    result = recognizer.recognize(filepath)

    # Delete temp image

    if os.path.exists(filepath):
        os.remove(filepath)

    # ----------------------------
    # Unknown Person
    # ----------------------------

    if not result["recognized"]:

        return jsonify({

            "success": True,

            "recognized": False,

            "confidence": result.get("confidence", 0),

            "message": result.get(
                "message",
                "Unknown Person"
            )

        })

    # ----------------------------
    # Employee Found
    # ----------------------------

    employee = result["employee"]

    today = datetime.now().strftime("%Y-%m-%d")

    current_time = datetime.now().strftime("%H:%M:%S")

    # ----------------------------
    # Prevent Duplicate Attendance
    # ----------------------------

    existing = attendance.find_one({

        "employee_id": employee["employee_id"],

        "date": today

    })

    if existing:

        return jsonify({

            "success": True,

            "recognized": True,

            "already_marked": True,

            "employee": employee,

            "confidence": result["confidence"],

            "time": existing["time"]

        })

    # ----------------------------
    # Save Attendance
    # ----------------------------

    attendance.insert_one({

        "employee_id": employee["employee_id"],

        "name": employee["name"],

        "department": employee["department"],

        "position": employee["position"],

        "date": today,

        "time": current_time,

        "status": "Present"

    })

    # ----------------------------
    # Response
    # ----------------------------

    return jsonify({

        "success": True,

        "recognized": True,

        "already_marked": False,

        "employee": employee,

        "confidence": result["confidence"],

        "time": current_time

    })