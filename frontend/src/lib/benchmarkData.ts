// Industry benchmarks for AI spend per developer per month
// Sources: publicly available surveys and reports, 2025-2026
// These are estimates — label them clearly as such in the UI

export interface BenchmarkData {
  useCase: string;
  teamSizeLabel: string;
  avgSpendPerDev: number;
  p25SpendPerDev: number;
  p75SpendPerDev: number;
  commonTools: string[];
}

export const BENCHMARKS: BenchmarkData[] = [
  {
    useCase: 'coding',
    teamSizeLabel: '1-5',
    avgSpendPerDev: 45,
    p25SpendPerDev: 20,
    p75SpendPerDev: 80,
    commonTools: ['Cursor', 'GitHub Copilot', 'Claude'],
  },
  {
    useCase: 'coding',
    teamSizeLabel: '6-20',
    avgSpendPerDev: 55,
    p25SpendPerDev: 25,
    p75SpendPerDev: 95,
    commonTools: ['Cursor', 'GitHub Copilot', 'ChatGPT', 'Claude'],
  },
  {
    useCase: 'coding',
    teamSizeLabel: '21-50',
    avgSpendPerDev: 65,
    p25SpendPerDev: 30,
    p75SpendPerDev: 110,
    commonTools: ['GitHub Copilot', 'ChatGPT', 'Claude', 'Cursor'],
  },
  {
    useCase: 'writing',
    teamSizeLabel: '1-5',
    avgSpendPerDev: 25,
    p25SpendPerDev: 10,
    p75SpendPerDev: 50,
    commonTools: ['ChatGPT', 'Claude', 'Gemini'],
  },
  {
    useCase: 'writing',
    teamSizeLabel: '6-20',
    avgSpendPerDev: 30,
    p25SpendPerDev: 15,
    p75SpendPerDev: 60,
    commonTools: ['ChatGPT', 'Claude'],
  },
  {
    useCase: 'mixed',
    teamSizeLabel: '1-5',
    avgSpendPerDev: 35,
    p25SpendPerDev: 15,
    p75SpendPerDev: 70,
    commonTools: ['ChatGPT', 'Claude', 'Cursor'],
  },
  {
    useCase: 'mixed',
    teamSizeLabel: '6-20',
    avgSpendPerDev: 50,
    p25SpendPerDev: 20,
    p75SpendPerDev: 90,
    commonTools: ['ChatGPT', 'Claude', 'Cursor', 'GitHub Copilot'],
  },
  {
    useCase: 'research',
    teamSizeLabel: '1-5',
    avgSpendPerDev: 40,
    p25SpendPerDev: 20,
    p75SpendPerDev: 120,
    commonTools: ['Claude', 'ChatGPT', 'Gemini'],
  },
  {
    useCase: 'data',
    teamSizeLabel: '1-5',
    avgSpendPerDev: 55,
    p25SpendPerDev: 25,
    p75SpendPerDev: 130,
    commonTools: ['Claude', 'ChatGPT', 'Gemini Ultra'],
  },
];

export function getBenchmark(useCase: string, teamSize: string): BenchmarkData | null {
  const sizeNumber = ({ '1': 1, '2-5': 3, '6-15': 10, '16-50': 25, '50+': 60 } as Record<string, number>)[teamSize] ?? 5;
  const sizeLabel = sizeNumber <= 5 ? '1-5' : sizeNumber <= 20 ? '6-20' : '21-50';

  // Normalize use case to lowercase and map "data analysis" → "data"
  const lc = useCase.toLowerCase();
  const normalizedUseCase = lc === 'data analysis' ? 'data'
    : ['coding', 'writing', 'data', 'research', 'mixed'].includes(lc) ? lc
    : 'mixed';

  return BENCHMARKS.find(b => b.useCase === normalizedUseCase && b.teamSizeLabel === sizeLabel) ?? null;
}

export function getSpendPerDev(totalSpend: number, teamSize: string): number {
  const sizeNumber = ({ '1': 1, '2-5': 3, '6-15': 10, '16-50': 25, '50+': 60 } as Record<string, number>)[teamSize] ?? 5;
  return Math.round(totalSpend / sizeNumber);
}
