import WebcamPreview from "./WebcamPreview";
import FaceGuide from "./FaceGuide";
import FaceStatus from "./FaceStatus";

export default function FaceRegistration() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

      <div className="relative lg:col-span-2">

        <WebcamPreview />

        <FaceGuide />

      </div>

      <FaceStatus />

    </div>
  );
}