/**
 * ECO//SIM — Custom 404 (Editorial Field Study v12)
 * Same paper/editorial voice as the rest of the site. Above the fold: status,
 * plain explanation, and a primary CTA to start the story. No tech jargon.
 */
import { Link } from "wouter";
import { ArrowRight, Compass } from "lucide-react";
import PageMeta from "@/components/PageMeta";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageMeta
        title="ECO//SIM — 404 · page not found"
        description="The page you asked for is not here. The town is a few clicks away."
      />
      <main
        id="main"
        tabIndex={-1}
        className="flex-1 flex items-center justify-center px-6 py-16 outline-none"
      >
        <div className="max-w-md w-full text-center">
          <div className="font-data text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-5">
            404 · nowhere on the map
          </div>
          <div className="flex justify-center mb-6">
            <Compass className="w-12 h-12 text-vermilion" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-tight leading-tight">
            Lost in the <span className="text-vermilion">field</span>.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
            The page you asked for is not here. It may never have existed, or
            the address changed. Either way, the town is waiting a few clicks
            away.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/story" className="btn btn-primary">
              Start the story <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/" className="btn btn-outline">
              Back home
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-px border border-border">
            {[
              { href: "/simulator", label: "Simulator" },
              { href: "/transparency", label: "Transparency" },
              { href: "/faq", label: "FAQ" },
            ].map(l => (
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
