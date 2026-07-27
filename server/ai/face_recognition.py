import os
import numpy as np

from sklearn.metrics.pairwise import cosine_similarity

from database import employees
from ai.face_embedding import FaceEmbedding


class FaceRecognition:

    def __init__(self):

        self.embedding_model = FaceEmbedding()

        # Similarity threshold
        self.threshold = 0.75

        self.employee_embeddings = []

        self.load_embeddings()

    # --------------------------------------------------
    # Load all employee embeddings from MongoDB
    # --------------------------------------------------

    def load_embeddings(self):

        self.employee_embeddings = []

        employee_count = 0

        for employee in employees.find():

            employee_count += 1

            embedding_path = employee.get("embedding_path")

            if not embedding_path:
                continue

            if not os.path.exists(embedding_path):
                print(f"Embedding not found: {embedding_path}")
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

                print(f"Failed loading {embedding_path}: {e}")

        print("=" * 60)
        print(f"MongoDB Employees : {employee_count}")
        print(f"Embeddings Loaded : {len(self.employee_embeddings)}")
        print("=" * 60)

    # --------------------------------------------------
    # Recognize One Image
    # --------------------------------------------------

    def recognize(self, image_path):

        # Reload latest employees
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

            print(
                f"{employee['employee_id']} -> {score:.4f}"
            )

            if score > best_score:

                best_score = score

                best_employee = employee

        print("=" * 60)

        if best_employee is not None:

            print("Best Match :", best_employee["employee_id"])

        else:

            print("Best Match : None")

        print("Confidence :", round(best_score, 4))

        print("=" * 60)

        # Successful Recognition

        if (

            best_employee is not None

            and

            best_score >= self.threshold

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