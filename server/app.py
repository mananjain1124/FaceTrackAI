import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from errors import AppError

import database


def create_app():
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = Config.SECRET_KEY

    CORS(app)
    JWTManager(app)

    # Initialize MongoDB and indexes.
    database.init_db()
    database.create_indexes()

    # Create required folders.
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(Config.EMBEDDING_FOLDER, exist_ok=True)
    os.makedirs(Config.TEMP_FOLDER, exist_ok=True)

    # Register Blueprints
    from routes.auth import auth_bp
    from routes.employee import employee_bp
    from routes.attendance import attendance_bp
    from routes.recognition import recognition_bp
    from routes.settings import settings_bp
    from routes.stats import stats_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(employee_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(recognition_bp)
    app.register_blueprint(settings_bp)
    app.register_blueprint(stats_bp)

    # -----------------------------------------
    # Error handlers
    # -----------------------------------------

    @app.errorhandler(AppError)
    def handle_app_error(error):
        return jsonify({
            "success": False,
            "message": error.message,
        }), error.status_code

    @app.errorhandler(404)
    def handle_404(error):
        return jsonify({
            "success": False,
            "message": "Resource not found",
        }), 404

    @app.errorhandler(500)
    def handle_500(error):
        app.logger.exception(error)
        return jsonify({
            "success": False,
            "message": "Internal server error",
        }), 500

    @app.route("/")
    def home():
        return {
            "project": "FaceTrackAI",
            "status": "Running"
        }

    @app.route("/health")
    def health():
        return {
            "server": "OK"
        }

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
