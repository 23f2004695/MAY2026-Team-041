import { Star } from 'lucide-react';

import { Avatar, Card, CardContent, CardHeader } from '@/components/ui';
import { cn } from '@/lib/cn';

export interface ReviewCardProps {
  name: string;
  role: string;
  quote: string;
  rating?: number;
  imageUrl?: string;
  className?: string;
}

export function ReviewCard({ name, role, quote, rating, imageUrl, className }: ReviewCardProps) {
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
          <div className="flex" aria-label={`Rated ${rating} out of 5`}>
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
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`Photo shared by ${name}`}
            className="mt-1 max-h-56 w-full rounded-md border border-border object-cover"
          />
        )}
      </CardContent>
    </Card>
  );
}
