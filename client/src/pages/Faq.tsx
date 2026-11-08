/**
 * ECO//SIM — FAQ (Editorial Field Study v3 + v7 production layer)
 * Expandable question plates, mono field labels, hairline rules.
 * Honest answers — no marketing filler.
 */
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";

const FAQS = [
  {
    id: "score",
    q: "How is the final score calculated?",
    a: "Seven registers in 2050, weighted: climate 20%, nature 15%, water 15%, flood 15%, health 15%, economy 10%, fairness 10%. Penalties apply if a system collapses. Full maths on the Transparency page.",
  },
  {
    id: "perfect",
    q: "Why can't I reach a score of 100?",
    a: "Trade-offs are real. Zero factories, fishing, and building keeps the sea clean but collapses the economy. The model caps near 77. That is the lesson: a working town beats a pristine one.",
  },
  {
    id: "targets",
    q: "What are the five mission targets?",
    a: "By 2050: heat-loaded air pressure below its cap (45), and nature, water, flood safety, and fairness above their floors (70, 60, 65, 60). The Mission chip shows how many you hit live. Tap it for the numbers.",
  },
  {
    id: "budget",
    q: "What happens when the town's budget runs out?",
    a: "Projects stall and approval drops. The treasury starts with 100 points for all 25 years; income walks in at 1–6 points a year, and only when factories work. Every policy spends. Balancing money against nature is the hardest part.",
  },
  {
    id: "real",
    q: "Is Teluk Nusa a real town? Are the photos real?",
    a: "Town is fictional. Photos are real Malaysian coasts. Numbers follow published relationships. Educational model, not a forecast.",
  },
  {
    id: "kids",
    q: "Can a young child play this?",
    a: "Yes. Plain dial names, one-line effects. The town responds at once. Rigour stays underneath for anyone who wants it.",
  },
  {
    id: "teachers",
    q: "How can teachers use this in class?",
    a: "Save up to four plans and compare them on Results. Debrief: which trade-off surprised you? Why did a \"green\" plan hurt the poor?",
  },
  {
    id: "phone",
    q: "Does it work on a phone?",
    a: "Yes. One column on phones: map, registers, chart, dials. Drag or tap the dials.",
  },
  {
    id: "privacy",
    q: "Do you track me?",
    a: "No accounts. Plans stay on your device. Nothing is collected today — any future analytics stays optional.",
  },
  {
    id: "dark",
    q: "Is there a dark mode?",
    a: "Yes. Sun/moon icon in the header. Remembered between visits.",
  },
];

export default function Faq() {
  // Deep-linked answers (e.g. /faq#budget) start open.
  const [initialOpen] = useState(() => window.location.hash.replace(/^#/, ""));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageMeta
        title="ECO//SIM — FAQ · asked at the field desk"
        description="Honest answers about the score, the trade-offs, classrooms, phones, and privacy. If it isn't here, search."
      />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <div className="px-6 sm:px-10 lg:px-14 py-10 max-w-[1000px] mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
            Questions the field desk gets <span className="text-vermilion">most</span>.
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Honest answers, published like everything else on this site. If the
            answer you need isn't here, use the search above
            (<kbd className="font-data text-[11px] border border-border px-1.5 py-0.5">⌘K</kbd>).
          </p>

          <div className="mt-10">
            <Accordion type="single" collapsible defaultValue={initialOpen || undefined} className="border-t border-border">
              {FAQS.map((f, i) => (
                <AccordionItem key={f.id} value={f.id} id={f.id} className="border-b border-border scroll-mt-20">
                  <AccordionTrigger className="py-5 text-left font-display text-lg sm:text-xl hover:no-underline hover:text-vermilion transition-colors">
                    <span className="flex items-baseline gap-3">
                      <span className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {f.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-10 pr-2 pb-5">
                    <p className="text-[14px] leading-relaxed text-foreground/85 max-w-2xl">
                      {f.a}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border border-border bg-card px-5 py-4">
            <div>
              <div className="font-data text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
                Still curious about the model?
              </div>
              <div className="font-display text-xl font-semibold mt-0.5">
                Every equation is published.
              </div>
            </div>
            <Link href="/transparency" className="btn btn-primary">
              Open transparency →
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
