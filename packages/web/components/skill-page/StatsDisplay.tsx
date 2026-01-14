interface StatsDisplayProps {
  installs: number;
  installsWeekly?: number[];
}

function Sparkline({ data }: { data: number[] }) {
  if (!data || data.length < 2) return null;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 24;
  const width = 80;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg className="w-20 h-6" viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="text-accent"
      />
    </svg>
  );
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default function StatsDisplay({ installs, installsWeekly }: StatsDisplayProps) {
  return (
    <div className="rounded-lg border border-border bg-gray-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-xs font-medium text-gray-500 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Installs
          </div>
          <div className="text-xl font-semibold text-foreground mt-0.5">
            {formatNumber(installs)}
          </div>
        </div>
        {installsWeekly && installsWeekly.length > 1 && (
          <Sparkline data={installsWeekly} />
        )}
      </div>
    </div>
  );
}
