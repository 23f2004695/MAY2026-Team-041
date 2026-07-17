import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CalendarCheck, LayoutDashboard, Ticket, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { StatisticCard } from '@/components/common';
import { Avatar, Badge, Button, Card } from '@/components/ui';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/constants/routes';
import { statistics } from '@/mocks/landing';

const readingList: { title: string; id: string; variant: 'warning' | 'success' | 'outline' }[] = [
  { title: 'Atomic Habits', id: 'atomicHabits', variant: 'warning' },
  { title: 'Sapiens', id: 'sapiens', variant: 'success' },
  { title: 'The Overstory', id: 'theOverstory', variant: 'outline' },
];

const mockNav = [
  { id: 'dashboard', icon: LayoutDashboard, active: true },
  { id: 'books', icon: BookOpen, active: false },
  { id: 'reservations', icon: Ticket, active: false },
  { id: 'seatBooking', icon: CalendarCheck, active: false },
];

const trustStats = statistics.slice(0, 3);

export function Hero() {
  const { t } = useTranslation('landing');
  const navigate = useNavigate();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-border bg-surface"
    >
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-hero-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-hero-noise" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-2 lg:items-center lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col"
        >
          <Badge variant="outline" className="w-fit">
            {t('hero.badge')}
          </Badge>
          <h1
            id="hero-heading"
            className="mt-5 max-w-xl text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl"
          >
            {t('hero.title')}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
            {t('hero.description')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              trailingIcon={<ArrowRight className="size-4" />}
              onClick={() => navigate(ROUTES.REGISTER)}
            >
              {t('hero.joinCommunity')}
            </Button>
            <Button size="lg" variant="ghost" onClick={() => navigate(ROUTES.BOOKS)}>
              {t('hero.browseBooks')}
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border-muted pt-6 text-sm text-muted-foreground">
            {trustStats.map((stat) => (
              <span key={stat.id} className="flex items-center gap-2">
                <stat.icon className="size-4 text-primary" />
                <span className="font-medium text-foreground">{stat.value}</span>{' '}
                {t(`statistics.items.${stat.id}.label`)}
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
          <Card className="overflow-hidden pt-20">
            <div className="flex">
              <div className="hidden w-36 shrink-0 flex-col gap-1 border-e border-border-muted bg-secondary/40 p-3 sm:flex">
                {mockNav.map((item) => (
                  <span
                    key={item.id}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium',
                      item.active ? 'bg-secondary text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    <item.icon className="size-3.5" />
                    {t(`hero.nav.${item.id}`)}
                  </span>
                ))}
              </div>

              <div className="flex-1 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{t('hero.dashboard')}</p>
                  <Avatar name="Priya Sharma" size="sm" />
                </div>
                <div className="mt-3 flex gap-4 border-b border-border-muted text-xs font-medium text-muted-foreground">
                  <span className="border-b-2 border-primary pb-2 text-foreground">
                    {t('hero.currentlyReading')}
                  </span>
                  <span className="pb-2">{t('hero.history')}</span>
                </div>
                <ul className="mt-3 flex flex-col gap-2">
                  {readingList.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border-muted bg-secondary px-3 py-2.5"
                    >
                      <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <BookOpen className="size-4" />
                        </span>
                        {item.title}
                      </span>
                      <Badge variant={item.variant} className="shrink-0">
                        {t(`hero.readingList.${item.id}.status`)}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <StatisticCard
            icon={BookOpen}
            label={t('statistics.items.booksAvailable.label')}
            value="12,400+"
            className="absolute -start-4 -top-4 hidden shadow-panel sm:flex"
          />
          <StatisticCard
            icon={Users}
            label={t('statistics.items.members.label')}
            value="3,200+"
            className="absolute -bottom-4 -end-4 hidden shadow-panel sm:flex"
          />
        </motion.div>
      </div>
    </section>
  );
}
