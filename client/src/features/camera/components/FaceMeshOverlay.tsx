interface Props {
  landmarks: any[];
}

export default function FaceMeshOverlay({
  landmarks,
}: Props) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1280 720"
      preserveAspectRatio="xMidYMid meet"
    >
      {landmarks.map((point, index) => (
        <circle
          key={index}
          cx={point.x * 1280}
          cy={point.y * 720}
          r={1.8}
          fill="#22c55e"
        />
      ))}
    </svg>
  );
}