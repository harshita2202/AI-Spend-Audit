import { getBenchmark, getSpendPerDev } from '@/lib/benchmarkData';

interface BenchmarkCardProps {
  totalSpend: number;
  teamSize: string;
  useCase: string;
}

export function BenchmarkCard({ totalSpend, teamSize, useCase }: BenchmarkCardProps) {
  const benchmark = getBenchmark(useCase, teamSize);
  const yourSpendPerDev = getSpendPerDev(totalSpend, teamSize);

  if (!benchmark) return null;

  const position =
    yourSpendPerDev <= benchmark.p25SpendPerDev ? 'frugal'
    : yourSpendPerDev <= benchmark.avgSpendPerDev ? 'below-average'
    : yourSpendPerDev <= benchmark.p75SpendPerDev ? 'above-average'
    : 'heavy-spender';

  const positionConfig = {
    'frugal': {
      label: 'Below industry average',
      color: 'text-green-600',
      bg: 'bg-green-50 border-green-200',
      description: 'Your team spends less than 75% of similar teams.',
    },
    'below-average': {
      label: 'In line with industry',
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
      description: 'Your spend is typical for your team size and use case.',
    },
    'above-average': {
      label: 'Above industry average',
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
      description: 'Your team spends more than most similar teams.',
    },
    'heavy-spender': {
      label: 'Significantly above average',
      color: 'text-red-600',
      bg: 'bg-red-50 border-red-200',
      description: 'Your spend is in the top 25% for your category.',
    },
  };

  const config = positionConfig[position];

  const barPercent = Math.min(
    Math.round((yourSpendPerDev / (benchmark.p75SpendPerDev * 1.5)) * 100),
    100,
  );

  return (
    <div className={`rounded-sm border p-5 ${config.bg}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">
            Spend per developer benchmark
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Based on {useCase} teams of similar size · Estimates only
          </p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-sm ${config.color} bg-white border whitespace-nowrap`}>
          {config.label}
        </span>
      </div>

      <div className="flex items-end gap-6 mb-4">
        <div>
          <p className="text-2xl font-bold text-gray-900">${yourSpendPerDev}</p>
          <p className="text-xs text-gray-500">your spend / dev / mo</p>
        </div>
        <div className="text-gray-400 text-sm pb-1">vs</div>
        <div>
          <p className="text-2xl font-bold text-gray-600">${benchmark.avgSpendPerDev}</p>
          <p className="text-xs text-gray-500">industry avg / dev / mo</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Frugal (${benchmark.p25SpendPerDev})</span>
          <span>Avg (${benchmark.avgSpendPerDev})</span>
          <span>Heavy (${benchmark.p75SpendPerDev}+)</span>
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 opacity-30" />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-900 border-2 border-white shadow"
            style={{ left: `calc(${barPercent}% - 6px)` }}
          />
        </div>
      </div>

      <p className="text-xs text-gray-600">{config.description}</p>
    </div>
  );
}
