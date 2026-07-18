import { useTranslation } from 'react-i18next';

import { ReviewCard } from '@/components/common';
import { Button } from '@/components/ui';
import { bookReviews, featuredBook, ratingBreakdown } from '@/mocks/reviews';

import { RatingSummary } from '../components/RatingSummary';

export function ReviewsPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{t('reviews.pageTitle')}</h1>
          <p className="mt-1 text-muted-foreground">
            {featuredBook.title}{' '}
            <span className="text-foreground">
              {t('reviews.byAuthor', { author: featuredBook.author })}
            </span>
          </p>
        </div>
        <Button disabled title={t('reviews.writeReviewDisabledHint')}>
          {t('reviews.writeReview')}
        </Button>
      </div>

      <RatingSummary
        averageRating={featuredBook.averageRating}
        totalReviews={featuredBook.totalReviews}
        breakdown={ratingBreakdown}
      />

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">{t('reviews.commentsHeading')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {bookReviews.map((review) => (
            <ReviewCard
              key={review.id}
              name={review.reviewer}
              role={review.date}
              quote={review.comment}
              rating={review.rating}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
