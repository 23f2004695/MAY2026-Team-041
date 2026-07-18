import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Avatar, Card, CardContent, CardHeader } from '@/components/ui';
import { cn } from '@/lib/cn';

export interface ReviewCardProps {
  name: string;
  role: string;
  quote: string;
  rating?: number;
  className?: string;
}

export function ReviewCard({ name, role, quote, rating, className }: ReviewCardProps) {
  const { t } = useTranslation();

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <Avatar name={name} size="md" />
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {rating != null && (
          <div className="flex" aria-label={t('common.cards.review.ratedOutOf5', { rating })}>
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                className={cn(
                  'size-4',
                  index < rating ? 'fill-warning text-warning' : 'text-border',
                )}
              />
            ))}
          </div>
        )}
        <p className="text-sm text-muted-foreground">&ldquo;{quote}&rdquo;</p>
      </CardContent>
    </Card>
  );
}
