import { MessageSquare, MessageSquareOff, Star, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageTitle, ReviewCard, StatisticCard } from '@/components/common';
import { Button, Dialog, EmptyState } from '@/components/ui';
import {
  allReviews,
  bookReviews,
  featuredBook,
  ratingBreakdown,
  type BookReview,
} from '@/mocks/reviews';
import { useAuth } from '@/providers/AuthProvider';

import { RatingSummary } from '../components/RatingSummary';
import { WriteReviewModal, type ReviewDraft } from '../components/WriteReviewModal';

export function ReviewsPage() {
  const { t } = useTranslation();
  const { role } = useAuth();
  const isStaff = role === 'admin' || role === 'manager' || role === 'it-head';
  const canModerate = role === 'admin' || role === 'it-head';
  const [reviews, setReviews] = useState<BookReview[]>(() => (isStaff ? allReviews : bookReviews));
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<BookReview | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const deletingReview = reviews.find((review) => review.id === deletingReviewId) ?? null;

  const booksReviewed = useMemo(
    () => new Set(reviews.map((review) => review.bookTitle)).size,
    [reviews],
  );
  const averageRating = useMemo(
    () =>
      reviews.length === 0
        ? 0
        : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
    [reviews],
  );

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

  function confirmDeleteReview() {
    if (!deletingReview) return;
    setReviews((prev) => prev.filter((review) => review.id !== deletingReview.id));
    setDeletingReviewId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title={t('reviews.pageTitle')}
        description={
          isStaff ? (
            t('reviews.admin.pageDescription')
          ) : (
            <>
              {featuredBook.title}{' '}
              <span className="text-foreground">
                {t('reviews.byAuthor', { author: featuredBook.author })}
              </span>
            </>
          )
        }
        actions={
          !isStaff && (
            <Button onClick={() => setIsWriteReviewOpen(true)}>{t('reviews.writeReview')}</Button>
          )
        }
      />

      {isStaff ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatisticCard
            icon={MessageSquare}
            label={t('reviews.admin.stats.totalReviews')}
            value={String(reviews.length)}
          />
          <StatisticCard
            icon={Star}
            label={t('reviews.admin.stats.averageRating')}
            value={averageRating.toFixed(1)}
          />
          <StatisticCard
            icon={Users}
            label={t('reviews.admin.stats.booksReviewed')}
            value={String(booksReviewed)}
          />
        </div>
      ) : (
        <RatingSummary
          averageRating={featuredBook.averageRating}
          totalReviews={featuredBook.totalReviews}
          breakdown={ratingBreakdown}
        />
      )}

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
                role={
                  isStaff && review.bookTitle ? `${review.date} · ${review.bookTitle}` : review.date
                }
                quote={review.comment}
                rating={review.rating}
                images={review.images}
                onEdit={review.isOwn ? () => setEditingReview(review) : undefined}
                onDelete={canModerate ? () => setDeletingReviewId(review.id) : undefined}
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
            ? {
                rating: editingReview.rating,
                comment: editingReview.comment,
                images: editingReview.images ?? [],
              }
            : undefined
        }
      />

      <Dialog
        open={deletingReview !== null}
        onClose={() => setDeletingReviewId(null)}
        title={t('reviews.deleteDialog.title')}
        description={t('reviews.deleteDialog.description')}
        confirmLabel={t('reviews.deleteDialog.confirmLabel')}
        confirmVariant="danger"
        onConfirm={confirmDeleteReview}
      />
    </div>
  );
}
