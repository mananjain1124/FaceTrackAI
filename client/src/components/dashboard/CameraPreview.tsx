import { Camera, ScanFace } from "lucide-react";

export default function CameraPreview() {
  return (
    <div className="bg-white rounded-3xl shadow-lg border p-6 h-[420px]">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">
          Live Camera
        </h2>

        <div className="flex items-center gap-2 text-green-600">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Online
        </div>
      </div>

      <div className="h-[320px] rounded-2xl bg-slate-900 flex flex-col justify-center items-center text-white">

        <Camera size={70} />

        <h3 className="mt-5 text-xl font-semibold">
          Camera Preview
        </h3>

        <p className="text-slate-400 mt-2">
          OpenCV video stream will appear here
        </p>

        <div className="flex items-center gap-2 text-green-400 mt-5">
          <ScanFace size={18} />
          AI Detection Ready
        </div>

      </div>
    </div>
  );
}