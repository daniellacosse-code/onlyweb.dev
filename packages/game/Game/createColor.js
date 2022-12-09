import { Color } from "playcanvas";

export function createColor({ hue = 0, saturation = 0, luminance = 0 }) {
  if (hue < 0 || hue > 360) {
    throw new RangeError(
      `Hue in createColor must be a value between 0 and 360. Found: ${hue}`
    );
  }

  if (saturation < 0 || saturation > 1) {
    throw new RangeError(
      `Saturation in createColor must be a value between 0 and 1. Found: ${saturation}`
    );
  }

  if (luminance < 0 || luminance > 1) {
    throw new RangeError(
      `Luminance in createColor must be a value between 0 and 1. Found: ${luminance}`
    );
  }

  // I don't understand the math, this is literally ripped from SO: https://stackoverflow.com/a/54014428
  const a = saturation * Math.min(luminance, 1 - luminance);
  const _ = (n) => {
    const k = (n + hue / 30) % 12;

    return luminance - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };

  return new Color(_(0), _(8), _(4));
}
