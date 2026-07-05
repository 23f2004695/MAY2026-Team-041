import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { StatisticCard } from '@/components/common';
import { Badge, Button, Card } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { statistics } from '@/mocks/landing';

const readingList: { title: string; status: string; variant: 'warning' | 'success' | 'outline' }[] =
  [
    { title: 'Atomic Habits', status: 'Due in 4 days', variant: 'warning' },
    { title: 'Sapiens', status: 'Ready for pickup', variant: 'success' },
    { title: 'The Overstory', status: 'Queue position 2', variant: 'outline' },
  ];

const trustStats = statistics.slice(0, 3);

export function Hero() {
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
            Community Reading Club & Library Platform
          </Badge>
          <h1
            id="hero-heading"
            className="mt-5 max-w-xl text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl"
          >
            Your library, your community, all in one place.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
            Borrow books, reserve a study seat, join a reading club, and get personalized
            recommendations, without the paper registers and group chats.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              trailingIcon={<ArrowRight className="size-4" />}
              onClick={() => navigate(ROUTES.REGISTER)}
            >
              Join the Community
            </Button>
            <Button size="lg" variant="ghost" onClick={() => navigate(ROUTES.BOOKS)}>
              Browse Books
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border-muted pt-6 text-sm text-muted-foreground">
            {trustStats.map((stat) => (
              <span key={stat.label} className="flex items-center gap-2">
                <stat.icon className="size-4 text-primary" />
                <span className="font-medium text-foreground">{stat.value}</span> {stat.label}
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
          <Card className="p-6 sm:pt-20">
            <p className="text-sm font-semibold text-foreground">Currently Reading</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {readingList.map((item) => (
                <li
                  key={item.title}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border-muted bg-secondary px-3 py-3"
                >
                  <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <BookOpen className="size-4" />
                    </span>
                    {item.title}
                  </span>
                  <Badge variant={item.variant} className="shrink-0">
                    {item.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>

          <StatisticCard
            icon={BookOpen}
            label="Books Available"
            value="12,400+"
            className="absolute -left-4 -top-4 hidden shadow-panel sm:flex"
          />
          <StatisticCard
            icon={Users}
            label="Members"
            value="3,200+"
            className="absolute -bottom-4 -right-4 hidden shadow-panel sm:flex"
          />
        </motion.div>
      </div>
    </section>
  );
}
