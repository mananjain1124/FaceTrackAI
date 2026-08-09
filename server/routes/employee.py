from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from services import employee_service

employee_bp = Blueprint(
    "employee",
    __name__,
    url_prefix="/api/employees"
)


@employee_bp.route("/register", methods=["POST"])
@jwt_required()
def register_employee():
    result = employee_service.register_employee(
        request.get_json(silent=True) or {}
    )
    return jsonify(result), 201


@employee_bp.route("", methods=["GET"])
@jwt_required()
def get_all_employees():
    return jsonify(employee_service.list_employees()), 200


@employee_bp.route("/<employee_id>", methods=["PUT"])
@jwt_required()
def update_employee(employee_id):
    result = employee_service.update_employee(
        employee_id,
        request.get_json(silent=True) or {},
    )
    return jsonify(result), 200


@employee_bp.route("/<employee_id>/face", methods=["PUT"])
@jwt_required()
def re_register_face(employee_id):
    result = employee_service.re_register_face(
        employee_id,
        (request.get_json(silent=True) or {}).get("images"),
    )
    return jsonify(result), 200


@employee_bp.route("/<employee_id>", methods=["DELETE"])
@jwt_required()
def delete_employee(employee_id):
    result = employee_service.delete_employee(employee_id)
    return jsonify(result), 200
