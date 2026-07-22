export function detectBlink(
  blendshapes: any[]
): boolean {

  if (!blendshapes || blendshapes.length === 0) {
    return false;
  }

  const categories = blendshapes[0].categories;

  const leftBlink = categories.find(
    (c: any) => c.categoryName === "eyeBlinkLeft"
  );

  const rightBlink = categories.find(
    (c: any) => c.categoryName === "eyeBlinkRight"
  );

  if (!leftBlink || !rightBlink) {
    return false;
  }

  return (
    leftBlink.score > 0.55 &&
    rightBlink.score > 0.55
  );
}