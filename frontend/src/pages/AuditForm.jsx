import React, { useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "../components/Navbar.jsx";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { ToolCard } from "../components/ToolCard.jsx";
import { useFormPersistence } from "../hooks/useFormPersistence.js";
import { TOOLS } from "../lib/mockData.js";

const STEP_LABELS = ["Team basics", "AI tools", "Review"];
const TEAM_SIZES = ["1", "2-5", "6-15", "16-50", "50+"];
const USE_CASES = ["Coding", "Writing", "Data analysis", "Research", "Mixed"];

function makeDefaultTools() {
  return Object.fromEntries(
    TOOLS.map((t) => [t.id, { enabled: false, planLabel: t.plans[0]?.label ?? "", monthlySpend: 0, seats: 1 }])
  );
}

const DEFAULT_FORM = { teamSize: "6-15", useCase: "Mixed", tools: makeDefaultTools() };

export default function AuditForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useFormPersistence("spendsense-audit-form", DEFAULT_FORM);
  const [, setLocation] = useLocation();

  const updateTool = (toolId, data) =>
    setFormData({ ...formData, tools: { ...formData.tools, [toolId]: data } });

  const enabledTools = TOOLS.filter((t) => formData.tools[t.id]?.enabled);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16 px-5">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="pt-4 mb-7">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-1 font-mono-app">Free audit tool</p>
            <h1 className="text-3xl font-black text-foreground font-display">Audit your AI stack</h1>
          </div>

          {/* Progress */}
          <div className="mb-7">
            <ProgressBar currentStep={step} totalSteps={3} labels={STEP_LABELS} />
          </div>

          {/* ── Step 1: Team basics ── */}
          {step === 1 && (
            <div className="bg-card rounded-sm border border-border overflow-hidden">
              <div className="px-6 py-3 border-b border-border bg-muted">
                <span className="text-xs font-bold uppercase tracking-widest text-foreground font-mono-app">Step 01 — Team basics</span>
              </div>
              <div className="px-6 py-5 space-y-6">

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-fg mb-2 block font-mono-app" htmlFor="team-size">
                    Team size
                  </label>
                  <select
                    id="team-size"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-full h-10 text-sm rounded-sm border border-border bg-white px-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {TEAM_SIZES.map((s) => (
                      <option key={s} value={s}>{s === "1" ? "1 person (solo)" : `${s} people`}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-fg mb-3 font-mono-app">Primary use case</p>
                  <div className="flex flex-wrap gap-2">
                    {USE_CASES.map((uc) => (
                      <button
                        key={uc}
                        onClick={() => setFormData({ ...formData, useCase: uc })}
                        className={`px-3 py-1.5 text-sm font-semibold rounded-sm border transition-all font-display ${
                          formData.useCase === uc
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-foreground border-border hover:border-primary/40 hover:bg-primary-light"
                        }`}
                      >
                        {uc}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-primary text-white font-bold py-2.5 rounded-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 font-display"
                >
                  Next: Select your tools →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Tools ── */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-0.5 font-mono-app">Step 02</p>
                  <h2 className="text-lg font-black text-foreground font-display">Toggle your AI tools</h2>
                </div>
                <span className="text-xs text-muted-fg">{enabledTools.length} selected</span>
              </div>

              <div className="space-y-2 mb-5">
                {TOOLS.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    value={formData.tools[tool.id] ?? { enabled: false, planLabel: tool.plans[0]?.label ?? "", monthlySpend: 0, seats: 1 }}
                    onChange={(data) => updateTool(tool.id, data)}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 border border-border rounded-sm text-sm font-semibold text-muted-fg hover:text-foreground transition-colors flex items-center gap-2 font-display"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={enabledTools.length === 0}
                  className="flex-1 bg-primary text-white font-bold py-2.5 rounded-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed font-display"
                >
                  Review & run audit →
                </button>
              </div>
              {enabledTools.length === 0 && (
                <p className="text-xs text-muted-fg text-center mt-2">Toggle at least one tool to continue</p>
              )}
            </div>
          )}

          {/* ── Step 3: Review ── */}
          {step === 3 && (
            <div className="bg-card rounded-sm border border-border overflow-hidden">
              <div className="px-6 py-3 border-b border-border bg-muted">
                <span className="text-xs font-bold uppercase tracking-widest text-foreground font-mono-app">Step 03 — Review</span>
              </div>
              <div className="px-6 py-5 space-y-4">

                {/* Team basics summary */}
                <div className="rounded-sm border border-border overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-muted border-b border-border">
                    <span className="text-xs font-bold text-muted-fg uppercase tracking-widest font-mono-app">Team basics</span>
                    <button onClick={() => setStep(1)} className="text-xs text-primary hover:underline font-medium">✏️ Edit</button>
                  </div>
                  <div className="px-4 py-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-fg mb-0.5 font-mono-app uppercase tracking-wider">Team size</p>
                      <p className="font-semibold text-foreground font-display">{formData.teamSize} people</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-fg mb-0.5 font-mono-app uppercase tracking-wider">Use case</p>
                      <p className="font-semibold text-foreground font-display">{formData.useCase}</p>
                    </div>
                  </div>
                </div>

                {/* Tools summary */}
                <div className="rounded-sm border border-border overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-muted border-b border-border">
                    <span className="text-xs font-bold text-muted-fg uppercase tracking-widest font-mono-app">AI tools · {enabledTools.length} selected</span>
                    <button onClick={() => setStep(2)} className="text-xs text-primary hover:underline font-medium">✏️ Edit</button>
                  </div>
                  <div className="divide-y divide-border/60">
                    {enabledTools.length === 0 ? (
                      <p className="px-4 py-3 text-xs text-muted-fg">No tools enabled.</p>
                    ) : enabledTools.map((tool) => {
                      const data = formData.tools[tool.id];
                      return (
                        <div key={tool.id} className="flex items-center justify-between px-4 py-3" style={{ borderLeft: `3px solid ${tool.color}` }}>
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-sm text-white text-xs font-bold flex items-center justify-center flex-shrink-0 font-display" style={{ backgroundColor: tool.color }}>
                              {tool.initials}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground font-display">{tool.name}</p>
                              <p className="text-xs text-muted-fg font-mono-app">{data?.planLabel} · {data?.seats} seat{data?.seats !== 1 ? "s" : ""}</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-foreground font-display">${data?.monthlySpend}/mo</span>
                        </div>
                      );
                    })}
                  </div>
                  {enabledTools.length > 0 && (
                    <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-muted/50">
                      <span className="text-sm font-bold text-foreground font-display">Total</span>
                      <span className="text-sm font-black text-foreground font-display">
                        ${enabledTools.reduce((s, t) => s + (formData.tools[t.id]?.monthlySpend ?? 0), 0).toLocaleString()}/mo
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 border border-border rounded-sm text-sm font-semibold text-muted-fg hover:text-foreground transition-colors flex items-center gap-2 font-display"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setLocation("/results")}
                    className="flex-1 bg-primary text-white font-black text-base py-3 rounded-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 font-display"
                  >
                    Run My Audit →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
