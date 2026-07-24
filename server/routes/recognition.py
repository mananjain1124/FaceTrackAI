from flask import Blueprint

recognition_bp = Blueprint(
    "recognition",
    __name__,
    url_prefix="/api/recognition"
)


@recognition_bp.route("/")
def recognition():

    return {
        "message": "Recognition API Working"
    }