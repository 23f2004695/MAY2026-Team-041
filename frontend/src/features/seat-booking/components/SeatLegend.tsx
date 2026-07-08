export function SeatLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
      <span className="flex items-center gap-2">
        <span className="size-3 rounded-sm bg-success" /> Available
      </span>
      <span className="flex items-center gap-2">
        <span className="size-3 rounded-sm bg-warning" /> Reserved
      </span>
      <span className="flex items-center gap-2">
        <span className="size-3 rounded-sm bg-danger" /> Occupied
      </span>
    </div>
  );
}
