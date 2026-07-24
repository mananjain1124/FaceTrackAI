import cv2
import numpy as np
import os

from insightface.app import FaceAnalysis


class FaceEmbedding:

    def __init__(self):

        self.app = FaceAnalysis(
            name="buffalo_l"
        )

        self.app.prepare(
            ctx_id=0,
            det_size=(640, 640)
        )

    def generate_embedding(self, image_path):

        image = cv2.imread(image_path)

        if image is None:
            return None

        faces = self.app.get(image)

        if len(faces) == 0:
            return None

        return faces[0].embedding

    def generate_employee_embedding(
        self,
        image_folder
    ):

        embeddings = []

        for file in os.listdir(image_folder):

            if not file.lower().endswith(
                (".jpg", ".jpeg", ".png")
            ):
                continue

            path = os.path.join(
                image_folder,
                file
            )

            emb = self.generate_embedding(path)

            if emb is not None:
                embeddings.append(emb)

        if len(embeddings) == 0:
            return None

        embeddings = np.array(embeddings)

        final_embedding = np.mean(
            embeddings,
            axis=0
        )

        return final_embedding

    def save_embedding(
        self,
        embedding,
        employee_id
    ):

        os.makedirs(
            "embeddings",
            exist_ok=True
        )

        path = os.path.join(
            "embeddings",
            f"{employee_id}.npy"
        )

        np.save(
            path,
            embedding
        )

        return path