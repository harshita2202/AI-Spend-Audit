import type { ToolRecommendation } from "@/lib/types";

const STATUS_CONFIG = {
  overspending: {
    accent: "#ef4444",
    bgTint: "bg-red-50/80",
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
    badgeLabel: "Overspending",
    numberColor: "#ef4444",
  },
  optimize: {
    accent: "#f59e0b",
    bgTint: "bg-amber-50/60",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    badgeLabel: "Can optimize",
    numberColor: "#f59e0b",
  },
  optimal: {
    accent: "#22c55e",
    bgTint: "bg-green-50/60",
    badgeBg: "bg-green-100",
    badgeText: "text-green-700",
    badgeLabel: "Optimal",
    numberColor: "#22c55e",
  },
};

interface AuditResultCardProps {
  recommendation: ToolRecommendation;
}

export function AuditResultCard({ recommendation }: AuditResultCardProps) {
  const cfg = STATUS_CONFIG[recommendation.status];

  return (
    <div
      className="relative bg-card overflow-hidden lift-card cursor-default"
      style={{
        border: "1px solid #e0ddf5",
        borderLeft: `4px solid ${cfg.accent}`,
        borderRadius: "0.5rem",
      }}
    >
      <div className={`${cfg.bgTint} px-5 pt-4 pb-3`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-sm font-mono-app ${cfg.badgeBg} ${cfg.badgeText} flex-shrink-0 uppercase tracking-wide`}>
              {cfg.badgeLabel}
            </span>
            <h3 className="font-semibold text-foreground text-base truncate font-display">
              {recommendation.toolName}
            </h3>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-2xl font-black font-display" style={{ color: cfg.numberColor }}>
              {recommendation.potentialSaving > 0 ? `-$${recommendation.potentialSaving}` : "✓"}
            </span>
            {recommendation.potentialSaving > 0 && (
              <span className="text-xs text-muted-fg block -mt-0.5">/month</span>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-3 space-y-3">
        <div className="flex items-center gap-5 text-sm">
          <div>
            <span className="text-muted-fg text-xs uppercase tracking-widest font-mono-app">Current</span>
            <p className="font-semibold text-foreground font-display">${recommendation.currentSpend}/mo</p>
          </div>
          {recommendation.potentialSaving > 0 && (
            <>
              <div className="w-px h-8 bg-border flex-shrink-0" />
              <div>
                <span className="text-muted-fg text-xs uppercase tracking-widest font-mono-app">Annual impact</span>
                <p className="font-semibold text-green-600 font-display">
                  −${(recommendation.potentialSaving * 12).toLocaleString()}/yr
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-start gap-2.5 bg-muted rounded px-3 py-2.5">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-fg flex-shrink-0 mt-0.5 font-mono-app">
            ACTION
          </span>
          <p className="text-sm font-medium text-foreground leading-snug">{recommendation.action}</p>
        </div>

        <p className="text-xs text-muted-fg leading-relaxed pb-1">{recommendation.reason}</p>
      </div>
    </div>
  );
}
