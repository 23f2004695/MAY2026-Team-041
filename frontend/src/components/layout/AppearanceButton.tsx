import { useState } from 'react';
import { Palette } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { AppearancePanel } from './AppearancePanel';

export function AppearanceButton() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('common');

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('appearance.label')}
        className="flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Palette className="size-4" />
      </button>
      <AppearancePanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
