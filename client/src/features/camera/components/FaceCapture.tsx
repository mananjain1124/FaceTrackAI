import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

import useFaceLandmarker from "../hooks/useFaceLandmarker";

import CameraView from "./CameraView";
import RegistrationSteps from "./RegistrationSteps";
import FaceStatus from "./FaceStatus";
import CaptureProgress from "./CaptureProgress";

import { checkFaceQuality } from "../utils/faceQuality";
import { detectBlink } from "../utils/blinkDetector";
import { detectHeadPose } from "../utils/headPose";

interface FaceCaptureProps {
  onComplete: (images: string[]) => void;
}

const TOTAL_IMAGES = 15;

export default function FaceCapture({
  onComplete,
}: FaceCaptureProps) {

  const webcamRef = useRef<Webcam>(null);

  const { ready, landmarkerRef } = useFaceLandmarker();

  const [cameraReady, setCameraReady] = useState(false);

  const [landmarks, setLandmarks] = useState<any[]>([]);

  const [images, setImages] = useState<string[]>([]);

  const [capturing, setCapturing] = useState(false);

  const [blinked, setBlinked] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);

  const [headPose, setHeadPose] = useState<
    "CENTER" | "LEFT" | "RIGHT" | "UP" | "DOWN"
  >("CENTER");

  const [quality, setQuality] = useState({
    centered: false,
    tooClose: false,
    tooFar: false,
    stable: false,
  });

  useEffect(() => {

    if (!ready) return;

    if (!cameraReady) return;

    let animationId: number;

    const detect = () => {

      const video = webcamRef.current?.video;
      const landmarker = landmarkerRef.current;

      if (
        !video ||
        !landmarker ||
        video.readyState !== 4
      ) {
        animationId = requestAnimationFrame(detect);
        return;
      }

      try {

        const result = landmarker.detectForVideo(
          video,
          performance.now()
        );

        if (result.faceLandmarks.length > 0) {

          const face = result.faceLandmarks[0];

          setLandmarks(face);

          const q = checkFaceQuality(
            face,
            video.videoWidth,
            video.videoHeight
          );

          setQuality(q);

          const pose = detectHeadPose(face);

          setHeadPose(pose);

          const blink = detectBlink(
            result.faceBlendshapes
          );

          // --------------------
          // Step 1
          // --------------------

          if (currentStep === 1) {
            setCurrentStep(2);
          }

          // --------------------
          // Step 2
          // --------------------

          if (
            currentStep === 2 &&
            q.centered &&
            !q.tooClose &&
            !q.tooFar
          ) {
            setCurrentStep(3);
          }

          // --------------------
          // Step 3
          // --------------------

          if (
            currentStep === 3 &&
            blink &&
            !blinked
          ) {
            setBlinked(true);
            setCurrentStep(4);
          }

          // --------------------
          // Step 4
          // --------------------

          if (
            currentStep === 4 &&
            pose === "LEFT"
          ) {
            setCurrentStep(5);
          }

          // --------------------
          // Step 5
          // --------------------

          if (
            currentStep === 5 &&
            pose === "RIGHT"
          ) {
            setCurrentStep(6);
          }

          // --------------------
          // Step 6
          // --------------------

          if (
            currentStep === 6 &&
            pose === "UP"
          ) {
            setCurrentStep(7);
          }

          // --------------------
          // Step 7
          // --------------------

          if (
            currentStep === 7 &&
            pose === "DOWN"
          ) {
            setCurrentStep(8);
            setCapturing(true);
          }

        } else {

          setLandmarks([]);

          setHeadPose("CENTER");

          setQuality({
            centered: false,
            tooClose: false,
            tooFar: false,
            stable: false,
          });

        }

      } catch (err) {

        console.error(err);

      }

      animationId = requestAnimationFrame(detect);

    };

    detect();

    return () =>
      cancelAnimationFrame(animationId);

  }, [
    ready,
    cameraReady,
    currentStep,
    blinked,
  ]);

    // ---------------------------------
  // Capture Single Image
  // ---------------------------------

  const captureImage = () => {

    const image = webcamRef.current?.getScreenshot();

    if (!image) return;

    setImages((prev) => {

      if (prev.length >= TOTAL_IMAGES)
        return prev;

      return [...prev, image];

    });

  };

  // ---------------------------------
  // Auto Capture Images
  // ---------------------------------

  useEffect(() => {

    if (!capturing) return;

    if (images.length >= TOTAL_IMAGES)
      return;

    const timer = setInterval(() => {

      captureImage();

    }, 300);

    return () => clearInterval(timer);

  }, [capturing, images]);

  // ---------------------------------
  // Step 9 & 10
  // ---------------------------------

  useEffect(() => {

    if (images.length !== TOTAL_IMAGES)
      return;

    setCapturing(false);

    setCurrentStep(9);

    const timer = setTimeout(() => {

      setCurrentStep(10);

      onComplete(images);

    }, 2000);

    return () => clearTimeout(timer);

  }, [images, onComplete]);

  // ---------------------------------
  // Current Instruction
  // ---------------------------------

  const instruction = () => {

    switch (currentStep) {

      case 1:
        return "Detecting Face...";

      case 2:
        return "Center your face";

      case 3:
        return "Blink once";

      case 4:
        return "Turn your head LEFT";

      case 5:
        return "Turn your head RIGHT";

      case 6:
        return "Look UP";

      case 7:
        return "Look DOWN";

      case 8:
        return "Capturing Images...";

      case 9:
        return "Generating Face Embeddings...";

      case 10:
        return "Registration Complete";

      default:
        return "";

    }

  };

  // ---------------------------------
  // Progress Percentage
  // ---------------------------------

  const progress = Math.round(
    (images.length / TOTAL_IMAGES) * 100
  );
    return (

    <div className="flex flex-col h-full gap-6">

      {/* ========================= */}
      {/* Main Layout */}
      {/* ========================= */}

      <div className="grid grid-cols-12 gap-6 flex-1">

        {/* ------------------------ */}
        {/* Camera */}
        {/* ------------------------ */}

        <div className="col-span-8">

          <CameraView
            webcamRef={webcamRef}
            landmarks={landmarks}
            quality={quality}
            onCameraReady={() =>
              setCameraReady(true)
            }
          />

        </div>

        {/* ------------------------ */}
        {/* Registration Steps */}
        {/* ------------------------ */}

        <div className="col-span-4 max-h-[700px] overflow-y-auto">

          <RegistrationSteps
            currentStep={currentStep}
          />

        </div>

      </div>

      {/* ========================= */}
      {/* Status Card */}
      {/* ========================= */}

      <FaceStatus

        currentStep={currentStep}

        instruction={instruction()}

        headPose={headPose}

        blinked={blinked}

        quality={quality}

      />

      {/* ========================= */}
      {/* Capture Progress */}
      {/* ========================= */}

      <CaptureProgress

        current={images.length}

        total={TOTAL_IMAGES}

        progress={progress}

      />
          </div>

  );

}