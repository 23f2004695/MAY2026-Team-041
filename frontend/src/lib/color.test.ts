import { describe, expect, it } from 'vitest';

import { contrastRatio, getReadablePalette, hexToRgb } from './color';

describe('color utils', () => {
  it('parses #rrggbb and #rgb, rejects malformed input', () => {
    expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]);
    expect(hexToRgb('#000')).toEqual([0, 0, 0]);
    expect(hexToRgb('not-a-color')).toBeNull();
  });

  it('reports maximal contrast for black on white', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 0);
  });

  it('derives dark, readable text for a light background/card pair', () => {
    const palette = getReadablePalette('#eef2f3', '#ffffff');
    expect(contrastRatio(palette.foreground, '#ffffff')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(palette.foreground, '#eef2f3')).toBeGreaterThanOrEqual(4.5);
  });

  it('derives light, readable text for a deep background/card pair', () => {
    const palette = getReadablePalette('#12161b', '#232b31');
    expect(contrastRatio(palette.foreground, '#232b31')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(palette.foreground, '#12161b')).toBeGreaterThanOrEqual(4.5);
  });
});
