/**
 * ECO//SIM — Terms of use (Editorial Field Study v11)
 * Style: plain, honest, short. Emphasises the educational nature of the model
 * and the fictional town, so no visitor mistakes the simulator for advice.
 */
import { useEffect } from "react";
import SiteFooter from "@/components/SiteFooter";
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of use · ECO//SIM";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">

      <PageMeta
        title="ECO//SIM — Terms of use"
        description="The rules: an educational simulation, a fictional town, real photographs, open equations, free classroom use."
      />
      <main className="container py-12 flex-1 max-w-3xl px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="field-label mb-3">Terms of use · ECO//SIM</div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
            The rules of this game, and this site.
          </h1>

          <p className="text-muted-foreground leading-relaxed mb-8">
            Teluk Nusa is a fictional town. Every number in this simulator is an
            illustrative constant for teaching. This page exists so there are
            no misunderstandings.
          </p>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-lg font-semibold">
              1. Not a forecast, not advice
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              ECO//SIM is an educational simulation. Its outputs are not
              predictions about any real coastal city, and they are not
              engineering, financial, or planning advice. Do not base real
              decisions, policy, or investments on this tool.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-lg font-semibold">2. A fictional town, real photographs</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The town, its people, and its events are invented. The
              photographs are real images of Malaysian coasts used under their
              respective licences to show what such places look like. Names,
              captions, and figures on this site are editorial devices.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-lg font-semibold">3. Open equations</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The entire model is published on the site. Anyone can inspect the
              equations, weights, and assumptions on the{" "}
              <Link href="/transparency" className="text-vermilion underline underline-offset-2">
                transparency page
              </Link>
              . If something looks wrong, that is how you would find out.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-lg font-semibold">4. Teaching use</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Teachers and students are welcome to use this site in classrooms
              without paying anything. Screenshots and discussion of the
              published equations for educational purposes are encouraged.
              Rehosting the whole site, reselling it, or presenting its outputs
              as real data is not.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-lg font-semibold">5. Availability</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The site is provided as-is, free of charge. Everything works in
              your browser with no server-side dependence, so no data of yours
              lives on our machines. We do not promise it will stay online
              forever, though we intend it to.
            </p>
          </section>

          <div className="border-t border-border pt-6 flex flex-wrap items-center gap-4">
            <Link href="/" className="font-data text-[11px] tracking-[0.14em] uppercase text-vermilion hover:underline inline-flex items-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Home
            </Link>
            <Link href="/privacy" className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground hover:text-foreground hover:underline inline-flex items-center gap-2">
              Privacy notice <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  );
}
