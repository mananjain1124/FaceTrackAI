export interface FaceQuality {
  centered: boolean;
  tooClose: boolean;
  tooFar: boolean;
  stable: boolean;
}

export function checkFaceQuality(
  landmarks: any[],
  videoWidth: number,
  videoHeight: number
): FaceQuality {

  if (!landmarks || landmarks.length === 0) {
    return {
      centered: false,
      tooClose: false,
      tooFar: false,
      stable: false,
    };
  }

  let minX = 1;
  let maxX = 0;
  let minY = 1;
  let maxY = 0;

  landmarks.forEach((p) => {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  });

  const faceWidth = (maxX - minX) * videoWidth;
  const faceHeight = (maxY - minY) * videoHeight;

  const centerX = ((minX + maxX) / 2) * videoWidth;
  const centerY = ((minY + maxY) / 2) * videoHeight;

  const centered =
    Math.abs(centerX - videoWidth / 2) < 100 &&
    Math.abs(centerY - videoHeight / 2) < 100;

  const tooClose = faceWidth > videoWidth * 0.55;

  const tooFar = faceWidth < videoWidth * 0.18;

  return {
    centered,
    tooClose,
    tooFar,
    stable: true,
  };
}