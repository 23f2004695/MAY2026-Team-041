import { toast } from 'sonner';

import i18n from '@/i18n';

export function comingSoonToast(action: string) {
  toast.info(i18n.t('common:toast.comingSoon.title', { action }), {
    description: i18n.t('common:toast.comingSoon.description'),
  });
}
