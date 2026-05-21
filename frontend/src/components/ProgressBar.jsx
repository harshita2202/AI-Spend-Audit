import React from "react";

export function ProgressBar({ currentStep, totalSteps, labels }) {
  return (
    <div className="w-full flex items-center">
      {labels.map((label, index) => {
        const step = index + 1;
        const isDone = step < currentStep;
        const isActive = step === currentStep;

        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-sm flex items-center justify-center text-xs font-black transition-all duration-300 font-display ${
                    isDone
                      ? "bg-primary text-white"
                      : isActive
                      ? "bg-primary-light text-primary border-2 border-primary"
                      : "bg-muted text-muted-fg border border-border"
                  }`}
                >
                  {isDone ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : step}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:block font-display ${
                    isActive ? "text-primary" : isDone ? "text-foreground" : "text-muted-fg"
                  }`}
                >
                  {label}
                </span>
              </div>
            </div>

            {index < totalSteps - 1 && (
              <div className="flex-1 mx-3 h-px relative">
                <div className="absolute inset-0 bg-border" />
                <div
                  className="absolute inset-y-0 left-0 bg-primary transition-all duration-500"
                  style={{ width: isDone ? "100%" : "0%" }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
