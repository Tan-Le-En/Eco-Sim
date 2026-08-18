/**
 * ECO//SIM — FAQ (Editorial Field Study v3 + v7 production layer)
 * Expandable question plates, mono field labels, hairline rules.
 * Honest answers — no marketing filler.
 */
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
    a: "Seven registers are measured in 2050: sea and air, nature, clean water, flood safety, health, economy, and fairness. Each is scored 0–100. They are combined with published weights (nature 25%, health 20%, flood 15%, water 15%, economy 10%, air 8%, equity 7%) into one number out of 100. The full equation is on the Transparency page.",
  },
  {
    id: "perfect",
    q: "Why can't I reach a score of 100?",
    a: "Because Teluk Nusa has real trade-offs, like every coastal town. A plan with zero factories, zero fishing, and zero construction keeps the sea clean but collapses the economy to around 32. The model's own structure caps the mathematical maximum at about 77. That isn't a bug; it's the lesson. A working town of 72 beats a pristine town of 77 on most measures that matter to people.",
  },
  {
    id: "targets",
    q: "What are the five mission targets?",
    a: "By 2050 you're aiming for: clean air (pollution below threshold), living nature (biodiversity above threshold), clean water (contamination below threshold), flood-safe homes (resilience above threshold), and fairness (everyone's wellbeing gap below threshold). The Mission chip in the simulator shows how many you are hitting in real time. Hover over it to see the exact thresholds.",
  },
  {
    id: "budget",
    q: "What happens when the town's budget runs out?",
    a: "When money hits zero, restoration and resilience projects stall and public approval drops. Your income comes mainly from coastal development and industrial activity: building by the beach and keeping factories running pay the town's bills, at the environment's expense. Balancing income against spending is the hardest part of governing.",
  },
  {
    id: "real",
    q: "Is Teluk Nusa a real town? Are the photos real?",
    a: "The town is fictional, but the photographs are real images of Malaysia's coasts (Kuala Kedah, Penang, Langkawi, and the East Coast), and the model's numbers are calibrated to published relationships between emissions, deforestation, fishing pressure, and coastal flooding. Nothing here is a forecast; it's an educational model, and every equation is published.",
  },
  {
    id: "kids",
    q: "Can a young child play this?",
    a: "Yes. The dials use plain language like Clean Power, Buses and Trains, and Plant Trees. Each one carries a one-line plain-English consequence. Children can see the town respond immediately: more smoke, angrier storms, cleaner water. The numbers underneath stay rigorous for whoever wants to go deeper.",
  },
  {
    id: "teachers",
    q: "How can teachers use this in class?",
    a: "Each student can try the same setup and compare scores. The simulator's plan-save feature lets up to four plans be compared side by side on the Results page. Debrief prompts: Which trade-off surprised you? Why did a \"green\" plan sometimes hurt the poor? What would your town actually choose, and what would it cost?",
  },
  {
    id: "phone",
    q: "Does it work on a phone?",
    a: "Yes. Every page is built mobile-first. On a phone the simulator stacks into a single column: the map, the seven registers, the trajectory chart, and all eight dials. Dials step by 1% and can be dragged or tapped.",
  },
  {
    id: "privacy",
    q: "Do you track me?",
    a: "Minimal. Your plan choices and theme are kept only on your own device. There is a simple cookie banner for optional analytics, and any anonymous visit counters are handled by the hosting platform. No accounts, no email collection is stored anywhere.",
  },
  {
    id: "dark",
    q: "Is there a dark mode?",
    a: "Yes. The sun/moon icon in the header switches between the paper-light field study and the night archive. Your choice is remembered between visits.",
  },
];

export default function Faq() {
  return (
    <div className="min-h-screen flex flex-col bg-background">

      <PageMeta
        title="ECO//SIM — FAQ · asked at the field desk"
        description="Honest answers about the score, the trade-offs, classrooms, phones, and privacy. If it isn't here, search."
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        <div className="px-6 sm:px-10 lg:px-14 py-10 max-w-[1000px] mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
            Asked at the <span className="italic text-vermilion">field desk.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Honest answers, published like everything else on this site. If the
            answer you need isn't here, use the search bar above.
          </p>

          <div className="mt-10">
            <Accordion type="single" collapsible className="border-t border-border">
              {FAQS.map((f) => (
                <AccordionItem key={f.id} value={f.id} className="border-b border-border">
                  <AccordionTrigger className="py-5 text-left font-display text-lg sm:text-xl hover:no-underline hover:text-vermilion transition-colors">
                    <span className="flex items-baseline gap-3">
                      <span className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
                        {f.id.toUpperCase().padStart(2, "0")}
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
            <Link
              href="/transparency"
              className="btn-press inline-flex items-center gap-2 bg-vermilion text-primary-foreground font-data text-[11px] tracking-[0.14em] uppercase px-5 py-2.5 hover:brightness-105 transition-all"
            >
              Open transparency →
            </Link>
          </div>
        </div>

        {/* Footer band with last-updated date */}
        <SiteFooter />
      </main>
    </div>
  );
}
