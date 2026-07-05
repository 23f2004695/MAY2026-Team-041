export interface WelcomeSectionProps {
  name: string;
  membershipPlan: string;
}

export function WelcomeSection({ name, membershipPlan }: WelcomeSectionProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Welcome back, {name.split(' ')[0]}</h1>
      <p className="mt-1 text-muted-foreground">
        {membershipPlan} · Here’s what’s happening with your library
      </p>
    </div>
  );
}
