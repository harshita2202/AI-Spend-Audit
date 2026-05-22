import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";

const STEPS = [
  { step: "01", title: "Input your tools", description: "Toggle which AI tools your team uses, pick your plan tier, and enter seat count." },
  { step: "02", title: "We run the audit", description: "Our engine compares your stack against current pricing benchmarks and usage signals." },
  { step: "03", title: "Act on savings", description: "Get a precise plan: seats to cut, plans to downgrade, tools to consolidate." },
];

const STATS = [
  { value: "$2,400", label: "avg. monthly savings" },
  { value: "8 tools", label: "audited per team" },
  { value: "2 min", label: "to complete" },
];

interface PreviewRow {
  name: string;
  spend: string;
  saving: string;
  status: "over" | "opt" | "ok";
}

const PREVIEW_ROWS: PreviewRow[] = [
  { name: "Cursor Pro", spend: "$320/mo", saving: "−$60/mo", status: "over" },
  { name: "GitHub Copilot", spend: "$152/mo", saving: "−$36/mo", status: "opt" },
  { name: "ChatGPT Team", spend: "$200/mo", saving: "−$75/mo", status: "over" },
  { name: "Claude Pro", spend: "$60/mo", saving: "✓ Optimal", status: "ok" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ── */}
      <section className="hero-gradient pt-20 pb-16 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-light text-primary rounded-sm px-3 py-1 text-xs font-bold mb-5 border border-primary/20 uppercase tracking-widest font-mono-app">
                🎁 Free for founders
              </div>
              <h1 className="text-5xl sm:text-6xl font-black text-foreground leading-tight tracking-tight mb-5 font-display">
                Are you <span className="text-primary">overpaying</span> for AI tools?
              </h1>
              <p className="text-lg text-muted-fg leading-relaxed mb-7 max-w-md">
                A free 2-minute audit that tells you exactly where your team is over-provisioned —
                and what to do about it.
              </p>
              <Link
                href="/audit"
                className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-sm hover:bg-primary-dark transition-colors group font-display"
              >
                Start Free Audit
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-fg mt-5">
                <span>🛡️ No account needed</span>
                <span className="hidden sm:block text-border">·</span>
                <span>⏱ 2 minutes</span>
                <span className="hidden sm:block text-border">·</span>
                <span>🎁 100% free</span>
              </div>
            </div>

            {/* Preview card */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-sm"
                style={{ background: "rgba(124,58,237,0.12)", transform: "translate(8px, 8px)" }}
              />
              <div className="relative bg-card rounded-sm border border-border overflow-hidden shadow-lg">
                <div className="bg-muted px-4 py-2.5 border-b border-border flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <span className="text-xs text-muted-fg mx-auto font-mono-app">
                    spendsense.ai — audit results
                  </span>
                </div>
                <div className="bg-green-50 border-b border-green-100 px-4 py-3 flex items-center justify-between">
                  <span className="text-green-700 text-xs font-bold uppercase tracking-widest font-mono-app">
                    Monthly savings found
                  </span>
                  <span className="text-2xl font-black text-green-600 font-display">$171</span>
                </div>
                <div className="divide-y divide-border/60">
                  {PREVIEW_ROWS.map((row) => (
                    <div
                      key={row.name}
                      className="flex items-center justify-between px-4 py-3"
                      style={{
                        borderLeft: `3px solid ${
                          row.status === "over"
                            ? "#ef4444"
                            : row.status === "opt"
                            ? "#f59e0b"
                            : "#22c55e"
                        }`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-foreground font-display">
                          {row.name}
                        </span>
                        <span className="text-xs text-muted-fg">{row.spend}</span>
                      </div>
                      <span
                        className={`text-sm font-bold font-display ${
                          row.status === "over"
                            ? "text-red-600"
                            : row.status === "opt"
                            ? "text-amber-600"
                            : "text-green-600"
                        }`}
                      >
                        {row.saving}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-border bg-background py-8 px-5">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 sm:gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-primary font-display">
                {s.value}
              </div>
              <div className="text-xs text-muted-fg mt-1">{s.label}</div>
              <div className="text-xs text-muted-fg/50 mt-0.5">illustrative</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-5 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2 font-mono-app">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground font-display">
              Three steps. Under two minutes.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map((s) => (
              <div key={s.step} className="bg-card border border-border rounded-sm p-6 hard-shadow">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-9 h-9 rounded-sm bg-primary-light flex items-center justify-center text-primary text-lg">
                    {s.step === "01" ? "⚡" : s.step === "02" ? "📊" : "✅"}
                  </div>
                  <span
                    className="text-4xl font-black select-none font-display"
                    style={{ color: "#e0ddf5" }}
                  >
                    {s.step}
                  </span>
                </div>
                <h3 className="font-bold text-foreground mb-2 font-display">{s.title}</h3>
                <p className="text-sm text-muted-fg leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        className="py-20 px-5 border-t border-border"
        style={{ background: "linear-gradient(160deg, #f0eaff 0%, #f8f7ff 100%)" }}
      >
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4 font-display">
            Ready to see your number?
          </h2>
          <p className="text-muted-fg mb-7">
            No account. No credit card. Just your AI tools and 2 minutes.
          </p>
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-7 py-3 rounded-sm hover:bg-primary-dark transition-colors group font-display"
          >
            Start your free audit
            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-6 px-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-sm bg-primary flex items-center justify-center">
              <span className="text-white text-xs font-black font-display">S</span>
            </div>
            <span className="text-sm font-bold text-foreground font-display">SpendSense AI</span>
          </Link>
          <p className="text-xs text-muted-fg">
            Powered by <span className="font-bold text-foreground">Credex</span>
          </p>
          <p className="text-xs text-muted-fg">&copy; {new Date().getFullYear()} SpendSense AI</p>
        </div>
      </footer>
    </div>
  );
}
