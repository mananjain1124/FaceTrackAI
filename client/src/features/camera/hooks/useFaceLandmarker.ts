import { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

export default function useFaceLandmarker() {
  const landmarkerRef = useRef<FaceLandmarker | null>(null);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        console.log("Loading Face Landmarker...");

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );

        landmarkerRef.current =
          await FaceLandmarker.createFromOptions(
            vision,
            {
              baseOptions: {
                modelAssetPath:
                  "/models/face_landmarker.task",
              },

              runningMode: "VIDEO",

              numFaces: 1,

              outputFaceBlendshapes: true,

              outputFacialTransformationMatrixes: true,
            }
          );

        console.log("Face Landmarker Ready");

        setReady(true);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return {
  landmarkerRef,
  ready,
};
}
