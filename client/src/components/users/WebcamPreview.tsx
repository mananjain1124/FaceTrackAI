import Webcam from "react-webcam";
import { useRef } from "react";

export default function WebcamPreview() {
  const webcamRef = useRef<Webcam>(null);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-black shadow-lg">

      <Webcam
        ref={webcamRef}
        mirrored
        audio={false}
        screenshotFormat="image/jpeg"
        className="h-[500px] w-full object-cover"
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: "user",
        }}
      />

    </div>
  );
}