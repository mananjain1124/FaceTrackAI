import {
  Camera,
  CircleCheck,
  CircleX,
} from "lucide-react";

const cameras = [
  {
    id: "Camera 1",
    status: "Online",
  },
  {
    id: "Camera 2",
    status: "Online",
  },
  {
    id: "Camera 3",
    status: "Offline",
  },
  {
    id: "Camera 4",
    status: "Online",
  },
];

export default function CameraStatus() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 h-full">

      <div className="flex items-center gap-2 mb-6">

        <Camera className="text-blue-600" />

        <h2 className="text-xl font-semibold">
          Camera Status
        </h2>

      </div>

      <div className="space-y-4">

        {cameras.map((camera) => (
          <div
            key={camera.id}
            className="flex justify-between items-center rounded-lg border p-3"
          >
            <div>

              <h3 className="font-medium">
                {camera.id}
              </h3>

              <p className="text-sm text-slate-500">
                Entrance Camera
              </p>

            </div>

            {camera.status === "Online" ? (
              <div className="flex items-center gap-2 text-green-600">
                <CircleCheck size={18} />
                Online
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <CircleX size={18} />
                Offline
              </div>
            )}
          </div>
        ))}

      </div>

    </div>
  );
}