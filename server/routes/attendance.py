from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from services import attendance_service

attendance_bp = Blueprint(
    "attendance",
    __name__,
    url_prefix="/api/attendance"
)


@attendance_bp.route("/today", methods=["GET"])
@jwt_required()
def get_today():
    date_str = request.args.get("date")
    return jsonify(attendance_service.get_today(date_str)), 200


@attendance_bp.route("/summary", methods=["GET"])
@jwt_required()
def get_summary():
    result = attendance_service.summary(
        request.args.get("from"),
        request.args.get("to"),
        request.args.get("department"),
    )
    return jsonify(result), 200
