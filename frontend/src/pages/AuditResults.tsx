import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { SavingsHero } from "@/components/SavingsHero";
import { AuditResultCard } from "@/components/AuditResultCard";
import { EmailCaptureModal } from "@/components/EmailCaptureModal";
import { CredexCTA } from "@/components/CredexCTA";
import { ShareButtons } from "@/components/ShareButtons";
import { BenchmarkCard } from "@/components/BenchmarkCard";
import { MOCK_AUDIT_RESULT } from "@/lib/mockData";
import { getPublicAudit, generateSummary } from "@/lib/api";
import { exportAuditPDF } from "@/lib/exportPDF";
import type { AuditResult, AuditFormData } from "@/lib/types";
import { Mail, ArrowRight, Download } from "lucide-react";

interface AuditResultsProps {
  params?: { id?: string };
}

export default function AuditResults({ params }: AuditResultsProps) {
  const auditId = params?.id;

  const [result, setResult] = useState<AuditResult | null>(null);
  const [auditInput, setAuditInput] = useState<AuditFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function loadAudit() {
      setLoading(true);
      setNotFound(false);

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
            // fall through
          }
        }
      }

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
        // auditId provided but not found — show not-found state
        if (auditId && !auditId.startsWith("local-")) {
          setNotFound(true);
          setLoading(false);
          return;
        }
      }

      // No ID or local ID — show mock/demo data
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

  const handleExportPDF = async () => {
    if (!result) return;
    setExporting(true);
    try {
      await exportAuditPDF(result.totalSavings);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16 px-5 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">Loading your audit...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16 px-5 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-sm">
            <h2 className="text-2xl font-bold text-foreground mb-2">Audit not found</h2>
            <p className="text-muted-foreground mb-6">
              This audit link may have expired or been deleted.
            </p>
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-sm hover:bg-primary-dark transition-colors"
            >
              Run a new audit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16 px-5">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="pt-4">
            <p
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1"
              style={{ fontFamily: "var(--app-font-mono)" }}
            >
              Audit complete
            </p>
            <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "var(--app-font-display)" }}>
              Your AI spend breakdown
            </h1>
          </div>

          {/* Main auditable content for PDF export */}
          <div id="audit-results-content" className="space-y-5">
            <SavingsHero monthlySavings={result.totalSavings} annualSavings={result.annualSavings} />

            {result && auditInput && (
              <BenchmarkCard
                totalSpend={result.totalCurrentSpend}
                teamSize={auditInput.teamSize}
                useCase={auditInput.useCase}
              />
            )}

            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3"
                style={{ fontFamily: "var(--app-font-mono)" }}
              >
                Per-tool breakdown
              </p>
              <div className="space-y-3">
                {result.recommendations.map((rec) => (
                  <AuditResultCard key={rec.toolId} recommendation={rec} />
                ))}
              </div>
            </div>

            <div className="rounded-sm border border-border bg-card overflow-hidden" data-testid="ai-summary-section">
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
                  <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-ai-summary">
                    {result.aiSummary}
                  </p>
                )}
              </div>
            </div>
          </div>

          {(result.showCredexCTA || result.totalSavings > 100) && (
            <CredexCTA savings={result.totalSavings} />
          )}

          {result.totalSavings < 100 && (
            <div className="rounded-sm border border-green-200 bg-green-50 overflow-hidden" data-testid="optimal-section">
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
                    <label htmlFor="subscribe-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="subscribe-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      aria-label="Email address for optimization notifications"
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

          <div className="rounded-sm border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-2.5 bg-muted/30">
              <span
                className="text-xs font-bold uppercase tracking-widest text-foreground"
                style={{ fontFamily: "var(--app-font-mono)" }}
              >
                Share your audit
              </span>
            </div>
            <div className="px-5 py-4 space-y-3">
              <ShareButtons savings={result.totalSavings} auditId={auditId} />
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                aria-label="Download audit as PDF report"
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-sm text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                {exporting ? "Generating PDF..." : "Download PDF Report"}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <button
              onClick={() => setShowModal(true)}
              aria-label="Email this audit to yourself"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline underline-offset-2 font-medium"
              data-testid="button-open-email-modal"
            >
              <Mail className="w-4 h-4" />
              Email me this audit
            </button>
            <Button
              variant="outline"
              className="gap-2 rounded-sm text-sm border-foreground/20 hover:border-primary hover:text-primary transition-all w-full sm:w-auto"
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
