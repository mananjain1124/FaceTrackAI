from flask import Blueprint, request, jsonify

from services import recognition_service

recognition_bp = Blueprint(
    "recognition",
    __name__,
    url_prefix="/api/recognition"
)


# Public health check for the recognition API.
@recognition_bp.route("/", methods=["GET"])
def home():
    return {
        "success": True,
        "message": "Recognition API Working"
    }


# Public endpoint — the unauthenticated kiosk depends on it.
@recognition_bp.route("/recognize", methods=["POST"])
def recognize():
    data = request.get_json(silent=True) or {}
    result = recognition_service.recognize(data.get("image"))
    return jsonify(result), 200
