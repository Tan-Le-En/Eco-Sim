/**
 * ECO//SIM — Privacy notice (Editorial Field Study v11)
 * Style: plain, honest, short. Same paper/dossier language as the rest of the
 * site. No legal theatre: state what we collect, what we never collect, and
 * what stays on the device. Matches what the app actually does today.
 */
import SiteFooter from "@/components/SiteFooter";
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <PageMeta
        title="ECO//SIM — Privacy notice"
        description="What this site keeps and what it does not: nothing is required, nothing is collected today, nothing is ever sold."
      />
      <main id="main" tabIndex={-1} className="container py-12 flex-1 max-w-3xl px-6 sm:px-10 outline-none">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="field-label mb-3">Privacy notice · ECO//SIM</div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
            What this site keeps, and what it does not.
          </h1>

          <p className="text-muted-foreground leading-relaxed mb-8">
            ECO//SIM is an educational website about a fictional town. This
            notice tells you, plainly, what happens to your data when you visit.
          </p>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-lg font-semibold">1. Nothing is required</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You can use the whole simulator without an account, without
              signing up, and without giving us anything. Your simulation plans
              are saved in your own browser and never leave your device.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-lg font-semibold">
              2. What stays on your device
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your plans, chosen theme, and cookie preference live in your
              browser's local storage. Clearing this site's storage in your
              browser settings erases them completely and instantly.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-lg font-semibold">
              3. Analytics: off today, optional later
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The site currently sends nothing anywhere: no analytics, no
              trackers, no cookies for tracking. The banner asks whether
              we may switch on optional, privacy-friendly analytics in the
              future — your answer is stored so the choice sticks. If that
              ever happens, it would record only anonymous aggregate usage
              (for example, how often the simulator is run), never names,
              emails, or anything you type into the simulation.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-lg font-semibold">4. What we never do</h2>
            <ul className="text-sm leading-relaxed text-muted-foreground list-disc pl-5 space-y-1.5">
              <li>Sell, rent, or trade any data.</li>
              <li>Track you across other websites.</li>
              <li>Use anything here for advertising or profiling.</li>
              <li>Claim this educational model is a real-world forecast.</li>
            </ul>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="font-display text-lg font-semibold">5. Questions</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Every equation and number is published on the{" "}
              <Link href="/transparency" className="underline underline-offset-2 hover:text-foreground">
                Transparency page
              </Link>
              . There is no contact form today; if that changes, this notice
              changes first.
            </p>
          </section>

          <div className="border-t border-border pt-6 flex flex-wrap items-center gap-4">
            <Link href="/" className="font-data text-[11px] tracking-[0.14em] uppercase text-vermilion hover:underline inline-flex items-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Home
            </Link>
            <Link href="/terms" className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground hover:text-foreground hover:underline inline-flex items-center gap-2">
              Terms of use <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  );
}
