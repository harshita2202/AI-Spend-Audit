import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { Navbar } from "../components/Navbar.jsx";
import { SavingsHero } from "../components/SavingsHero.jsx";
import { AuditResultCard } from "../components/AuditResultCard.jsx";
import { EmailCaptureModal } from "../components/EmailCaptureModal.jsx";
import { CredexCTA } from "../components/CredexCTA.jsx";
import { ShareButtons } from "../components/ShareButtons.jsx";
import { MOCK_AUDIT_RESULT } from "../lib/mockData.js";

export default function AuditResults() {
  const result = MOCK_AUDIT_RESULT;
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16 px-5">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* Header */}
          <div className="pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-1 font-mono-app">Audit complete</p>
            <h1 className="text-3xl font-black text-foreground font-display">Your AI spend breakdown</h1>
          </div>

          {/* Savings hero */}
          <SavingsHero monthlySavings={result.totalSavings} annualSavings={result.annualSavings} />

          {/* Per-tool breakdown */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-3 font-mono-app">Per-tool breakdown</p>
            <div className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <AuditResultCard key={rec.toolId} recommendation={rec} index={i} />
              ))}
            </div>
          </div>

          {/* AI summary */}
          <div className="rounded-sm border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted">
              <span className="text-xs font-bold uppercase tracking-widest text-foreground font-mono-app">AI Analysis</span>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide font-mono-app">Claude</span>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-muted-fg leading-relaxed">{result.aiSummary}</p>
            </div>
          </div>

          {/* Credex CTA */}
          {result.totalSavings > 100 && <CredexCTA savings={result.totalSavings} />}

          {/* Optimal note */}
          {result.totalSavings < 100 && (
            <div className="rounded-sm border border-green-200 bg-green-50 overflow-hidden">
              <div className="border-b border-green-200 px-5 py-2.5 bg-green-100/60">
                <span className="text-xs font-bold uppercase tracking-widest text-green-800 font-mono-app">Well optimized</span>
              </div>
              <div className="px-5 py-4">
                <p className="text-green-800 text-sm font-medium mb-3">Your stack is lean. Get notified when new optimizations apply.</p>
                {!subscribed ? (
                  <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }} className="flex gap-2">
                    <input
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 rounded-sm border border-green-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-sm text-sm font-semibold font-display transition-colors">
                      Notify me
                    </button>
                  </form>
                ) : (
                  <p className="text-green-700 text-sm font-medium">You're subscribed.</p>
                )}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="rounded-sm border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-2.5 bg-muted">
              <span className="text-xs font-bold uppercase tracking-widest text-foreground font-mono-app">Share your audit</span>
            </div>
            <div className="px-5 py-4">
              <ShareButtons savings={result.totalSavings} />
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <button
              onClick={() => setShowModal(true)}
              className="text-sm text-primary hover:underline underline-offset-2 font-medium flex items-center gap-1.5"
            >
              ✉️ Get notified of new savings
            </button>
            <Link
              href="/audit"
              className="text-sm font-semibold px-4 py-2 border border-border rounded-sm hover:border-primary hover:text-primary transition-all flex items-center gap-2 font-display"
            >
              Run another audit →
            </Link>
          </div>
        </div>
      </div>

      <EmailCaptureModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
