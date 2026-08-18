/**
 * ECO//SIM — Story Mode (Editorial Field Study v4)
 * "The town tells you what is wrong." A five-chapter illustrated walk of
 * Teluk Nusa in 2026 — sea, town, water, harvest, people — so a child can
 * understand the problem without reading a single number. Serif display,
 * mono labels, real photography, hairline rules, vermilion accents, no radius.
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

const PHOTOS = {
  riverVillage: "/manus-storage/real-river-village_e8ba4542.jpg",
  mangroveRoots: "/manus-storage/real-mangrove-roots_4e54c47e.jpg",
  fishingCoast: "/manus-storage/real-beach-sunset_d533ecf5.jpg",
  mangroveAerial: "/manus-storage/real-mangrove-aerial_deefef09.jpg",
  workingJetty: "/manus-storage/real-penang-jetty_a82ca28d.jpg",
};

interface Chapter {
  n: string;
  voice: string; // the town speaks first — story line a child hears
  title: string;
  lesson: string; // what the chapter teaches (plain language)
  photo: string;
  alt: string;
  cap: string;
  fig: string;
  connects: string; // which dials / indicators this chapter maps to
}

const CHAPTERS: Chapter[] = [
  {
    n: "01",
    voice:
      "“The houses here lean on the water. When the river rises, the whole village rises with it — until it doesn’t come back down.”",
    title: "A town that lives on the water",
    lesson:
      "Most of Teluk Nusa was built right beside the sea and the river — homes, markets, roads. That is beautiful, and it is also the town’s biggest risk. Every year the sea creeps a little higher, and every year the rain comes heavier. The closer we build to the water, the more the town must defend itself.",
    photo: PHOTOS.riverVillage,
    alt: "Colourful boats moored in a calm Malaysian river village",
    cap: "River village, fictional Teluk Nusa",
    fig: "Fig. 01",
    connects:
      "Connects to: Building by the Beach · Safe From Flood · Plant Trees & Mangroves",
  },
  {
    n: "02",
    voice:
      "“My grandmother said the mangroves were a wall. We cut most of them down. Now the waves knock at our door.”",
    title: "The wall we cut down",
    lesson:
      "Mangroves are trees that grow in salt water. Their roots hold the soil, slow the waves, and give baby fish a nursery to hide. When we clear them to build, flooding gets worse and the fish count falls. When we plant them back, both get better — slowly, but surely. Nature works; we just have to give it time.",
    photo: PHOTOS.mangroveRoots,
    alt: "Mangrove prop roots tangled on a tidal flat",
    cap: "Mangrove roots — nature’s sea wall",
    fig: "Fig. 02",
    connects:
      "Connects to: Plant Trees & Mangroves · Nature & Animals · How Much We Fish",
  },
  {
    n: "03",
    voice:
      "“I go out before the sun. Some days the nets are heavy. Some days I bring home only stories.”",
    title: "The nets that come home lighter",
    lesson:
      "Fishing feeds this town — boats, markets, dinners. But the sea only gives what it has. Catch too many fish today and there are fewer parents to make babies tomorrow. The dial called “How Much We Fish” is the hardest one: take less now, and the sea rewards you for years. Take more now, and the sea goes quiet.",
    photo: PHOTOS.fishingCoast,
    alt: "Fishing boats on the coast at dusk",
    cap: "The fishing coast, dusk",
    fig: "Fig. 03",
    connects:
      "Connects to: How Much We Fish · Nature & Animals · Good Life",
  },
  {
    n: "04",
    voice:
      "“From up here you can see the whole bargain: where the green ends, the roofs begin.”",
    title: "The whole town from above",
    lesson:
      "Everything in this simulation is connected, like a web. The roads bring smoke; the smoke changes the air; the air changes the rain; the rain fills the river; the river decides whose floor gets wet. One decision — one dial — pulls on every thread. That is why we watch seven things at once, not just one.",
    photo: PHOTOS.mangroveAerial,
    alt: "Aerial view of mangrove forest meeting coastal development",
    cap: "Aerial view — green edge, grey edge",
    fig: "Fig. 04",
    connects: "Connects to: every dial · every indicator",
  },
  {
    n: "05",
    voice:
      "“You’re the new boss? Good. The old boss always said there was no money. You have RM 100 a year. Don’t waste it on what looks good. Spend it on what lasts.”",
    title: "The town hands you the keys",
    lesson:
      "You start in 2026 with RM 100 every year — not much. That is the whole game: choose where the money goes, and live with the answer for 25 years. There is no perfect choice, only trade-offs. The town will tell you what worked and what didn’t. Fail safely here, so you learn how the real world works.",
    photo: PHOTOS.workingJetty,
    alt: "Clan jetty — houses and work over the water",
    cap: "Life and work on the jetty",
    fig: "Fig. 05",
    connects: "Connects to: the simulator · the whole study",
  },
];

export default function Story() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader backHref="/" />

      <main className="flex-1">
        {/* Chapter masthead */}
        <section className="px-6 sm:px-10 lg:px-14 pt-12 pb-10 border-b border-border">
          <div className="field-label mb-6">Story mode · the town speaks</div>
          <h1 className="font-display font-semibold tracking-tight leading-[0.98] text-[clamp(2.4rem,5.5vw,4.2rem)] max-w-3xl">
            Five chapters. <em className="text-vermilion">No numbers.</em> Just
            the town telling you what is wrong.
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            Before you touch a single dial, walk through Teluk Nusa as it is
            today. Listen to the people. Then go run the simulation — you
            will already know why each decision matters.
          </p>
        </section>

        {/* Chapters */}
        <div className="divide-y divide-border">
          {CHAPTERS.map((c, i) => (
            <motion.section
              key={c.n}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.04, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="grid lg:grid-cols-[1fr_1.15fr] gap-0 min-w-0"
            >
              {/* Voice + lesson */}
              <div className="px-6 sm:px-10 lg:px-14 py-10 lg:py-14 lg:border-r border-border min-w-0">
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="font-data text-vermilion text-base">{c.n}</span>
                  <div className="field-label !gap-3">
                    <span>Chapter {c.n}</span>
                  </div>
                </div>
                <blockquote className="font-display italic text-xl sm:text-2xl leading-snug border-l-2 border-vermilion pl-5 mb-6">
                  {c.voice}
                </blockquote>
                <h2 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight mb-4">{c.title}</h2>
                <p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground max-w-xl">{c.lesson}</p>
                <div className="mt-6">
                  <span className="status-chip">{c.connects}</span>
                </div>
              </div>
              {/* Photo plate */}
              <figure className="photo-plate overflow-hidden m-6 sm:m-8 lg:m-8">
                <img src={c.photo} alt={c.alt} className="h-full min-h-56 w-full" loading="lazy" />
                <figcaption className="plate-caption">
                  <span>{c.cap}</span>
                  <span>{c.fig}</span>
                </figcaption>
              </figure>
            </motion.section>
          ))}
        </div>

        {/* Closing band */}
        <section className="border-t border-border bg-foreground text-background">
          <div className="px-6 sm:px-10 lg:px-14 py-14 grid lg:grid-cols-[1.4fr_auto] items-center gap-8">
            <div>
              <div className="font-data text-[11px] tracking-[0.14em] uppercase text-background/60 mb-3">
                End of story · the rest is yours
              </div>
              <p className="font-display italic text-xl sm:text-2xl max-w-xl leading-snug">
                You have met the town. Now spend twenty-five years keeping it
                alive — and send us a postcard from 2050.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/simulator"
                className="btn-press inline-flex items-center gap-3 bg-vermilion text-primary-foreground font-display italic text-lg px-8 py-3.5 hover:brightness-110 transition-all"
              >
                Begin the study <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/briefing"
                className="btn-press inline-flex items-center border border-background/40 px-6 py-3.5 font-data text-[11px] tracking-[0.14em] uppercase hover:bg-background hover:text-foreground transition-colors"
              >
                Mission briefing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="px-6 sm:px-10 lg:px-14 py-4">
          <span className="font-data text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
            ECO//SIM · fictional town · educational model
          </span>
          <span className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
            Last updated · Aug 18, 2026
          </span>
        </div>
      </footer>
    </div>
  );
}
