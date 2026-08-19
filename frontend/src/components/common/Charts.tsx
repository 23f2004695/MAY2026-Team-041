import { cn } from '@/lib/cn';

export interface TrendPoint {
  label: string;
  value: number;
}

export interface TrendLineChartProps {
  data: TrendPoint[];
  /** CSS color value, e.g. 'var(--color-primary)'. */
  color?: string;
  valueFormatter?: (value: number) => string;
  className?: string;
}

const CHART_WIDTH = 320;
const CHART_HEIGHT = 140;
const CHART_PADDING = 12;

interface Coord {
  x: number;
  y: number;
}

// Smooth curve: each segment is a cubic bezier with control points at the horizontal
// midpoint between the two points, so the curve eases in/out of every data point
// instead of the straight-line kinks a plain M/L path draws. Shared by every chart in
// this file so they all read as the same visual language.
function buildSmoothPath(coords: Coord[]): string {
  return coords.reduce((path, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = coords[i - 1];
    const midX = (prev.x + point.x) / 2;
    return `${path} C ${midX} ${prev.y}, ${midX} ${point.y}, ${point.x} ${point.y}`;
  }, '');
}

function xFor(index: number, count: number): number {
  return count === 1
    ? CHART_WIDTH / 2
    : CHART_PADDING + (index / (count - 1)) * (CHART_WIDTH - CHART_PADDING * 2);
}

export function TrendLineChart({
  data,
  color = 'var(--color-primary)',
  valueFormatter,
  className,
}: TrendLineChartProps) {
  if (data.length === 0) return null;

  const values = data.map((d) => d.value);
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const coords = data.map((d, i) => {
    const x = xFor(i, data.length);
    const y = CHART_HEIGHT - CHART_PADDING - ((d.value - min) / range) * (CHART_HEIGHT - CHART_PADDING * 2);
    return { x, y };
  });

  const linePath = buildSmoothPath(coords);
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${CHART_HEIGHT - CHART_PADDING} L ${coords[0].x} ${CHART_HEIGHT - CHART_PADDING} Z`;
  const showZeroLine = min < 0 && max > 0;
  const zeroY = CHART_HEIGHT - CHART_PADDING - ((0 - min) / range) * (CHART_HEIGHT - CHART_PADDING * 2);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        preserveAspectRatio="none"
        className="h-36 w-full"
        role="img"
      >
        {showZeroLine && (
          <line
            x1={CHART_PADDING}
            y1={zeroY}
            x2={CHART_WIDTH - CHART_PADDING}
            y2={zeroY}
            stroke="var(--color-border)"
            strokeDasharray="4 4"
          />
        )}
        <path d={areaPath} fill={color} opacity={0.12} />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={3.5} fill={color} stroke="var(--color-surface)" strokeWidth={1.5} />
        ))}
      </svg>
      <div className="flex justify-between px-0.5 text-[10px] text-muted-foreground">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
      {valueFormatter && (
        <div className="flex justify-between px-0.5 text-[10px] font-medium text-foreground">
          {data.map((d) => (
            <span key={d.label}>{valueFormatter(d.value)}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export interface MultiTrendPoint {
  label: string;
  values: Record<string, number>;
}

export interface MultiTrendSeries {
  key: string;
  label: string;
  /** CSS color value, e.g. 'var(--color-primary)'. */
  color: string;
}

export interface MultiLineTrendChartProps {
  data: MultiTrendPoint[];
  series: MultiTrendSeries[];
  className?: string;
}

// Same smooth-curve construction as TrendLineChart, but for two or more series sharing
// one axis (e.g. issued vs. returned) — no area fill, since overlapping fills between
// series read as noise rather than signal, plus a legend since color is now the only
// way to tell series apart.
export function MultiLineTrendChart({ data, series, className }: MultiLineTrendChartProps) {
  if (data.length === 0 || series.length === 0) return null;

  const allValues = data.flatMap((d) => series.map((s) => d.values[s.key] ?? 0));
  const max = Math.max(...allValues, 0);
  const min = Math.min(...allValues, 0);
  const range = max - min || 1;

  function yFor(value: number): number {
    return CHART_HEIGHT - CHART_PADDING - ((value - min) / range) * (CHART_HEIGHT - CHART_PADDING * 2);
  }

  const seriesCoords = series.map((s) => ({
    series: s,
    coords: data.map((d, i) => ({ x: xFor(i, data.length), y: yFor(d.values[s.key] ?? 0) })),
  }));

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {series.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        preserveAspectRatio="none"
        className="h-36 w-full"
        role="img"
      >
        {seriesCoords.map(({ series: s, coords }) => (
          <g key={s.key}>
            <path
              d={buildSmoothPath(coords)}
              fill="none"
              stroke={s.color}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {coords.map((c, i) => (
              <circle
                key={i}
                cx={c.x}
                cy={c.y}
                r={3}
                fill={s.color}
                stroke="var(--color-surface)"
                strokeWidth={1.5}
              />
            ))}
          </g>
        ))}
      </svg>
      <div className="flex justify-between px-0.5 text-[10px] text-muted-foreground">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
