interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function ProgressBar({ currentStep, totalSteps, labels }: ProgressBarProps) {
  return (
    <div className="flex items-center">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className={`w-7 h-7 rounded-sm text-xs font-bold flex items-center justify-center font-display transition-colors ${
                step === currentStep
                  ? "bg-primary text-white"
                  : step < currentStep
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-fg"
              }`}
            >
              {step}
            </div>
            <span
              className={`text-xs font-medium hidden sm:block ${
                step === currentStep ? "text-foreground" : "text-muted-fg"
              }`}
            >
              {labels[index]}
            </span>
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`flex-1 h-px mx-3 ${
                step < currentStep ? "bg-primary/30" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
