/**
 * ECO//SIM — Error boundary (Editorial Field Study v12)
 * User-friendly error page: no stack traces, no jargon. Plain explanation,
 * brand-consistent editorial style, and two clear ways out (reload, go home).
 * In development only, a small collapsible technical note is offered for
 * debugging; production visitors never see raw errors.
 */
import { Component, useState } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ErrorBoundaryInner>{children}</ErrorBoundaryInner>;
}

class ErrorBoundaryInner extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // Log silently to console for developers; never expose to visitors.
    console.error("[ECO//SIM] runtime error:", error);
  }

  render() {
    if (this.state.hasError) {
      return <FriendlyErrorPage error={this.state.error} />;
    }
    return this.props.children;
  }
}

function FriendlyErrorPage({ error }: { error: Error | null }) {
  const [showNote, setShowNote] = useState(false);
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center">
          <div className="font-data text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-5">
            Field report · something broke
          </div>
          <div className="flex justify-center mb-6">
            <AlertTriangle className="w-12 h-12 text-vermilion" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
            The town went <span className="italic text-vermilion">quiet.</span>
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
            Something on this page stopped working. Nothing you typed is lost,
            but the page cannot show what you came for. The quickest fix is a
            fresh start.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="btn-press inline-flex items-center justify-center gap-2 bg-vermilion text-primary-foreground font-data text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:brightness-105 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reload the page
            </button>
            <a
              href="/"
              className="btn-press inline-flex items-center justify-center gap-2 border border-current/40 font-data text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-primary-foreground/10 transition-colors"
            >
              <Home className="w-3.5 h-3.5" /> Back to the study
            </a>
          </div>

          {isDev && (
            <button
              onClick={() => setShowNote((s) => !s)}
              className="mt-8 mx-auto block font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              {showNote ? "Hide" : "Show"} technical note (dev only)
            </button>
          )}
          {showNote && isDev && (
            <pre className="mt-3 text-left text-[11px] text-muted-foreground bg-secondary text-secondary-foreground p-4 rounded overflow-auto max-h-56">
              {error?.stack ?? error?.message}
            </pre>
          )}
        </div>
      </main>
      <footer className={cn("border-t border-border")}>
        <div className="px-6 sm:px-10 lg:px-14 py-5 flex flex-wrap items-center justify-between gap-3">
          <span className="font-data text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
            ECO//SIM · Teluk Nusa · an open educational model, not real-world advice
          </span>
          <span className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
            © 2026 · Last updated · Aug 18, 2026
          </span>
        </div>
      </footer>
    </div>
  );
}
