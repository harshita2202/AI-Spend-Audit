interface CredexCTAProps {
  savings: number;
}

export function CredexCTA({ savings }: CredexCTAProps) {
  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{ background: "#0f0d1a", border: "1px solid #2d2447" }}
    >
      <div
        className="px-6 py-2 flex items-center gap-2 border-b"
        style={{ background: "#1a1630", borderColor: "#2d2447" }}
      >
        <div className="w-2 h-2 rounded-full bg-violet-400" />
        <span className="text-xs font-bold text-violet-300 uppercase tracking-widest font-mono-app">
          Credex Partner Offer
        </span>
      </div>

      <div className="px-6 py-7 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10">
          <p className="text-violet-300 text-xs font-semibold uppercase tracking-widest mb-2 font-mono-app">
            You're leaving money on the table
          </p>
          <h3 className="text-white font-black text-2xl sm:text-3xl mb-3 leading-tight font-display">
            ${savings.toLocaleString()}/month in{" "}
            <span className="text-violet-400">potential savings</span>
          </h3>
          <p className="text-white/60 text-sm mb-6 max-w-lg leading-relaxed">
            Credex sources discounted AI credits directly from providers. Get the same tools
            for significantly less — trusted by 200+ startups to cut AI spend by up to 40%.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-5 py-2.5 rounded-sm transition-colors font-display">
              Book a free consultation →
            </button>
            <button className="px-5 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-sm transition-all font-display">
              How Credex works
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
