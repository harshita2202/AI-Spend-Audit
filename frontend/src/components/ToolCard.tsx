import type { ToolConfig, ToolFormData } from "@/lib/types";

interface ToolCardProps {
  tool: ToolConfig;        // was: Tool
  value: ToolFormData;     // was: ToolFormValue
  onChange: (data: ToolFormData) => void;  // was: ToolFormValue
}

export function ToolCard({ tool, value, onChange }: ToolCardProps) {
  const handleToggle = () => onChange({ ...value, enabled: !value.enabled });

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const planLabel = e.target.value;
    const plan = tool.plans.find((p) => p.label === planLabel);
    const autoSpend =
      plan && plan.pricePerSeat !== null && !plan.custom
        ? Math.round(plan.pricePerSeat * value.seats)
        : value.monthlySpend;
    onChange({ ...value, planLabel, monthlySpend: autoSpend });
  };

  const handleSeatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seats = Math.max(1, Number(e.target.value));
    const plan = tool.plans.find((p) => p.label === value.planLabel);
    const autoSpend =
      plan && plan.pricePerSeat !== null && !plan.custom
        ? Math.round(plan.pricePerSeat * seats)
        : value.monthlySpend;
    onChange({ ...value, seats, monthlySpend: autoSpend });
  };

  return (
    <div
      className={`bg-card rounded-sm border transition-all duration-200 overflow-hidden ${
        value.enabled ? "border-border shadow-sm" : "border-border/40 opacity-55"
      }`}
      style={value.enabled ? { borderLeft: `3px solid ${tool.color}` } : {}}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-7 h-7 rounded-sm flex items-center justify-center text-white text-xs font-bold flex-shrink-0 font-display"
            style={{ backgroundColor: tool.color }}
          >
            {tool.initials}
          </div>
          <span className="font-semibold text-foreground text-sm font-display">{tool.name}</span>
          {tool.apiDirect && (
            <span className="text-xs text-muted-fg hidden sm:block font-mono-app">API</span>
          )}
        </div>

        <button
          onClick={handleToggle}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
            value.enabled ? "bg-primary" : "bg-gray-200"
          }`}
          role="switch"
          aria-checked={value.enabled}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
              value.enabled ? "translate-x-4.5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {value.enabled && (
        <div className="px-4 pb-4 border-t border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-fg mb-1.5 block font-mono-app">
                Plan
              </label>
              <select
                value={value.planLabel}
                onChange={handlePlanChange}
                className="w-full h-8 text-sm rounded-sm border border-border bg-white px-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {tool.plans.map((plan) => (
                  <option key={plan.label} value={plan.label}>
                    {plan.label}
                    {plan.pricePerSeat !== null && !plan.custom
                      ? ` · $${plan.pricePerSeat}/seat`
                      : plan.custom
                      ? " · custom"
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-fg mb-1.5 block font-mono-app">
                Monthly Spend
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-fg text-sm">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  value={value.monthlySpend}
                  onChange={(e) => onChange({ ...value, monthlySpend: Number(e.target.value) })}
                  className="w-full h-8 pl-6 text-sm rounded-sm border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono-app"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-fg mb-1.5 block font-mono-app">
                Seats
              </label>
              <input
                type="number"
                min={1}
                value={value.seats}
                onChange={handleSeatsChange}
                className="w-full h-8 text-sm rounded-sm border border-border bg-white px-2 focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono-app"
                placeholder="1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
