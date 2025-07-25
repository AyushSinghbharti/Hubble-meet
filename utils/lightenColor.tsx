export const lightenColor = (hex: string, percent: number): string => {
  let r = 0,
    g = 0,
    b = 0;

  if (hex.length === 4) {
    hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }

  const bigint = parseInt(hex.slice(1), 16);
  r = (bigint >> 16) & 255;
  g = (bigint >> 8) & 255;
  b = bigint & 255;

  r = Math.min(255, Math.round(r + ((255 - r) * percent) / 100));
  g = Math.min(255, Math.round(g + ((255 - g) * percent) / 100));
  b = Math.min(255, Math.round(b + ((255 - b) * percent) / 100));

  const toHex = (val: number) => val.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
