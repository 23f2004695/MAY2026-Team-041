import { Badge } from '@/components/ui';

export interface PlaceholderPageProps {
  title: string;
  description: string;
}

// ponytail: one generic page instead of 16 near-identical files; split out once a page grows real content.
export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-3 p-8">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      <Badge variant="outline" className="w-fit">
        Coming soon
      </Badge>
    </div>
  );
}
