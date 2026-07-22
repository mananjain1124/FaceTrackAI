export type HeadPose =
  | "CENTER"
  | "LEFT"
  | "RIGHT"
  | "UP"
  | "DOWN";

export function detectHeadPose(
  landmarks: any[]
): HeadPose {

  if (!landmarks || landmarks.length < 300)
    return "CENTER";

  const nose = landmarks[1];

  const leftCheek = landmarks[234];

  const rightCheek = landmarks[454];

  const forehead = landmarks[10];

  const chin = landmarks[152];

  const horizontal =
    nose.x -
    (leftCheek.x + rightCheek.x) / 2;

  const vertical =
    nose.y -
    (forehead.y + chin.y) / 2;

  // LEFT

  if (horizontal < -0.03)
    return "LEFT";

  // RIGHT

  if (horizontal > 0.03)
    return "RIGHT";

  // UP

  if (vertical < -0.03)
    return "UP";

  // DOWN

  if (vertical > 0.03)
    return "DOWN";

  return "CENTER";
}