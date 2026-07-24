from flask import Blueprint

attendance_bp = Blueprint(
    "attendance",
    __name__,
    url_prefix="/api/attendance"
)


@attendance_bp.route("/")
def attendance():

    return {
        "message": "Attendance API Working"
    }