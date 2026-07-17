// Contrast-aware color helpers for the "Set space background" appearance feature.
// Pure functions, no dependencies. Uses WCAG 2.x relative luminance + contrast ratio
// so that text colors auto-adjust to stay legible on custom background/card colors.

export type RGB = [number, number, number];

const NEAR_BLACK = '#0b1114';
const NEAR_WHITE = '#f5f8f9';

/** Parse `#rgb` or `#rrggbb` into an [r,g,b] tuple (0-255). Returns null on malformed input. */
export function hexToRgb(hex: string): RGB | null {
  if (typeof hex !== 'string') return null;
  let value = hex.trim().replace(/^#/, '');
  if (value.length === 3) {
    value = value
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return null;
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

function toHex(channel: number): string {
  return Math.round(Math.max(0, Math.min(255, channel)))
    .toString(16)
    .padStart(2, '0');
}

function rgbToHex([r, g, b]: RGB): string {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function srgbToLinear(c: number): number {
  const cs = c / 255;
  return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance (0-1). */
export function relLuminance(rgb: RGB): number {
  const [r, g, b] = rgb.map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colors (1-21). Returns 1 on malformed input. */
export function contrastRatio(aHex: string, bHex: string): number {
  const a = hexToRgb(aHex);
  const b = hexToRgb(bHex);
  if (!a || !b) return 1;
  const l1 = relLuminance(a);
  const l2 = relLuminance(b);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/** Linear blend of two hex colors; `t` is the amount of `b` (0-1). */
export function mix(aHex: string, bHex: string, t: number): string {
  const a = hexToRgb(aHex);
  const b = hexToRgb(bHex);
  if (!a || !b) return aHex;
  return rgbToHex([
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]);
}

export interface SurfacePalette {
  foreground: string;
  mutedForeground: string;
  border: string;
}

/** Readable text/border palette for a single surface color. */
export function getReadableForeground(hex: string): SurfacePalette {
  const foreground =
    contrastRatio(NEAR_BLACK, hex) >= contrastRatio(NEAR_WHITE, hex) ? NEAR_BLACK : NEAR_WHITE;
  return {
    foreground,
    mutedForeground: mix(hex, foreground, 0.62),
    border: mix(hex, foreground, 0.2),
  };
}

export interface AppearancePalette extends SurfacePalette {
  secondary: string;
  secondaryForeground: string;
}

/**
 * One foreground set legible on BOTH the page background and the card surface.
 * Picks the foreground (near-black/near-white) that maximizes the worst-case
 * contrast across the two surfaces; muted/border/secondary are tuned to the card
 * color (the primary reading surface).
 */
export function getReadablePalette(bgHex: string, cardHex: string): AppearancePalette {
  const score = (fg: string) => Math.min(contrastRatio(fg, bgHex), contrastRatio(fg, cardHex));
  const foreground = score(NEAR_BLACK) >= score(NEAR_WHITE) ? NEAR_BLACK : NEAR_WHITE;
  return {
    foreground,
    mutedForeground: mix(cardHex, foreground, 0.55),
    border: mix(cardHex, foreground, 0.18),
    secondary: mix(cardHex, foreground, 0.06),
    secondaryForeground: foreground,
  };
}
