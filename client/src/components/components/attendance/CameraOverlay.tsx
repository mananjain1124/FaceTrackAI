import { Detection } from "@mediapipe/tasks-vision";

interface Props {
  detections: Detection[];
  width: number;
  height: number;
}

export default function CameraOverlay({
  detections,
  width,
  height,
}: Props) {
  return (
    <svg
      className="absolute left-0 top-0"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {detections.map((detection, index) => {
        const box = detection.boundingBox;

        if (!box) return null;

        return (
          <g key={index}>
            <rect
              x={box.originX}
              y={box.originY}
              width={box.width}
              height={box.height}
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
              rx="10"
            />

            <text
              x={box.originX}
              y={box.originY - 10}
              fill="#22c55e"
              fontSize="18"
              fontWeight="bold"
            >
              Face
            </text>
          </g>
        );
      })}
    </svg>
  );
}