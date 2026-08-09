import logging
import os

import cv2
import numpy as np

from insightface.app import FaceAnalysis

from config import Config

logger = logging.getLogger(__name__)


class FaceEmbedding:

    def __init__(self):

        self.app = FaceAnalysis(name="buffalo_l")

        self.app.prepare(
            ctx_id=0,
            det_size=(640, 640)
        )

    # -------------------------------------------------
    # Generate embedding from ONE image
    # -------------------------------------------------

    def generate_embedding(self, image_path):

        image = cv2.imread(image_path)

        if image is None:
            logger.warning("Could not read image: %s", image_path)
            return None

        faces = self.app.get(image)

        if len(faces) == 0:
            logger.warning("No face detected: %s", image_path)
            return None

        return faces[0].embedding

    # -------------------------------------------------
    # Generate average embedding from employee folder
    # -------------------------------------------------

    def generate_employee_embedding(self, image_folder):

        embeddings = []

        for file in os.listdir(image_folder):

            if not file.lower().endswith(
                (".jpg", ".jpeg", ".png")
            ):
                continue

            image_path = os.path.join(
                image_folder,
                file
            )

            embedding = self.generate_embedding(
                image_path
            )

            if embedding is not None:
                embeddings.append(embedding)

        if len(embeddings) == 0:
            return None

        embeddings = np.array(embeddings)

        return np.mean(
            embeddings,
            axis=0
        )

    # -------------------------------------------------
    # Generate embedding from live camera image
    # -------------------------------------------------

    def generate_live_embedding(self, image_path):

        return self.generate_embedding(image_path)

    # -------------------------------------------------
    # Save embedding
    # -------------------------------------------------

    def save_embedding(
        self,
        embedding,
        employee_id
    ):

        os.makedirs(
            Config.EMBEDDING_FOLDER,
            exist_ok=True
        )

        path = os.path.join(
            Config.EMBEDDING_FOLDER,
            f"{employee_id}.npy"
        )

        np.save(
            path,
            embedding
        )

        return path
