import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { AuditResultCard } from "@/components/AuditResultCard";
import { MOCK_AUDIT_RESULT } from "@/lib/mockData";
import { getPublicAudit } from "@/lib/api";
import type { AuditResult } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface SharedAuditProps {
  params: { id?: string };
}

export default function SharedAudit({ params }: SharedAuditProps) {
  const id = params.id;
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) {
        setResult(MOCK_AUDIT_RESULT);
        setLoading(false);
        return;
      }

      const audit = await getPublicAudit(id);
      if (!audit) {
        setNotFound(true);
      } else {
        setResult(audit.auditResult);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto pt-8 space-y-4">
            <div className="h-8 w-64 bg-muted animate-pulse rounded-sm mx-auto" />
            <div className="h-32 bg-muted animate-pulse rounded-sm" />
            <div className="h-24 bg-muted animate-pulse rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-md mx-auto text-center pt-8">
            <div className="text-5xl mb-4">🔍</div>
            <h1 className="text-2xl font-black text-foreground mb-2" style={{ fontFamily: "var(--app-font-display)" }}>
              Audit not found
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              This audit link may have expired or the ID is incorrect.
            </p>
            <Button asChild className="rounded-sm gap-2">
              <Link href="/audit">
                Run your own free audit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const r = result!;
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://spendsense.ai";

  return (
    <>
      <Helmet>
        <title>AI Spend Audit — ${r.totalSavings.toLocaleString()}/month savings found · SpendSense AI</title>
        <meta property="og:title" content={`AI Spend Audit — $${r.totalSavings.toLocaleString()}/month savings found`} />
        <meta property="og:description" content={`See how this team could save $${r.totalSavings.toLocaleString()}/month ($${r.annualSavings.toLocaleString()}/year) on AI tools. Run your own free audit in 2 minutes.`} />
        <meta property="og:url" content={`${siteUrl}/audit/${id}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`AI Spend Audit — $${r.totalSavings.toLocaleString()}/month savings found`} />
        <meta name="twitter:description" content={`This team could save $${r.totalSavings.toLocaleString()}/month on AI tools. Run your own free audit.`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground text-xs font-semibold px-3 py-1.5 rounded-sm mb-4" style={{ fontFamily: "var(--app-font-mono)" }}>
                Shared audit &middot; Read only
              </div>
              <h1 className="text-3xl font-black text-foreground mb-2" style={{ fontFamily: "var(--app-font-display)" }}>
                AI Spend Audit
              </h1>
              <p className="text-muted-foreground text-sm font-mono">
                Audit ID: <span className="text-foreground">{id ?? "demo"}</span>
              </p>
            </div>

            {/* Savings summary */}
            <div className="rounded-sm bg-green-50 border border-green-200 p-6 sm:p-8 text-center">
              <p className="text-sm font-semibold text-green-700 uppercase tracking-widest mb-2" style={{ fontFamily: "var(--app-font-mono)" }}>
                Potential monthly savings
              </p>
              <div className="text-5xl font-black text-green-600 mb-1" style={{ fontFamily: "var(--app-font-display)" }}>
                ${r.totalSavings.toLocaleString()}
                <span className="text-2xl font-bold text-green-500">/mo</span>
              </div>
              <p className="text-green-700 text-base">
                That's{" "}
                <strong style={{ fontFamily: "var(--app-font-display)" }}>${r.annualSavings.toLocaleString()}/year</strong>
              </p>
            </div>

            {/* Tool breakdown — no personal info shown */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3" style={{ fontFamily: "var(--app-font-mono)" }}>
                Savings breakdown
              </p>
              <div className="space-y-3">
                {r.recommendations.map((rec, index) => (
                  <AuditResultCard key={rec.toolId} recommendation={rec} index={index} />
                ))}
              </div>
            </div>

            {/* CTA to run own audit */}
            <div
              className="rounded-sm border border-border bg-card p-8 text-center"
              data-testid="shared-audit-cta"
            >
              <h2 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--app-font-display)" }}>
                See what you could save
              </h2>
              <p className="text-muted-foreground text-sm mb-5">
                Run a free 2-minute audit on your own AI tool stack — no signup needed.
              </p>
              <Button
                size="lg"
                className="rounded-sm px-8 font-semibold gap-2 group"
                data-testid="button-run-own-audit"
                asChild
              >
                <Link href="/audit">
                  Run your own free audit
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                No account required &middot; Takes 2 minutes &middot; 100% free
              </p>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              This shared view shows savings numbers only. No personal information is shared.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
