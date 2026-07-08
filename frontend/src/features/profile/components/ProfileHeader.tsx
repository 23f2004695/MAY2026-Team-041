import { Avatar, Badge, Button } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';

export interface ProfileHeaderProps {
  name: string;
  email: string;
  joinDate: string;
  membershipPlan: string;
}

export function ProfileHeader({ name, email, joinDate, membershipPlan }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Avatar name={name} size="lg" />
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{name}</h1>
          <p className="text-sm text-muted-foreground">{email}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="success">{membershipPlan}</Badge>
            <span className="text-xs text-muted-foreground">Member since {joinDate}</span>
          </div>
        </div>
      </div>
      <Button variant="outline" onClick={() => comingSoonToast('Editing your profile')}>
        Edit Profile
      </Button>
    </div>
  );
}
