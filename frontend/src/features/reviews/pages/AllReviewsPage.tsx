import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ReviewCard } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { testimonials } from '@/mocks/landing';

export function AllReviewsPage() {
  const { t } = useTranslation('reviews');

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <Link
        to={ROUTES.HOME}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t('common:actions.backToHome')}
      </Link>

      <h1 className="mt-4 text-3xl font-semibold text-foreground">{t('allReviews.heading')}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{t('allReviews.subtitle')}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <ReviewCard
            key={testimonial.id}
            name={testimonial.name}
            role={t(`landing:testimonials.people.${testimonial.id}.role`)}
            quote={t(`landing:testimonials.people.${testimonial.id}.quote`)}
          />
        ))}
      </div>
    </div>
  );
}
