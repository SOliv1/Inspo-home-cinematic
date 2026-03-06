export function blendColors(color1, color2, ratio = 0.3) {
  const hexToRgb = hex => {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  };

  const rgbToHex = ({ r, g, b }) =>
    '#' +
    [r, g, b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');

  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const blended = {
    r: Math.round(c1.r * (1 - ratio) + c2.r * ratio),
    g: Math.round(c1.g * (1 - ratio) + c2.g * ratio),
    b: Math.round(c1.b * (1 - ratio) + c2.b * ratio)
  };

  return rgbToHex(blended);
}