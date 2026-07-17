// Curated solid-color presets for the "Set space background" appearance panel.
// `value: null` means "use the current theme default". Light pastels resolve to
// near-black text; deep tones resolve to near-white text (handled by src/lib/color.ts).

export interface ColorPreset {
  name: string;
  value: string | null;
}

export const BACKGROUND_PRESETS: ColorPreset[] = [
  { name: 'Theme default', value: null },
  { name: 'Cool gray', value: '#eef2f3' },
  { name: 'Soft blue', value: '#eaf1fb' },
  { name: 'Mint', value: '#eaf6ef' },
  { name: 'Blush', value: '#fbeef2' },
  { name: 'Lavender', value: '#f1edfb' },
  { name: 'Cream', value: '#f8f4ea' },
  { name: 'Slate', value: '#1b2127' },
  { name: 'Ink', value: '#12161b' },
  { name: 'Plum', value: '#1e1a24' },
];

export const CARD_PRESETS: ColorPreset[] = [
  { name: 'Theme default', value: null },
  { name: 'White', value: '#ffffff' },
  { name: 'Sky', value: '#eef5ff' },
  { name: 'Sage', value: '#eef6f0' },
  { name: 'Rose', value: '#fdeef3' },
  { name: 'Periwinkle', value: '#f3f0fe' },
  { name: 'Butter', value: '#fdf6e9' },
  { name: 'Graphite', value: '#232b31' },
  { name: 'Onyx', value: '#1b2026' },
  { name: 'Mauve', value: '#262029' },
];
