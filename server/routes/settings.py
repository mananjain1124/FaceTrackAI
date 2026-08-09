from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from services import settings_service

settings_bp = Blueprint(
    "settings",
    __name__,
    url_prefix="/api/settings"
)


@settings_bp.route("", methods=["GET"])
@jwt_required()
def get_settings():
    return jsonify({
        "success": True,
        "settings": settings_service.get_all(),
    }), 200


@settings_bp.route("", methods=["PUT"])
@jwt_required()
def update_settings():
    result = settings_service.update(
        request.get_json(silent=True) or {}
    )
    return jsonify({
        "success": True,
        "message": "Settings updated successfully",
        "settings": result,
    }), 200
