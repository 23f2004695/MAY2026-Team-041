import { BookOpen, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Badge, Button } from '@/components/ui';
import { cn } from '@/lib/cn';

export interface BookCardProps {
  title: string;
  author: string;
  category: string;
  available: boolean;
  rating: number;
  href: string;
  onReserve?: () => void;
  className?: string;
}

export function BookCard({
  title,
  author,
  category,
  available,
  rating,
  href,
  onReserve,
  className,
}: BookCardProps) {
  const { t } = useTranslation('books');
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary/40',
        className,
      )}
    >
      <Link to={href} className="flex flex-col gap-3">
        <div className="flex h-32 items-center justify-center rounded-md bg-primary/10 text-primary">
          <BookOpen className="size-8" />
        </div>
        <div>
          <p className="line-clamp-2 font-semibold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{author}</p>
        </div>
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{category}</Badge>
        <Badge variant={available ? 'success' : 'danger'}>
          {available ? t('status.available') : t('status.checkedOut')}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="size-4 fill-warning text-warning" />
          {rating.toFixed(1)}
        </span>
        <Button
          size="sm"
          variant={available ? 'primary' : 'outline'}
          disabled={!available}
          onClick={onReserve}
        >
          {t('reserveThisBook')}
        </Button>
      </div>
    </div>
  );
}
