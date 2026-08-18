/**
 * ECO//SIM — Story Mode (Editorial Field Study v4)
 * "The town tells you what is wrong." A five-chapter illustrated walk of
 * Teluk Nusa in 2026 — sea, town, water, harvest, people — so a child can
 * understand the problem without reading a single number. Serif display,
 * mono labels, real photography, hairline rules, vermilion accents, no radius.
 */
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";
import SiteFooter from "@/components/SiteFooter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

const PHOTOS = {
  riverVillage: "/manus-storage/river-village_7f0fc750.jpg",
  mangroveRoots: "/manus-storage/mangrove-roots_f89f9365.jpg",
  fishingCoast: "/manus-storage/hero_beach-sunset_46f82884.jpg",
  mangroveAerial: "/manus-storage/mangrove-aerial_136e988a.jpg",
  workingJetty: "/manus-storage/penang-jetty_1c063f93.jpg",
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
      "“When the river rises, our village rises with it. Some years the water comes back down. It did not come back down the year of my wedding.”",
    title: "A town that lives on the water",
    lesson:
      "Most of Teluk Nusa was built beside the sea and the river: homes, markets, roads. That is also the town's biggest risk. The sea rises a little every year, and the rain comes heavier. Building closer to the water means building more of the town's defence.",
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
      "“My grandmother said the mangroves were a wall. We cut most of them down. Now the waves knock at the door.”",
    title: "The wall we cut down",
    lesson:
      "Mangroves grow in salt water. Their roots hold the soil, slow the waves, and give baby fish a place to hide. Clear them to build, and flooding gets worse while the fish count falls. Plant them back, and both recover. Slowly, but for sure.",
    photo: PHOTOS.mangroveRoots,
    alt: "Mangrove prop roots tangled on a tidal flat",
    cap: "Mangrove roots on a tidal flat",
    fig: "Fig. 02",
    connects:
      "Connects to: Plant Trees & Mangroves · Nature & Animals · How Much We Fish",
  },
  {
    n: "03",
    voice:
      "“I leave before the sun. Some days the nets are heavy. Some days I bring home stories instead.”",
    title: "The nets that come home lighter",
    lesson:
      "Fishing feeds this town: boats, markets, dinners. The sea only gives what it has. Catch too many fish today and there are fewer parents to make babies tomorrow. The dial called “How Much We Fish” is the hardest one. Take less now and the sea rewards you for years. Take more now and the sea goes quiet.",
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
      "“From up here you can see the bargain the town made: where the green ends, the roofs begin.”",
    title: "The whole town from above",
    lesson:
      "Everything here is connected. The roads bring smoke, the smoke changes the air, the air changes the rain, the rain fills the river, and the river decides whose floor gets wet. One dial pulls on every thread. That is why we watch seven things at once, not just one.",
    photo: PHOTOS.mangroveAerial,
    alt: "Aerial view of mangrove forest meeting coastal development",
    cap: "Aerial view of the coast",
    fig: "Fig. 04",
    connects: "Connects to: every dial · every indicator",
  },
  {
    n: "05",
    voice:
      "“The old boss always said there was no money. You have RM 100 a year. Don't spend it on what looks good. Spend it on what lasts.”",
    title: "The town hands you the keys",
    lesson:
      "You start in 2026 with RM 100 a year, which is not much. That is the whole game: choose where the money goes, then live with the answer for 25 years. The town will tell you what worked and what did not. Fail safely here, and you will learn something that holds in the real world.",
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

      <PageMeta
        title="ECO//SIM — Five Chapters of Teluk Nusa · the story"
        description="Walk through Teluk Nusa as it is today: five chapters about a town that lives on the water, its mangrove shield, and the people you decide for."
      />
      <SiteHeader backHref="/" />

      <main className="flex-1">
        {/* Chapter masthead */}
        <section className="px-6 sm:px-10 lg:px-14 pt-12 pb-10 border-b border-border">
          <h1 className="font-display font-semibold tracking-tight leading-[0.98] text-[clamp(2.4rem,5.5vw,4.2rem)] max-w-3xl">
            Five chapters. <em className="text-vermilion">No numbers.</em> The
            town tells you what is wrong.
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            Before you touch a dial, walk through Teluk Nusa as it is today.
            Listen to the people. When you run the simulation afterward, you
            will already know why each decision matters.
          </p>
        </section>

        {/* Chapters */}
        <div className="divide-y divide-border">
          {CHAPTERS.map((c, i) => (
            <motion.section
              key={c.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              className="grid lg:grid-cols-[1fr_1.15fr] gap-0 min-w-0 group"
            >
              {/* Voice + lesson */}
              <div className="px-6 sm:px-10 lg:px-14 py-10 lg:py-14 lg:border-r border-border min-w-0">
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="font-data text-vermilion text-base">{c.n}</span>
                </div>
                <blockquote className="font-display italic text-xl sm:text-2xl leading-snug border-l-2 border-vermilion pl-5 mb-6">
                  {c.voice}
                </blockquote>
                <h2 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight mb-4">{c.title}</h2>
                <p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground max-w-xl">{c.lesson}</p>
                <div className="mt-6">
                  <span className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground/70">{c.connects}</span>
                </div>
              </div>
              {/* Photo plate */}
              <figure className="photo-plate overflow-hidden m-6 sm:m-8 lg:m-8 group cursor-pointer">
                <img src={c.photo} alt={c.alt} className="h-full min-h-56 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" loading="lazy" />
                <figcaption className="plate-caption">
                  <span>{c.cap}</span>
                  <span>{c.fig}</span>
                </figcaption>
              </figure>
            </motion.section>
          ))}
        </div>

        {/* Closing band */}
        <section className="border-t border-border bg-secondary text-secondary-foreground dark:bg-[oklch(0.12_0.01_75)] dark:border-border">
          <div className="px-6 sm:px-10 lg:px-14 py-14 grid lg:grid-cols-[1.4fr_auto] items-center gap-8">
            <div>
              <div className="font-data text-[11px] tracking-[0.14em] uppercase text-secondary-foreground/60 dark:text-[oklch(0.62_0.01_80)] mb-3">
                End of story
              </div>
              <p className="font-display italic text-xl sm:text-2xl max-w-xl leading-snug">
                You have met the town. Now spend twenty-five years trying to
                keep it standing.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/simulator"
                className="btn-press inline-flex items-center gap-3 bg-vermilion text-primary-foreground font-display italic text-lg px-8 py-3.5 hover:brightness-110 transition-all"
              >
                Start the simulation <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/briefing"
                className="btn-press inline-flex items-center border border-current/40 px-6 py-3.5 font-data text-[11px] tracking-[0.14em] uppercase hover:bg-primary-foreground/10 transition-colors"
              >
                Mission briefing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
