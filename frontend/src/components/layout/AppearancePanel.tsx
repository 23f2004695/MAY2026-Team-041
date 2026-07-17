import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button, Modal } from '@/components/ui';
import { BACKGROUND_PRESETS, CARD_PRESETS, type ColorPreset } from '@/constants/appearancePresets';
import { cn } from '@/lib/cn';
import { contrastRatio, getReadablePalette } from '@/lib/color';
import { useAppearance } from '@/providers/AppearanceProvider';

interface AppearancePanelProps {
  open: boolean;
  onClose: () => void;
}

interface ColorSectionProps {
  title: string;
  description: string;
  customLabel: string;
  presets: ColorPreset[];
  value: string | null;
  onChange: (hex: string | null) => void;
}

function ColorSection({
  title,
  description,
  customLabel,
  presets,
  value,
  onChange,
}: ColorSectionProps) {
  // A custom value is one that isn't one of the presets.
  const isCustom = value != null && !presets.some((p) => p.value === value);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {presets.map((preset) => {
          const selected = value === preset.value;
          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => onChange(preset.value)}
              aria-label={preset.name}
              aria-pressed={selected}
              title={preset.name}
              className={cn(
                'relative flex aspect-square items-center justify-center rounded-md border border-border transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                selected && 'ring-2 ring-primary ring-offset-1 ring-offset-surface',
              )}
              style={
                preset.value
                  ? { background: preset.value }
                  : {
                      backgroundImage:
                        'linear-gradient(135deg, var(--color-background) 50%, var(--color-surface) 50%)',
                    }
              }
            >
              {selected && (
                <Check className="size-4 text-foreground mix-blend-difference" strokeWidth={3} />
              )}
            </button>
          );
        })}
        <label
          className={cn(
            'relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-border text-[10px] font-medium text-muted-foreground transition-transform hover:scale-105',
            isCustom && 'ring-2 ring-primary ring-offset-1 ring-offset-surface',
          )}
          title={customLabel}
          style={isCustom ? { background: value ?? undefined } : undefined}
        >
          {!isCustom && customLabel}
          <input
            type="color"
            value={value ?? '#ffffff'}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`Custom ${title.toLowerCase()} color`}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      </div>
    </div>
  );
}

export function AppearancePanel({ open, onClose }: AppearancePanelProps) {
  const { t } = useTranslation('common');
  const { backgroundColor, cardColor, setBackgroundColor, setCardColor, reset } = useAppearance();

  const hasCustom = backgroundColor != null || cardColor != null;

  // Resolve the effective colors for the preview + contrast readout. When a surface
  // is left on "theme default", read the live computed token so the preview matches.
  const readVar = (name: string) =>
    typeof window !== 'undefined'
      ? getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#ffffff'
      : '#ffffff';
  const effectiveBg = backgroundColor ?? readVar('--color-background');
  const effectiveCard = cardColor ?? readVar('--color-surface');
  const palette = getReadablePalette(effectiveBg, effectiveCard);
  const cardContrast = contrastRatio(palette.foreground, effectiveCard);
  const bgContrast = contrastRatio(palette.foreground, effectiveBg);
  const lowContrast = Math.min(cardContrast, bgContrast) < 4.5;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('appearance.label')}
      footer={
        <>
          <Button variant="ghost" onClick={reset} disabled={!hasCustom}>
            {t('appearance.reset')}
          </Button>
          <Button onClick={onClose}>{t('appearance.done')}</Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <ColorSection
          title={t('appearance.background.title')}
          description={t('appearance.background.description')}
          customLabel={t('appearance.custom')}
          presets={BACKGROUND_PRESETS}
          value={backgroundColor}
          onChange={setBackgroundColor}
        />
        <ColorSection
          title={t('appearance.cards.title')}
          description={t('appearance.cards.description')}
          customLabel={t('appearance.custom')}
          presets={CARD_PRESETS}
          value={cardColor}
          onChange={setCardColor}
        />

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-foreground">{t('appearance.preview')}</h3>
          <div className="rounded-lg p-4" style={{ background: effectiveBg }}>
            <div
              className="rounded-lg border p-3"
              style={{ background: effectiveCard, borderColor: palette.border }}
            >
              <p className="text-sm font-semibold" style={{ color: palette.foreground }}>
                {t('appearance.sampleCard')}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: palette.mutedForeground }}>
                {t('appearance.sampleText')}
              </p>
              <span className="mt-2 inline-flex h-7 items-center rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground">
                {t('appearance.primaryAction')}
              </span>
            </div>
          </div>
          {lowContrast && <p className="text-xs text-warning">{t('appearance.lowContrast')}</p>}
        </div>
      </div>
    </Modal>
  );
}
