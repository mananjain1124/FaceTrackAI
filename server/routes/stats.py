from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from services import stats_service

stats_bp = Blueprint(
    "stats",
    __name__,
    url_prefix="/api/stats"
)


@stats_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def get_dashboard_stats():
    return jsonify(stats_service.dashboard_stats()), 200
