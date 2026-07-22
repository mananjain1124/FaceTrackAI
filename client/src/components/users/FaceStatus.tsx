import { CheckCircle2, Loader2 } from "lucide-react";

export default function FaceStatus() {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow">

      <h3 className="mb-4 text-xl font-bold">
        Face Registration
      </h3>

      <div className="space-y-3">

        <Status label="Camera Ready" ok />

        <Status label="Face Detected" />

        <Status label="Centered" />

        <Status label="Lighting" />

        <Status label="Blink Detection" />

        <Status label="Ready to Capture" />

      </div>

    </div>
  );
}

function Status({
  label,
  ok = false,
}: {
  label: string;
  ok?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">

      <span>{label}</span>

      {ok ? (
        <CheckCircle2 className="text-green-600" />
      ) : (
        <Loader2 className="animate-spin text-blue-600" />
      )}

    </div>
  );
}