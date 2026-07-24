import os
from flask import Flask

from flask_cors import CORS

from routes.employee import employee_bp
from routes.attendance import attendance_bp
from routes.recognition import recognition_bp
from config import Config
app = Flask(__name__)

CORS(app)

app.register_blueprint(employee_bp)
app.register_blueprint(attendance_bp)
app.register_blueprint(recognition_bp)

os.makedirs(
    Config.UPLOAD_FOLDER,
    exist_ok=True
) 
os.makedirs(
    Config.EMBEDDING_FOLDER,
    exist_ok=True
)
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


if __name__ == "__main__":
    app.run(debug=True)