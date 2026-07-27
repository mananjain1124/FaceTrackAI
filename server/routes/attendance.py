import os
import uuid
import base64
from datetime import datetime

from flask import Blueprint, request, jsonify

from config import Config
from database import attendance
from ai.face_recognition import FaceRecognition

attendance_bp = Blueprint(
    "attendance",
    __name__,
    url_prefix="/api/attendance"
)

recognizer = FaceRecognition()


@attendance_bp.route("/recognize", methods=["POST"])
def recognize_employee():

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

    image_data = image.split(",")[1]

    image_bytes = base64.b64decode(image_data)

    with open(filepath, "wb") as file:
        file.write(image_bytes)

    result = recognizer.recognize(temp_folder)

    os.remove(filepath)

    if result["recognized"]:

        employee = result["employee"]

        attendance.insert_one({

            "employee_id": employee["employee_id"],

            "name": employee["name"],

            "department": employee["department"],

            "date": datetime.now().strftime("%Y-%m-%d"),

            "time": datetime.now().strftime("%H:%M:%S"),

            "status": "Present"

        })

        return jsonify({

            "success": True,

            "recognized": True,

            "employee": employee,

            "confidence": result["confidence"]

        })

    return jsonify({

        "success": True,

        "recognized": False,

        "confidence": result.get("confidence", 0)

    })