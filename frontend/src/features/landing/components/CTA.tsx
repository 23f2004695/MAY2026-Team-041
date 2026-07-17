import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui';
import { ROUTES } from '@/constants/routes';

import { FadeUp } from './FadeUp';
import { fadeInUp, viewportOnce } from '../motion';

export function CTA() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section aria-labelledby="cta-heading" className="border-b border-border bg-primary">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-16 md:py-20 lg:py-30 text-center">
        <FadeUp>
          <h2 id="cta-heading" className="text-3xl font-semibold text-primary-foreground">
            {t('landing.cta.heading')}
          </h2>
        </FadeUp>
        <FadeUp delay={1}>
          <p className="max-w-xl text-primary-foreground/80">{t('landing.cta.subheading')}</p>
        </FadeUp>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <Button size="lg" variant="secondary" onClick={() => navigate(ROUTES.REGISTER)}>
            {t('landing.cta.button')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
