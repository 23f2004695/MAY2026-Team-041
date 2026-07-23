import { ImagePlus, Star, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Modal } from '@/components/ui';
import { cn } from '@/lib/cn';

export interface ReviewDraft {
  rating: number;
  comment: string;
  images: string[];
}

export interface WriteReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: ReviewDraft) => void;
  /** When set, the modal opens pre-filled for editing an existing review. */
  initialValues?: ReviewDraft;
}

const MAX_IMAGES = 4;
const MAX_COMMENT_LENGTH = 500;

export function WriteReviewModal({ open, onClose, onSubmit, initialValues }: WriteReviewModalProps) {
  const { t } = useTranslation();
  const isEditing = Boolean(initialValues);
  const [rating, setRating] = useState(initialValues?.rating ?? 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(initialValues?.comment ?? '');
  const [images, setImages] = useState<string[]>(initialValues?.images ?? []);

  // Re-sync the draft whenever the modal transitions to open, so a fresh
  // "write" starts blank and "edit" starts pre-filled with that review.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setRating(initialValues?.rating ?? 0);
      setComment(initialValues?.comment ?? '');
      setImages(initialValues?.images ?? []);
    }
  }

  function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const remainingSlots = MAX_IMAGES - images.length;
    const nextFiles = files.slice(0, remainingSlots);
    const nextUrls = nextFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...nextUrls]);
    event.target.value = '';
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (rating === 0 || comment.trim().length === 0) return;
    onSubmit({ rating, comment: comment.trim(), images });
  }

  const canSubmit = rating > 0 && comment.trim().length > 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? t('reviews.writeReviewModal.editTitle') : t('reviews.writeReviewModal.title')}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <p className="mb-1.5 text-sm font-medium text-foreground">
            {t('reviews.writeReviewModal.ratingLabel')}
          </p>
          <div
            className="flex gap-1"
            role="radiogroup"
            aria-label={t('reviews.writeReviewModal.ratingLabel')}
          >
            {Array.from({ length: 5 }, (_, index) => {
              const value = index + 1;
              const filled = value <= (hoveredRating || rating);
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={t('common.cards.review.ratedOutOf5', { rating: value })}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(value)}
                  className="p-0.5"
                >
                  <Star className={cn('size-6', filled ? 'fill-warning text-warning' : 'text-border')} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="review-comment" className="text-sm font-medium text-foreground">
            {t('reviews.writeReviewModal.commentLabel')}
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
            maxLength={MAX_COMMENT_LENGTH}
            placeholder={t('reviews.writeReviewModal.commentPlaceholder')}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <p className="text-right text-xs text-muted-foreground tabular-nums">
            {comment.length}/{MAX_COMMENT_LENGTH}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-foreground">
            {t('reviews.writeReviewModal.imagesLabel')}
          </p>
          <div className="flex flex-wrap gap-2">
            {images.map((src, index) => (
              <div key={src} className="relative size-16 overflow-hidden rounded-md border border-border">
                <img src={src} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label={t('reviews.writeReviewModal.removeImage')}
                  className="absolute right-0.5 top-0.5 rounded-full bg-background/80 p-0.5 text-foreground"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <label
                htmlFor="review-images"
                className="flex size-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary"
              >
                <ImagePlus className="size-5" />
                <span className="text-[10px]">{t('reviews.writeReviewModal.addImage')}</span>
                <input
                  id="review-images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleImageSelect}
                />
              </label>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {t('reviews.writeReviewModal.imagesHint', { count: MAX_IMAGES })}
          </p>
        </div>

        <Button type="submit" disabled={!canSubmit}>
          {isEditing ? t('reviews.writeReviewModal.saveChanges') : t('reviews.writeReviewModal.submit')}
        </Button>
      </form>
    </Modal>
  );
}
