/**
 * ECO//SIM — Custom 404 (Editorial Field Study v12)
 * Same paper/editorial voice as the rest of the site. Above the fold: status,
 * plain explanation, and a primary CTA to start the story. No tech jargon.
 */
import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 · Page not found — ECO//SIM";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center">
          <div className="font-data text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-5">
            404 · nowhere on the map
          </div>
          <div className="flex justify-center mb-6">
            <Compass className="w-12 h-12 text-vermilion" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-tight leading-tight">
            Lost in the <span className="italic text-vermilion">field.</span>
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
            The page you asked for is not here. It may never have existed, or
            the address changed. Either way, the town is waiting a few clicks
            away.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/story"
              className="btn-press inline-flex items-center justify-center gap-2 bg-vermilion text-primary-foreground font-display italic text-lg px-8 py-3.5 hover:brightness-105 transition-all"
            >
              Start the story <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="btn-press inline-flex items-center justify-center gap-2 border border-current/40 font-data text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-primary-foreground/10 transition-colors"
            >
              Back home
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-px border border-border">
            {[
              { href: "/simulator", label: "Simulator" },
              { href: "/transparency", label: "Transparency" },
              { href: "/faq", label: "FAQ" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground hover:text-vermilion hover:bg-secondary transition-colors py-3"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
