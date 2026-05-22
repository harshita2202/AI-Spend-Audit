import { useEffect, useState } from "react";

function useCountUp(target: number, duration = 1400): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

interface SavingsHeroProps {
  monthlySavings: number;
  annualSavings: number;
}

export function SavingsHero({ monthlySavings, annualSavings }: SavingsHeroProps) {
  const animatedMonthly = useCountUp(monthlySavings);
  const animatedAnnual = useCountUp(annualSavings, 1700);

  return (
    <div
      className="relative overflow-hidden rounded-sm"
      style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 55%, #ecfdf5 100%)",
        border: "1px solid #86efac",
      }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />

      <div className="pl-6 pr-6 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-1 font-mono-app">
            Potential monthly savings
          </p>
          <div className="text-6xl sm:text-7xl font-black text-green-600 leading-none font-display">
            ${animatedMonthly.toLocaleString()}
          </div>
          <p className="text-green-700 mt-1 text-sm font-medium">
            per month — saves you{" "}
            <span className="font-black text-green-800 font-display">
              ${animatedAnnual.toLocaleString()}
            </span>{" "}
            annually
          </p>
        </div>

        <div className="flex-shrink-0 flex flex-col items-start sm:items-end gap-1">
          <div className="text-xs font-bold uppercase tracking-widest text-green-800 bg-green-200 px-3 py-1 rounded-sm font-mono-app">
            Savings found
          </div>
          <p className="text-xs text-green-700/80 max-w-[180px] text-left sm:text-right leading-snug">
            Based on your current seat counts and plan tiers
          </p>
        </div>
      </div>
    </div>
  );
}
