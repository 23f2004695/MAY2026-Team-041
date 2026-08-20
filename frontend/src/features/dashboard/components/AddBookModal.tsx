import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Input, Modal, Select, Textarea } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';

export interface BookDraft {
  title: string;
  author: string;
  category: string;
  description: string;
  isbn: string;
  publishedYear: string;
  totalCopies: string;
}

export interface AddBookModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: BookDraft) => void | Promise<void>;
  categories: string[];
}

const EMPTY_DRAFT: BookDraft = {
  title: '',
  author: '',
  category: '',
  description: '',
  isbn: '',
  publishedYear: '',
  totalCopies: '0',
};

export function AddBookModal({ open, onClose, onSubmit, categories }: AddBookModalProps) {
  const { t } = useTranslation();
  const { suggestBookDescription } = useAuth();
  const [draft, setDraft] = useState<BookDraft>(EMPTY_DRAFT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  // Re-sync to a blank draft whenever the modal transitions to open, same pattern as
  // CreatePostModal — this is a "create", never an "edit", so there's no initialValues case.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setDraft(EMPTY_DRAFT);
      setIsSubmitting(false);
      setSuggestError(null);
    }
  }

  function update<K extends keyof BookDraft>(key: K, value: BookDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSuggestDescription() {
    setSuggestError(null);
    setIsSuggesting(true);
    try {
      const description = await suggestBookDescription({
        title: draft.title.trim(),
        author: draft.author.trim(),
        category: draft.category || undefined,
      });
      update('description', description);
    } catch {
      setSuggestError(t('managerDashboard.books.addModal.suggestFailed'));
    } finally {
      setIsSuggesting(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(draft);
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSuggest = draft.title.trim().length > 0 && draft.author.trim().length > 0 && !isSuggesting;
  const canSubmit =
    draft.title.trim().length > 0 && draft.author.trim().length > 0 && draft.category.length > 0;

  return (
    <Modal open={open} onClose={onClose} title={t('managerDashboard.books.addModal.title')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label={t('managerDashboard.books.addModal.titleLabel')}
          value={draft.title}
          onChange={(event) => update('title', event.target.value)}
          required
        />
        <Input
          label={t('managerDashboard.books.addModal.authorLabel')}
          value={draft.author}
          onChange={(event) => update('author', event.target.value)}
          required
        />
        <Select
          label={t('managerDashboard.books.addModal.categoryLabel')}
          value={draft.category}
          onChange={(event) => update('category', event.target.value)}
          placeholder={t('managerDashboard.books.addModal.categoryPlaceholder')}
          options={categories.map((value) => ({ value, label: value }))}
          required
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="book-description" className="text-sm font-medium text-foreground">
              {t('managerDashboard.books.addModal.descriptionLabel')}
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSuggestDescription}
              disabled={!canSuggest}
              isLoading={isSuggesting}
            >
              <Sparkles className="size-3.5" />
              {t('managerDashboard.books.addModal.suggestButton')}
            </Button>
          </div>
          <Textarea
            id="book-description"
            value={draft.description}
            onChange={(event) => update('description', event.target.value)}
            rows={4}
            placeholder={t('managerDashboard.books.addModal.descriptionPlaceholder')}
          />
          <p className="text-xs text-muted-foreground">
            {t('managerDashboard.books.addModal.suggestHint')}
          </p>
          {suggestError && (
            <p role="alert" className="text-xs text-danger">
              {suggestError}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t('managerDashboard.books.addModal.isbnLabel')}
            value={draft.isbn}
            onChange={(event) => update('isbn', event.target.value)}
          />
          <Input
            label={t('managerDashboard.books.addModal.publishedYearLabel')}
            type="number"
            value={draft.publishedYear}
            onChange={(event) => update('publishedYear', event.target.value)}
          />
        </div>

        <Input
          label={t('managerDashboard.books.addModal.totalCopiesLabel')}
          type="number"
          min={0}
          value={draft.totalCopies}
          onChange={(event) => update('totalCopies', event.target.value)}
        />

        <Button type="submit" disabled={!canSubmit} isLoading={isSubmitting}>
          {t('managerDashboard.books.addModal.submit')}
        </Button>
      </form>
    </Modal>
  );
}
