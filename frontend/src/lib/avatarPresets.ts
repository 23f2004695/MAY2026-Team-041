// ponytail: no image upload/storage (Cloudinary) wired up yet — these are inline SVG
// data URIs generated locally, no external requests or new dependency. Swap for a real
// upload flow later; avatarUrl already accepts any URL so nothing else has to change.
const PRESET_COLORS = [
  '#7C3AED',
  '#DB2777',
  '#059669',
  '#D97706',
  '#2563EB',
  '#DC2626',
  '#0891B2',
  '#65A30D',
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const initials =
    parts.length === 1 ? parts[0].slice(0, 2) : `${parts[0][0]}${parts[parts.length - 1][0]}`;
  return initials.toUpperCase();
}

function buildAvatarDataUrl(initials: string, color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="${color}"/><text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="system-ui,sans-serif" font-size="52" font-weight="600" fill="#ffffff">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function getAvatarPresets(name: string): string[] {
  const initials = getInitials(name);
  return PRESET_COLORS.map((color) => buildAvatarDataUrl(initials, color));
}
