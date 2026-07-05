import type { LucideIcon } from 'lucide-react';

import { Card } from '@/components/ui';
import { cn } from '@/lib/cn';

export interface StatisticCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}

export function StatisticCard({ icon: Icon, label, value, className }: StatisticCardProps) {
  return (
    <Card className={cn('flex items-center gap-3.5 p-5', className)}>
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}
