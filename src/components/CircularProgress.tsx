interface CircularProgressProps {
  percentage: number;
  scrapedCount: number;
  totalCount: number;
}

export default function CircularProgress({ percentage, scrapedCount, totalCount }: CircularProgressProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg width={140} height={140} className="transform -rotate-90">
          <circle
            cx={70}
            cy={70}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={8}
          />
          <circle
            cx={70}
            cy={70}
            r={radius}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={8}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <div className="text-2xl font-bold text-slate-800">{percentage}%</div>
          <div className="text-xs text-slate-600 text-center">
            {scrapedCount} / {totalCount}
          </div>
        </div>
      </div>
    </div>
  );
}
