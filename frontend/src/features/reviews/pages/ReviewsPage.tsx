import { MessageSquareOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageTitle, ReviewCard } from '@/components/common';
import { Button, EmptyState } from '@/components/ui';
import { bookReviews, featuredBook, ratingBreakdown } from '@/mocks/reviews';

import { RatingSummary } from '../components/RatingSummary';

export function ReviewsPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title={t('reviews.pageTitle')}
        description={
          <>
            {featuredBook.title}{' '}
            <span className="text-foreground">
              {t('reviews.byAuthor', { author: featuredBook.author })}
            </span>
          </>
        }
        actions={
          <Button disabled title={t('reviews.writeReviewDisabledHint')}>
            {t('reviews.writeReview')}
          </Button>
        }
      />

      <RatingSummary
        averageRating={featuredBook.averageRating}
        totalReviews={featuredBook.totalReviews}
        breakdown={ratingBreakdown}
      />

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">{t('reviews.commentsHeading')}</h2>
        {bookReviews.length === 0 ? (
          <EmptyState
            icon={MessageSquareOff}
            title={t('reviews.empty.title')}
            description={t('reviews.empty.description')}
          />
        ) : (
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
        )}
      </div>
    </div>
  );
}
