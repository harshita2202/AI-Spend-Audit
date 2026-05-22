import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { SavingsHero } from "@/components/SavingsHero";
import { AuditResultCard } from "@/components/AuditResultCard";
import { EmailCaptureModal } from "@/components/EmailCaptureModal";
import { CredexCTA } from "@/components/CredexCTA";
import { ShareButtons } from "@/components/ShareButtons";
import { MOCK_AUDIT_RESULT } from "@/lib/mockData";
import { getPublicAudit, generateSummary } from "@/lib/api";
import type { AuditResult, AuditFormData } from "@/lib/types";
import { Mail, ArrowRight } from "lucide-react";

interface AuditResultsProps {
  params?: { id?: string };
}

export default function AuditResults({ params }: AuditResultsProps) {
  const auditId = params?.id;

  const [result, setResult] = useState<AuditResult | null>(null);
  const [auditInput, setAuditInput] = useState<AuditFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    async function loadAudit() {
      setLoading(true);

      // 1. Try session cache first (set by AuditForm immediately after submission)
      if (auditId) {
        const cached = sessionStorage.getItem(`audit-result-${auditId}`);
        if (cached) {
          try {
            const { input, result: cachedResult } = JSON.parse(cached) as {
              input: AuditFormData;
              result: AuditResult;
            };
            setResult(cachedResult);
            setAuditInput(input);
            setLoading(false);
            fetchSummary(input, cachedResult);
            return;
          } catch {
            // Ignore parse errors — fall through
          }
        }
      }

      // 2. Try Supabase fetch
      if (auditId && !auditId.startsWith("local-")) {
        const publicAudit = await getPublicAudit(auditId);
        if (publicAudit) {
          setResult(publicAudit.auditResult);
          setAuditInput(publicAudit.auditInput ?? null);
          setLoading(false);
          if (publicAudit.auditInput && !publicAudit.auditResult.aiSummary) {
            fetchSummary(publicAudit.auditInput, publicAudit.auditResult);
          }
          return;
        }
      }

      // 3. Fallback to mock data (dev / local- IDs)
      setResult(MOCK_AUDIT_RESULT);
      setLoading(false);
    }

    loadAudit();

    const timer = setTimeout(() => setShowModal(true), 30000);
    return () => clearTimeout(timer);
  }, [auditId]);

  async function fetchSummary(input: AuditFormData, auditResult: AuditResult) {
    if (auditResult.aiSummary) return;
    setSummaryLoading(true);
    try {
      const summary = await generateSummary(input, auditResult);
      setResult((prev) => (prev ? { ...prev, aiSummary: summary } : prev));
    } finally {
      setSummaryLoading(false);
    }
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  if (loading || !result) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16 px-5">
          <div className="max-w-2xl mx-auto pt-16 space-y-4">
            <div className="h-8 w-48 bg-muted animate-pulse rounded-sm" />
            <div className="h-32 bg-muted animate-pulse rounded-sm" />
            <div className="h-24 bg-muted animate-pulse rounded-sm" />
            <div className="h-24 bg-muted animate-pulse rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16 px-5">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* Page header */}
          <div className="pt-4">
            <p
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1"
              style={{ fontFamily: "var(--app-font-mono)" }}
            >
              Audit complete
            </p>
            <h1
              className="text-3xl font-black text-foreground"
              style={{ fontFamily: "var(--app-font-display)" }}
            >
              Your AI spend breakdown
            </h1>
          </div>

          {/* Savings hero */}
          <SavingsHero
            monthlySavings={result.totalSavings}
            annualSavings={result.annualSavings}
          />

          {/* Per-tool breakdown */}
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3"
              style={{ fontFamily: "var(--app-font-mono)" }}
            >
              Per-tool breakdown
            </p>
            <div className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <AuditResultCard key={rec.toolId} recommendation={rec} index={index} />
              ))}
            </div>
          </div>

          {/* AI summary */}
          <div
            className="rounded-sm border border-border bg-card overflow-hidden"
            data-testid="ai-summary-section"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
              <span
                className="text-xs font-bold uppercase tracking-widest text-foreground"
                style={{ fontFamily: "var(--app-font-mono)" }}
              >
                AI Analysis
              </span>
              <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                Claude
              </span>
            </div>
            <div className="px-5 py-4">
              {summaryLoading ? (
                <div className="space-y-2">
                  <div className="h-3.5 bg-muted animate-pulse rounded w-full" />
                  <div className="h-3.5 bg-muted animate-pulse rounded w-5/6" />
                  <div className="h-3.5 bg-muted animate-pulse rounded w-4/6" />
                </div>
              ) : (
                <p
                  className="text-sm text-muted-foreground leading-relaxed"
                  data-testid="text-ai-summary"
                >
                  {result.aiSummary}
                </p>
              )}
            </div>
          </div>

          {/* Credex CTA */}
          {(result.showCredexCTA || result.totalSavings > 100) && (
            <CredexCTA savings={result.totalSavings} />
          )}

          {/* Optimal section */}
          {result.totalSavings < 100 && (
            <div
              className="rounded-sm border border-green-200 bg-green-50 overflow-hidden"
              data-testid="optimal-section"
            >
              <div className="border-b border-green-200 px-5 py-2.5 bg-green-100/60">
                <span
                  className="text-xs font-bold uppercase tracking-widest text-green-800"
                  style={{ fontFamily: "var(--app-font-mono)" }}
                >
                  Well optimized
                </span>
              </div>
              <div className="px-5 py-4">
                <p className="text-green-800 text-sm font-medium mb-3">
                  Your stack is lean. Get notified when new optimizations apply.
                </p>
                {!subscribed ? (
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 rounded-sm border border-green-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      data-testid="input-subscribe-email"
                    />
                    <Button
                      type="submit"
                      className="bg-green-700 hover:bg-green-800 text-white rounded-sm text-sm"
                      data-testid="button-subscribe"
                    >
                      Notify me
                    </Button>
                  </form>
                ) : (
                  <p className="text-green-700 text-sm font-medium">You're subscribed.</p>
                )}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="rounded-sm border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-2.5 bg-muted/30">
              <span
                className="text-xs font-bold uppercase tracking-widest text-foreground"
                style={{ fontFamily: "var(--app-font-mono)" }}
              >
                Share your audit
              </span>
            </div>
            <div className="px-5 py-4">
              <ShareButtons savings={result.totalSavings} auditId={auditId} />
            </div>
          </div>

          {/* Modal trigger + run again */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline underline-offset-2 font-medium"
              data-testid="button-open-email-modal"
            >
              <Mail className="w-4 h-4" />
              Email me this audit
            </button>
            <Button
              variant="outline"
              className="gap-2 rounded-sm text-sm border-foreground/20 hover:border-primary hover:text-primary transition-all"
              data-testid="button-run-again"
              asChild
            >
              <Link href="/audit">
                Run another audit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <EmailCaptureModal
        open={showModal}
        onClose={() => setShowModal(false)}
        auditId={auditId ?? ""}
        totalSavings={result.totalSavings}
        annualSavings={result.annualSavings}
        totalSpend={result.totalCurrentSpend}
        recommendations={result.recommendations}
      />
    </div>
  );
}
