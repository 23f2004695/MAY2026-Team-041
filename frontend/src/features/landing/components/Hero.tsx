import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, MessagesSquare, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import libraryIllustration from '@/assets/library-illustration.png';
import { Badge, Button } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { statistics } from '@/mocks/landing';

import { FadeUp } from './FadeUp';

const trustStats = statistics.slice(0, 3);
const booksStat = statistics[0];

export function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-border bg-surface"
    >
      <div aria-hidden className="blob -right-24 -top-24 -z-10 size-105 opacity-[0.14] blur-3xl" />
      <div
        aria-hidden
        className="blob -left-16 top-1/2 -z-10 size-64 opacity-[0.10] blur-2xl lg:left-[52%]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-2 lg:items-center lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col"
        >
          <FadeUp>
            <Badge variant="outline" className="w-fit">
              {t('landing.hero.badge')}
            </Badge>
          </FadeUp>
          <FadeUp delay={1}>
            <h1
              id="hero-heading"
              className="mt-5 max-w-xl text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl"
            >
              {t('landing.hero.title')}
            </h1>
          </FadeUp>
          <FadeUp delay={2}>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
              {t('landing.hero.subtitle')}
            </p>
          </FadeUp>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              trailingIcon={<ArrowRight className="size-4" />}
              onClick={() => navigate(ROUTES.REGISTER)}
            >
              {t('landing.hero.ctaJoin')}
            </Button>
            <Button size="lg" variant="ghost" onClick={() => navigate(ROUTES.BOOKS)}>
              {t('landing.hero.ctaBrowse')}
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border-muted pt-6 text-sm text-muted-foreground">
            {trustStats.map((stat) => (
              <span key={stat.id} className="flex items-center gap-2">
                <stat.icon className="size-4 text-primary" />
                <span className="font-medium text-foreground">{stat.value}</span>{' '}
                {t(`landing.stats.${stat.id}`)}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
          whileHover={{ y: -4 }}
          className="relative"
        >
          <img
            src={libraryIllustration}
            alt={t('landing.hero.imgAlt')}
            className="aspect-3/2 w-full object-cover"
          />

          <div className="absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-full border border-border bg-surface px-4 py-2 shadow-panel sm:flex">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <BookOpen className="size-4" />
            </span>
            <span className="text-sm">
              <span className="font-semibold text-foreground">{booksStat.value}</span>{' '}
              <span className="text-muted-foreground">{t(`landing.stats.${booksStat.id}`)}</span>
            </span>
          </div>

          <span className="absolute -right-3 top-8 hidden size-11 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-panel sm:flex">
            <Sparkles className="size-5" />
          </span>
          <span className="absolute -left-4 bottom-16 hidden size-10 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-panel sm:flex">
            <MessagesSquare className="size-4" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
