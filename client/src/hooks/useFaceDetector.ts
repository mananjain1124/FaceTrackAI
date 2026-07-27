import { useEffect, useRef, useState } from "react";

import {
  FaceDetector,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

export default function useFaceDetector() {
  const detectorRef = useRef<FaceDetector | null>(null);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadDetector();
  }, []);

  const loadDetector = async () => {
    try {
      console.log("Loading Face Detector...");

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      detectorRef.current = await FaceDetector.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "/models/blaze_face_short_range.tflite",
          },

          runningMode: "VIDEO",

          minDetectionConfidence: 0.6,
        }
      );

      console.log("Face Detector Ready");

      setReady(true);
    } catch (err) {
      console.error(err);
    }
  };

  const detect = (
    video: HTMLVideoElement
  ) => {
    if (!detectorRef.current)
      return [];

    const result =
      detectorRef.current.detectForVideo(
        video,
        performance.now()
      );

    return result.detections || [];
  };

  return {
    ready,
    detect,
  };
}