import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImagePlus, Star, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button, Input, Modal } from '@/components/ui';
import { cn } from '@/lib/cn';
import { fileToResizedDataUrl } from '@/lib/image';
import type { BookReview } from '@/mocks/reviews';

interface WriteReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (review: BookReview) => void;
}

const EMPTY = { reviewer: '', rating: 0, comment: '' };

export function WriteReviewModal({ open, onClose, onSubmit }: WriteReviewModalProps) {
  const { t } = useTranslation('reviews');
  const [form, setForm] = useState(EMPTY);
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(undefined);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setForm(EMPTY);
    setImageDataUrl(undefined);
    setImageLoading(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageLoading(true);
    try {
      setImageDataUrl(await fileToResizedDataUrl(file));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('modal.errors.imageFailed'));
    } finally {
      setImageLoading(false);
    }
  }

  function removeImage() {
    setImageDataUrl(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleSubmit() {
    if (!form.reviewer.trim() || !form.comment.trim() || form.rating < 1) {
      setError(t('modal.errors.missingFields'));
      return;
    }
    onSubmit({
      id: crypto.randomUUID(),
      reviewer: form.reviewer.trim(),
      rating: form.rating,
      comment: form.comment.trim(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      imageDataUrl,
    });
    toast.success(t('modal.toast.posted'));
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t('modal.title')}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            {t('modal.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={imageLoading}>
            {t('modal.submit')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label={t('modal.fields.name.label')}
          placeholder={t('modal.fields.name.placeholder')}
          value={form.reviewer}
          onChange={(e) => setForm((f) => ({ ...f, reviewer: e.target.value }))}
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">
            {t('modal.fields.rating.label')}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, index) => {
              const starValue = index + 1;
              return (
                <button
                  key={starValue}
                  type="button"
                  aria-label={t('modal.fields.rating.starLabel', { count: starValue })}
                  aria-pressed={form.rating === starValue}
                  onClick={() => setForm((f) => ({ ...f, rating: starValue }))}
                  className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Star
                    className={cn(
                      'size-7 transition-colors',
                      starValue <= form.rating ? 'fill-warning text-warning' : 'text-border',
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="review-comment" className="text-sm font-medium text-foreground">
            {t('modal.fields.comment.label')}
          </label>
          <textarea
            id="review-comment"
            rows={4}
            placeholder={t('modal.fields.comment.placeholder')}
            value={form.comment}
            onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">
            {t('modal.fields.photo.label')}
          </span>
          {imageDataUrl ? (
            <div className="relative w-fit">
              <img
                src={imageDataUrl}
                alt={t('modal.fields.photo.previewAlt')}
                className="max-h-40 rounded-md border border-border object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                aria-label={t('modal.fields.photo.remove')}
                className="absolute -end-2 -top-2 flex size-6 items-center justify-center rounded-full bg-foreground text-background shadow-sm"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
              <ImagePlus className="size-4" />
              {imageLoading ? t('modal.fields.photo.uploading') : t('modal.fields.photo.upload')}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    </Modal>
  );
}
