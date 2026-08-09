from flask import Blueprint, request, jsonify

from services import auth_service

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


@auth_bp.route("/signup", methods=["POST"])
def signup_admin():
    data = request.get_json(silent=True) or {}
    result = auth_service.signup(
        data.get("email"),
        data.get("password"),
    )
    return jsonify(result), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    result = auth_service.login(
        data.get("email"),
        data.get("password"),
    )
    return jsonify(result), 200
