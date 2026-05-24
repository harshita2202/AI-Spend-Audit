import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Navbar } from "@/components/Navbar";
import { ProgressBar } from "@/components/ProgressBar";
import { ToolCard } from "@/components/ToolCard";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { TOOLS } from "@/lib/mockData";
import { runAudit } from "@/lib/auditEngine";
import { saveAudit } from "@/lib/api";
import type { AuditFormData, TeamSize, UseCase, ToolFormData } from "@/lib/types";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

const STEP_LABELS = ["Team basics", "AI tools", "Review"];

const DEFAULT_TOOL: ToolFormData = {
  enabled: false,
  planLabel: "",
  monthlySpend: 0,
  seats: 1,
};

function getDefaultTools(): Record<string, ToolFormData> {
  return Object.fromEntries(
    TOOLS.map((t) => [t.id, { ...DEFAULT_TOOL, planLabel: t.plans[0]?.label ?? "" }])
  );
}

const DEFAULT_FORM: AuditFormData = {
  teamSize: "6-15",
  useCase: "Mixed",
  tools: getDefaultTools(),
};

const USE_CASES: UseCase[] = ["Coding", "Writing", "Data analysis", "Research", "Mixed"];
const TEAM_SIZES: TeamSize[] = ["1", "2-5", "6-15", "16-50", "50+"];

export default function AuditForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useFormPersistence("spendsense-audit-form", DEFAULT_FORM) as [
    AuditFormData,
    React.Dispatch<React.SetStateAction<AuditFormData>>
  ];
  const [, setLocation] = useLocation();
  const [isRunning, setIsRunning] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  const updateTool = (toolId: string, data: ToolFormData) => {
    setFormData({ ...formData, tools: { ...formData.tools, [toolId]: data } });
  };

  const handleRunAudit = async () => {
    setAuditError(null);
    const enabledToolsList = Object.values(formData.tools).filter((t) => t?.enabled);
    if (enabledToolsList.length === 0) {
      setAuditError("Please enable at least one AI tool to audit.");
      return;
    }
    setIsRunning(true);
    try {
      const result = await runAudit(formData);
      const uuid = await saveAudit(formData, result);
      sessionStorage.setItem(`audit-result-${uuid}`, JSON.stringify({ input: formData, result }));
      setLocation(`/results/${uuid}`);
    } catch (err) {
      console.error("Audit failed:", err);
      setIsRunning(false);
    }
  };

  const enabledTools = TOOLS.filter((t) => formData.tools[t.id]?.enabled);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16 px-5">
        <div className="max-w-2xl mx-auto">
          <div className="pt-4 mb-7">
            <p
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1"
              style={{ fontFamily: "var(--app-font-mono)" }}
            >
              Free audit tool
            </p>
            <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "var(--app-font-display)" }}>
              Audit your AI stack
            </h1>
          </div>

          <div className="mb-7">
            <ProgressBar currentStep={step} totalSteps={3} labels={STEP_LABELS} />
          </div>

          {step === 1 && (
            <div className="bg-card rounded-sm border border-border overflow-hidden" data-testid="step-1">
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <span
                  className="text-xs font-bold uppercase tracking-widest text-foreground"
                  style={{ fontFamily: "var(--app-font-mono)" }}
                >
                  Step 01 — Team basics
                </span>
              </div>
              <div className="px-6 py-5 space-y-6">
                <div>
                  <Label
                    className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block"
                    htmlFor="team-size"
                    style={{ fontFamily: "var(--app-font-mono)" }}
                  >
                    Team size
                  </Label>
                  <Select
                    value={formData.teamSize}
                    onValueChange={(v) => setFormData({ ...formData, teamSize: v as TeamSize })}
                  >
                    <SelectTrigger id="team-size" className="rounded-sm">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAM_SIZES.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size === "1" ? "1 person (solo)" : `${size} people`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block"
                    style={{ fontFamily: "var(--app-font-mono)" }}
                  >
                    Primary use case
                  </Label>
                  <RadioGroup
                    value={formData.useCase}
                    onValueChange={(v) => setFormData({ ...formData, useCase: v as UseCase })}
                    className="flex flex-wrap gap-2"
                  >
                    {USE_CASES.map((uc) => (
                      <div key={uc}>
                        <RadioGroupItem value={uc} id={`use-case-${uc}`} className="sr-only" />
                        <Label
                          htmlFor={`use-case-${uc}`}
                          className={`px-3 py-1.5 text-sm font-semibold cursor-pointer rounded-sm border transition-all ${
                            formData.useCase === uc
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-foreground border-border hover:border-primary/40 hover:bg-primary/5"
                          }`}
                        >
                          {uc}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Button onClick={() => setStep(2)} className="w-full rounded-sm font-semibold gap-2">
                  Next: Select your tools
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Step 02</p>
                  <h2 className="text-lg font-black text-foreground">Toggle your AI tools</h2>
                </div>
                <span className="text-xs text-muted-foreground">{enabledTools.length} selected</span>
              </div>

              <div className="space-y-2 mb-5">
                {TOOLS.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    value={formData.tools[tool.id] ?? { ...DEFAULT_TOOL, planLabel: tool.plans[0]?.label ?? "" }}
                    onChange={(data) => updateTool(tool.id, data)}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1" disabled={enabledTools.length === 0}>
                  Review & Run Audit
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-card rounded-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "var(--app-font-mono)" }}>
                  Step 03 — Review
                </span>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="rounded-sm border border-border p-4">
                  <p className="font-semibold">Team Size:</p>
                  <p className="mb-3">{formData.teamSize}</p>
                  <p className="font-semibold">Use Case:</p>
                  <p>{formData.useCase}</p>
                </div>

                <div className="rounded-sm border border-border divide-y divide-border">
                  {enabledTools.map((tool) => {
                    const data = formData.tools[tool.id];
                    return (
                      <div key={tool.id} className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-semibold">{tool.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {data.planLabel} • {data.seats} seats
                          </p>
                        </div>
                        <p className="font-bold">${data.monthlySpend}/mo</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between border rounded-sm p-4">
                  <p className="font-bold">Total Monthly Spend</p>
                  <p className="font-black text-lg">
                    ${enabledTools.reduce((sum, tool) => sum + (formData.tools[tool.id]?.monthlySpend ?? 0), 0)}/mo
                  </p>
                </div>

                {auditError && (
                  <p className="text-sm text-red-600 font-medium" role="alert">{auditError}</p>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} disabled={isRunning}>
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button onClick={handleRunAudit} className="flex-1" disabled={isRunning}>
                    {isRunning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Running audit...
                      </>
                    ) : (
                      <>
                        Run My Audit
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
