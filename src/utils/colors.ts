export type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export function rgba(r: number, g: number, b: number, a: number): RGBA {
  return { r, g, b, a };
}

export function rgb(r: number, g: number, b: number): RGBA {
  return rgba(r, g, b, 1.0);
}

export function hex(color: number) {
  return rgb((color >> 16) & 255, (color >> 8) & 255, color & 255);
}

export function cssColor({ r, g, b, a }: RGBA) {
  return `rgba(${r},${g},${b},${a ?? 1.0})`;
}

export function colorID({ r, g, b, a }: RGBA) {
  const c = [r, g, b, a]
    .map((n) => BigInt(n & 255))
    .reduce((p, c) => (p << BigInt(8)) | c);
  return "c" + c.toString(16).padStart(8, "0").toUpperCase();
}

export function gradient(colors: RGBA[], percent: number): RGBA | null {
  if (colors.length == 0 || percent < 0.0 || percent > 1.0) return null;
  if (colors.length == 1) return colors[0];
  if (percent == 1.0) return colors[colors.length - 1];

  const lerp = (a: number, b: number, p: number): number => a + p * (b - a);

  const location = (colors.length - 1) * percent;
  const l = Math.floor(location);
  const p = location - l;

  return rgba(
    lerp(colors[l].r, colors[l + 1].r, p),
    lerp(colors[l].g, colors[l + 1].g, p),
    lerp(colors[l].b, colors[l + 1].b, p),
    lerp(colors[l].a ?? 1.0, colors[l + 1].a ?? 1.0, p)
  );
}

export const colorPallet = [
  hex(0x0a40bb),
  hex(0xb231aa),
  hex(0xf84285),
  hex(0xff7c62),
  hex(0xffbc52),
  hex(0xf9f871),
];

export function colorPalletGradient(p: number): RGBA | null {
  return gradient(colorPallet, p);
}
