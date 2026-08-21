import { Badge, type BadgeVariant } from '@/components/ui';

// Shared by BookDetailsPage's AI Book Insights card and the profile's AI Reading Profile
// card — both surface the same Beginner/Intermediate/Advanced/Unknown vocabulary the
// backend's single AI-insights call returns (see books/insights.py).
const VARIANT_BY_DIFFICULTY: Record<string, BadgeVariant> = {
  Beginner: 'success',
  Intermediate: 'warning',
  Advanced: 'danger',
};

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return <Badge variant={VARIANT_BY_DIFFICULTY[difficulty] ?? 'outline'}>{difficulty}</Badge>;
}
