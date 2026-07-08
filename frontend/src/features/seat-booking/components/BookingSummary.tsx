import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export interface BookingSummaryProps {
  selectedSeatId: string | null;
  onConfirm: () => void;
}

export function BookingSummary({ selectedSeatId, onConfirm }: BookingSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {selectedSeatId ? (
          <p className="text-sm text-foreground">
            Seat <span className="font-semibold">{selectedSeatId}</span> selected for today
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Select an available seat to continue.</p>
        )}
        <Button disabled={!selectedSeatId} onClick={onConfirm}>
          Confirm Booking
        </Button>
      </CardContent>
    </Card>
  );
}
