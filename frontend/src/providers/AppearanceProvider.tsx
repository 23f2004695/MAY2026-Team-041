import { createContext, useContext, useEffect, type ReactNode } from 'react';

import { getReadablePalette, hexToRgb } from '@/lib/color';
import { useLocalStorageState } from '@/lib/useLocalStorageState';

import { useTheme } from './ThemeProvider';

export interface Appearance {
  backgroundColor: string | null;
  cardColor: string | null;
}

interface AppearanceContextValue extends Appearance {
  setBackgroundColor: (hex: string | null) => void;
  setCardColor: (hex: string | null) => void;
  reset: () => void;
}

const DEFAULT_APPEARANCE: Appearance = { backgroundColor: null, cardColor: null };

// CSS variables the appearance override manages. Accent tokens (primary/success/
// warning/danger), radii and shadows are intentionally left untouched.
const MANAGED_VARS = [
  '--color-background',
  '--color-surface',
  '--color-foreground',
  '--color-muted',
  '--color-muted-foreground',
  '--color-border',
  '--color-secondary',
  '--color-secondary-foreground',
] as const;

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [appearance, setAppearance] = useLocalStorageState<Appearance>(
    'appearance',
    DEFAULT_APPEARANCE,
  );
  const { backgroundColor, cardColor } = appearance;

  useEffect(() => {
    const el = document.documentElement;

    // Clear our overrides first so getComputedStyle returns the theme (stylesheet) base.
    MANAGED_VARS.forEach((v) => el.style.removeProperty(v));

    if (!backgroundColor && !cardColor) return;

    const base = getComputedStyle(el);
    const bg = (backgroundColor ?? base.getPropertyValue('--color-background')).trim();
    const card = (cardColor ?? base.getPropertyValue('--color-surface')).trim();

    // Guard against malformed persisted values.
    if (!hexToRgb(bg) || !hexToRgb(card)) return;

    if (backgroundColor) el.style.setProperty('--color-background', backgroundColor);
    if (cardColor) el.style.setProperty('--color-surface', cardColor);

    const palette = getReadablePalette(bg, card);
    el.style.setProperty('--color-foreground', palette.foreground);
    el.style.setProperty('--color-muted', palette.mutedForeground);
    el.style.setProperty('--color-muted-foreground', palette.mutedForeground);
    el.style.setProperty('--color-border', palette.border);
    el.style.setProperty('--color-secondary', palette.secondary);
    el.style.setProperty('--color-secondary-foreground', palette.secondaryForeground);
    // resolvedTheme is a dependency so a single-surface override recomputes on theme toggle.
  }, [backgroundColor, cardColor, resolvedTheme]);

  const value: AppearanceContextValue = {
    backgroundColor,
    cardColor,
    setBackgroundColor: (hex) => setAppearance({ ...appearance, backgroundColor: hex }),
    setCardColor: (hex) => setAppearance({ ...appearance, cardColor: hex }),
    reset: () => setAppearance(DEFAULT_APPEARANCE),
  };

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance(): AppearanceContextValue {
  const context = useContext(AppearanceContext);
  if (!context) throw new Error('useAppearance must be used within an AppearanceProvider');
  return context;
}
