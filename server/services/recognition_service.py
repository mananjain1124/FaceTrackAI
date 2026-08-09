"""Recognition service: decode a camera frame, run face recognition,
and mark attendance (with duplicate-window guard).
"""

import base64
import logging
import os
import uuid
from datetime import datetime

import database
from config import Config
from errors import AppError
from services import settings_service
from ai.face_recognition import get_recognizer

logger = logging.getLogger(__name__)


def _decode_image(image):
    if not isinstance(image, str) or "," not in image:
        raise AppError("Image missing", 400)
    try:
        return base64.b64decode(image.split(",", 1)[1])
    except (ValueError, TypeError):
        raise AppError("Invalid image data", 400)


def _save_temp(image_bytes):
    os.makedirs(Config.TEMP_FOLDER, exist_ok=True)
    filename = f"{uuid.uuid4()}.jpg"
    filepath = os.path.join(Config.TEMP_FOLDER, filename)
    with open(filepath, "wb") as file:
        file.write(image_bytes)
    return filepath


def _already_marked(employee_id, date_str, window_seconds):
    existing = database.attendance.find_one({
        "employee_id": employee_id,
        "date": date_str,
    })

    if existing is None:
        return False, None

    if window_seconds <= 0:
        return True, existing

    try:
        last_record_dt = datetime.strptime(
            f"{existing['date']} {existing['time']}",
            "%Y-%m-%d %H:%M:%S",
        )
    except (ValueError, KeyError):
        return True, existing

    now = datetime.now()
    elapsed = (now - last_record_dt).total_seconds()

    return elapsed < window_seconds, existing


def recognize(image):
    image_bytes = _decode_image(image)
    filepath = _save_temp(image_bytes)

    try:
        threshold = settings_service.get(
            "recognition_threshold",
            Config.RECOGNITION_THRESHOLD,
        )
        window_seconds = settings_service.get(
            "duplicate_window_seconds",
            0,
        )

        try:
            recognizer = get_recognizer()
        except RuntimeError as exc:
            raise AppError(str(exc), 503) from exc

        result = recognizer.recognize(filepath, threshold=threshold)

        if not result["recognized"]:
            return {
                "success": True,
                "recognized": False,
                "confidence": result.get("confidence", 0),
                "message": result.get("message", "Unknown Person"),
            }

        employee = result["employee"]
        today = datetime.now().strftime("%Y-%m-%d")
        current_time = datetime.now().strftime("%H:%M:%S")

        marked, existing = _already_marked(
            employee["employee_id"],
            today,
            window_seconds,
        )

        if marked:
            return {
                "success": True,
                "recognized": True,
                "already_marked": True,
                "employee": employee,
                "confidence": result["confidence"],
                "time": existing["time"],
            }

        database.attendance.insert_one({
            "employee_id": employee["employee_id"],
            "name": employee["name"],
            "department": employee["department"],
            "position": employee.get("position"),
            "date": today,
            "time": current_time,
            "status": "Present",
        })

        return {
            "success": True,
            "recognized": True,
            "already_marked": False,
            "employee": employee,
            "confidence": result["confidence"],
            "time": current_time,
        }
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)
