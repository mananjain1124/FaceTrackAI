import {
  ScanFace,
  Move,
  Eye,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Camera,
  Brain,
  CheckCircle2,
} from "lucide-react";

interface Props {
  currentStep: number;
  quality: {
    centered: boolean;
    tooClose: boolean;
    tooFar: boolean;
  };
}

export default function FaceStatus({
  currentStep,
  quality,
}: Props) {
  const getStatus = () => {
    switch (currentStep) {
      case 1:
        return {
          icon: <ScanFace size={30} />,
          title: "Detect Face",
          message: "Position your face inside the guide.",
          color: "blue",
        };

      case 2:
        if (quality.tooClose)
          return {
            icon: <Move size={30} />,
            title: "Move Back",
            message: "Your face is too close.",
            color: "orange",
          };

        if (quality.tooFar)
          return {
            icon: <Move size={30} />,
            title: "Move Closer",
            message: "Your face is too far.",
            color: "orange",
          };

        return {
          icon: <Move size={30} />,
          title: "Center Face",
          message: "Align your face with the circle.",
          color: "blue",
        };

      case 3:
        return {
          icon: <Eye size={30} />,
          title: "Blink",
          message: "Blink once naturally.",
          color: "green",
        };

      case 4:
        return {
          icon: <ArrowLeft size={30} />,
          title: "Turn Left",
          message: "Slowly rotate your head left.",
          color: "blue",
        };

      case 5:
        return {
          icon: <ArrowRight size={30} />,
          title: "Turn Right",
          message: "Slowly rotate your head right.",
          color: "blue",
        };

      case 6:
        return {
          icon: <ArrowUp size={30} />,
          title: "Look Up",
          message: "Raise your chin slightly.",
          color: "blue",
        };

      case 7:
        return {
          icon: <ArrowDown size={30} />,
          title: "Look Down",
          message: "Lower your chin slightly.",
          color: "blue",
        };

      case 8:
        return {
          icon: <Camera size={30} />,
          title: "Capturing Images",
          message: "Please stay still...",
          color: "green",
        };

      case 9:
        return {
          icon: <Brain size={30} />,
          title: "Generating Embeddings",
          message: "Processing your face...",
          color: "purple",
        };

      case 10:
        return {
          icon: <CheckCircle2 size={30} />,
          title: "Registration Complete",
          message: "Face registration successful.",
          color: "green",
        };

      default:
        return {
          icon: <ScanFace size={30} />,
          title: "Waiting",
          message: "",
          color: "gray",
        };
    }
  };

  const status = getStatus();

  return (
    <div className="rounded-2xl border bg-white shadow-lg p-6">

      <div className="flex items-center gap-4">

        <div
          className={`

          w-14
          h-14
          rounded-full
          flex
          items-center
          justify-center

          ${
            status.color === "green"
              ? "bg-green-100 text-green-600"

              : status.color === "orange"
              ? "bg-orange-100 text-orange-600"

              : status.color === "purple"
              ? "bg-purple-100 text-purple-600"

              : "bg-blue-100 text-blue-600"
          }

          `}
        >
          {status.icon}
        </div>

        <div>

          <h2 className="text-xl font-bold">
            {status.title}
          </h2>

          <p className="text-slate-500">
            {status.message}
          </p>

        </div>

      </div>

    </div>
  );
}