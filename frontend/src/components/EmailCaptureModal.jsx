import React, { useState, useEffect } from "react";

export function EmailCaptureModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-card rounded-sm border border-border shadow-xl w-full max-w-md p-6">
        {!submitted ? (
          <>
            <h2 className="text-xl font-black text-foreground mb-1 font-display">Get notified of new optimizations</h2>
            <p className="text-sm text-muted-fg mb-5">
              We'll alert you when new savings apply to your stack — no spam.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-fg mb-1.5 block font-mono-app">
                  Work email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-3 py-2 text-sm border border-border rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-fg mb-1.5 block font-mono-app">
                  Company <span className="normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Inc."
                  className="w-full px-3 py-2 text-sm border border-border rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white font-semibold py-2 rounded-sm hover:bg-primary-dark transition-colors font-display"
                >
                  Get updates
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-border rounded-sm text-sm text-muted-fg hover:text-foreground transition-colors"
                >
                  Skip
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 font-display">You're in</h3>
            <p className="text-muted-fg text-sm mb-5">We'll let you know when new savings apply.</p>
            <button
              onClick={onClose}
              className="bg-primary text-white font-semibold px-6 py-2 rounded-sm hover:bg-primary-dark transition-colors font-display"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
