import logging
import os

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

import database
from ai.face_embedding import FaceEmbedding
from config import Config

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------
# Lazy recognizer singleton + in-memory embedding cache.
#
# `FaceRecognition` construction loads the insightface model and reading
# every `.npy` embedding from disk is expensive. The kiosk/attendance
# pages scan every 2-3 seconds, so we keep embeddings cached and only
# reload when the version counter changes. Employee mutations bump the
# counter via `invalidate_embedding_cache()`.
# ---------------------------------------------------------------------

_recognizer = None
_embeddings_version = 0


def invalidate_embedding_cache():
    global _embeddings_version
    _embeddings_version += 1


def reset_recognizer():
    global _recognizer
    _recognizer = None


def get_recognizer():
    global _recognizer
    if _recognizer is None:
        try:
            _recognizer = FaceRecognition()
        except Exception as exc:
            _recognizer = None
            raise RuntimeError(
                f"Failed to initialize face recognition model: {exc}"
            ) from exc
    return _recognizer


class FaceRecognition:

    def __init__(self, threshold=None):

        self.embedding_model = FaceEmbedding()

        self.threshold = threshold or Config.RECOGNITION_THRESHOLD

        self.employee_embeddings = []

        self.loaded_version = -1

        self.load_embeddings()

    # --------------------------------------------------
    # Load all employee embeddings from MongoDB
    # --------------------------------------------------

    def load_embeddings(self):

        global _embeddings_version

        if self.loaded_version == _embeddings_version:
            return

        self.loaded_version = _embeddings_version

        self.employee_embeddings = []

        employee_count = 0

        for employee in database.employees.find():

            employee_count += 1

            embedding_path = employee.get("embedding_path")

            if not embedding_path:
                continue

            if not os.path.exists(embedding_path):
                logger.warning("Embedding not found: %s", embedding_path)
                continue

            try:

                embedding = np.load(embedding_path)

                self.employee_embeddings.append({

                    "employee_id": employee["employee_id"],

                    "name": employee["name"],

                    "email": employee.get("email"),

                    "phone": employee.get("phone"),

                    "department": employee["department"],

                    "position": employee["position"],

                    "embedding": embedding

                })

            except Exception as e:

                logger.warning("Failed loading %s: %s", embedding_path, e)

        logger.info(
            "MongoDB Employees : %s | Embeddings Loaded : %s",
            employee_count,
            len(self.employee_embeddings),
        )

    # --------------------------------------------------
    # Recognize One Image
    # --------------------------------------------------

    def recognize(self, image_path, threshold=None):

        # Reload embeddings only if employee data changed
        self.load_embeddings()

        # Generate embedding from one image
        live_embedding = self.embedding_model.generate_embedding(
            image_path
        )

        if live_embedding is None:

            return {

                "recognized": False,

                "confidence": 0,

                "message": "No face detected"

            }

        best_employee = None

        best_score = -1

        # Compare against all employees

        for employee in self.employee_embeddings:

            score = cosine_similarity(

                [live_embedding],

                [employee["embedding"]]

            )[0][0]

            if score > best_score:

                best_score = score

                best_employee = employee

        threshold = threshold if threshold is not None else self.threshold

        if best_employee is not None:
            logger.info(
                "Best match: %s | confidence: %.4f | threshold: %s",
                best_employee["employee_id"],
                round(best_score, 4),
                threshold,
            )

        # Successful Recognition

        if (

            best_employee is not None

            and

            best_score >= threshold

        ):

            return {

                "recognized": True,

                "confidence": float(best_score),

                "employee": {

                    "employee_id": best_employee["employee_id"],

                    "name": best_employee["name"],

                    "email": best_employee["email"],

                    "phone": best_employee["phone"],

                    "department": best_employee["department"],

                    "position": best_employee["position"]

                }

            }

        # Unknown Person

        return {

            "recognized": False,

            "confidence": float(best_score),

            "message": "Unknown Person"

        }
