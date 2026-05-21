import React from "react";
import { Link } from "wouter";
import { Navbar } from "../components/Navbar.jsx";
import { AuditResultCard } from "../components/AuditResultCard.jsx";
import { MOCK_AUDIT_RESULT } from "../lib/mockData.js";

export default function SharedAudit({ params }) {
  const result = MOCK_AUDIT_RESULT;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16 px-5">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Header */}
          <div className="pt-4 text-center">
            <div className="inline-flex items-center gap-1.5 bg-muted text-muted-fg text-xs font-bold px-3 py-1.5 rounded-sm mb-4 font-mono-app">
              Shared audit · Read only
            </div>
            <h1 className="text-3xl font-black text-foreground mb-2 font-display">AI Spend Audit</h1>
            <p className="text-muted-fg text-sm font-mono-app">
              Audit ID: <span className="text-foreground">{params?.id ?? "demo"}</span>
            </p>
          </div>

          {/* Savings summary */}
          <div className="rounded-sm bg-green-50 border border-green-200 p-6 sm:p-8 text-center">
            <p className="text-sm font-bold text-green-700 uppercase tracking-widest mb-2 font-mono-app">Potential monthly savings</p>
            <div className="text-5xl font-black text-green-600 mb-1 font-display">
              ${result.totalSavings.toLocaleString()}
              <span className="text-2xl font-bold text-green-500">/mo</span>
            </div>
            <p className="text-green-700">
              That's <strong className="font-display">${result.annualSavings.toLocaleString()}/year</strong>
            </p>
          </div>

          {/* Tool breakdown */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-3 font-mono-app">Savings breakdown</p>
            <div className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <AuditResultCard key={rec.toolId} recommendation={rec} index={i} />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-sm border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-bold text-foreground mb-2 font-display">See what you could save</h2>
            <p className="text-muted-fg text-sm mb-5">Run a free 2-minute audit on your own AI tool stack — no signup needed.</p>
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-7 py-3 rounded-sm hover:bg-primary-dark transition-colors group font-display"
            >
              Run your own free audit
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
            <p className="text-xs text-muted-fg mt-3">No account required · Takes 2 minutes · 100% free</p>
          </div>

          <p className="text-center text-xs text-muted-fg">
            This shared view shows savings numbers only. No personal information is shared.
          </p>
        </div>
      </div>
    </div>
  );
}
