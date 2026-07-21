import { MessageSquareOff } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageTitle, ReviewCard } from '@/components/common';
import { Button, EmptyState } from '@/components/ui';
import { bookReviews, featuredBook, ratingBreakdown, type BookReview } from '@/mocks/reviews';

import { RatingSummary } from '../components/RatingSummary';
import { WriteReviewModal, type ReviewDraft } from '../components/WriteReviewModal';

export function ReviewsPage() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<BookReview[]>(bookReviews);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<BookReview | null>(null);

  function handleSubmitReview(draft: ReviewDraft) {
    if (editingReview) {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === editingReview.id
            ? { ...review, rating: draft.rating, comment: draft.comment, images: draft.images }
            : review,
        ),
      );
      setEditingReview(null);
      return;
    }

    const newReview: BookReview = {
      id: `rev-${Date.now()}`,
      reviewer: t('reviews.writeReviewModal.you'),
      rating: draft.rating,
      comment: draft.comment,
      date: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      images: draft.images,
      isOwn: true,
    };
    setReviews((prev) => [newReview, ...prev]);
    setIsWriteReviewOpen(false);
  }

  function closeReviewModal() {
    setIsWriteReviewOpen(false);
    setEditingReview(null);
  }

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
        actions={<Button onClick={() => setIsWriteReviewOpen(true)}>{t('reviews.writeReview')}</Button>}
      />

      <RatingSummary
        averageRating={featuredBook.averageRating}
        totalReviews={featuredBook.totalReviews}
        breakdown={ratingBreakdown}
      />

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">{t('reviews.commentsHeading')}</h2>
        {reviews.length === 0 ? (
          <EmptyState
            icon={MessageSquareOff}
            title={t('reviews.empty.title')}
            description={t('reviews.empty.description')}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                name={review.reviewer}
                role={review.date}
                quote={review.comment}
                rating={review.rating}
                images={review.images}
                onEdit={review.isOwn ? () => setEditingReview(review) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <WriteReviewModal
        open={isWriteReviewOpen || editingReview !== null}
        onClose={closeReviewModal}
        onSubmit={handleSubmitReview}
        initialValues={
          editingReview
            ? { rating: editingReview.rating, comment: editingReview.comment, images: editingReview.images ?? [] }
            : undefined
        }
      />
    </div>
  );
}
