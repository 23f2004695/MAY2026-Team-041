import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ReviewCard } from '@/components/common';
import { Button } from '@/components/ui';
import { useLocalStorageState } from '@/lib/useLocalStorageState';
import { bookReviews, featuredBook, ratingBreakdown, type BookReview } from '@/mocks/reviews';

import { RatingSummary } from '../components/RatingSummary';
import { WriteReviewModal } from '../components/WriteReviewModal';

export function ReviewsPage() {
  const { t } = useTranslation('reviews');
  const [reviews, setReviews] = useLocalStorageState<BookReview[]>('book-reviews', bookReviews);
  const [modalOpen, setModalOpen] = useState(false);

  function addReview(review: BookReview) {
    setReviews([review, ...reviews]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{t('page.title')}</h1>
          <p className="mt-1 text-muted-foreground">
            {featuredBook.title}{' '}
            <span className="text-foreground">
              {t('page.byAuthor', { author: featuredBook.author })}
            </span>
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>{t('page.writeReview')}</Button>
      </div>

      <RatingSummary
        averageRating={featuredBook.averageRating}
        totalReviews={featuredBook.totalReviews}
        breakdown={ratingBreakdown}
      />

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">{t('page.comments')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              name={review.reviewer}
              role={review.date}
              quote={review.comment}
              rating={review.rating}
              imageUrl={review.imageDataUrl}
            />
          ))}
        </div>
      </div>

      <WriteReviewModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={addReview} />
    </div>
  );
}
