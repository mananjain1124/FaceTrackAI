import Webcam from "react-webcam";
import { RefObject } from "react";

import FaceMeshOverlay from "./FaceMeshOverlay";

interface Props {
  webcamRef: RefObject<Webcam | null>;
  landmarks: any[];
  quality: {
    centered: boolean;
    tooClose: boolean;
    tooFar: boolean;
  };
  onCameraReady: () => void;
}

export default function CameraView({
  webcamRef,
  landmarks,
  quality,
  onCameraReady,
}: Props) {
  const borderColor = () => {
    if (!landmarks.length) return "border-red-500";

    if (quality.tooClose || quality.tooFar)
      return "border-yellow-500";

    if (quality.centered)
      return "border-green-500";

    return "border-blue-500";
  };

  return (
    <div className="rounded-2xl bg-white shadow-xl border p-5">

      <div className="mb-4 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold">
            Live Camera
          </h2>

          <p className="text-slate-500 text-sm">
            Align your face inside the guide
          </p>

        </div>

        <div className="flex items-center gap-2">

          <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />

          <span className="text-sm font-medium">
            Camera Live
          </span>

        </div>

      </div>

      <div className="relative overflow-hidden rounded-xl">

        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored
          screenshotFormat="image/jpeg"
          onUserMedia={onCameraReady}
          videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: "user",
          }}
          className="w-full h-[460px] rounded-xl object-cover bg-black"
        />

        {/* Dark Overlay */}

        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        {/* Face Guide */}

        <div
          className={`
          absolute
          left-1/2
          top-1/2
          h-72
          w-72
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border-[5px]
          transition-all
          duration-300
          ${borderColor()}
        `}
        />

        {/* Corner Guides */}

        <div className="absolute left-6 top-6 h-8 w-8 border-l-4 border-t-4 border-white rounded-tl-lg" />

        <div className="absolute right-6 top-6 h-8 w-8 border-r-4 border-t-4 border-white rounded-tr-lg" />

        <div className="absolute left-6 bottom-6 h-8 w-8 border-l-4 border-b-4 border-white rounded-bl-lg" />

        <div className="absolute right-6 bottom-6 h-8 w-8 border-r-4 border-b-4 border-white rounded-br-lg" />

        {/* Face Mesh */}

        {landmarks.length > 0 && (
          <FaceMeshOverlay
            landmarks={landmarks}
          />
        )}

      </div>

      {/* Camera Status */}

      <div className="mt-5 grid grid-cols-3 gap-4">

        <div className="rounded-xl bg-slate-50 p-4 text-center">

          <p className="text-sm text-slate-500">
            Face
          </p>

          <p className="mt-1 font-bold text-lg">

            {landmarks.length > 0
              ? "Detected"
              : "Searching"}

          </p>

        </div>

        <div className="rounded-xl bg-slate-50 p-4 text-center">

          <p className="text-sm text-slate-500">
            Position
          </p>

          <p className="mt-1 font-bold text-lg">

            {quality.centered
              ? "Centered"
              : "Adjust"}

          </p>

        </div>

        <div className="rounded-xl bg-slate-50 p-4 text-center">

          <p className="text-sm text-slate-500">
            Camera
          </p>

          <p className="mt-1 font-bold text-lg text-green-600">
            Ready
          </p>

        </div>

      </div>

    </div>
  );
}