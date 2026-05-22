import { Link, useLocation } from "wouter";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-sm bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-black font-display">S</span>
          </div>
          <span className="text-sm font-bold text-foreground tracking-tight font-display">
            SpendSense <span className="text-primary">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {location !== "/" && (
            <Link href="/" className="text-sm text-muted-fg hover:text-foreground transition-colors">
              Home
            </Link>
          )}
          <Link
            href="/audit"
            className="text-sm font-semibold px-4 py-1.5 rounded-sm border border-foreground/20 hover:border-primary hover:text-primary hover:bg-primary-light transition-all font-display"
          >
            Run Free Audit →
          </Link>
        </div>
      </div>
    </nav>
  );
}
