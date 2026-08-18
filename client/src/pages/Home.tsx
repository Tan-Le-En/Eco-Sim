/**
 * ECO//SIM — Landing (Editorial Field Study v3)
 * Documentary-editorial: full-viewport asymmetric hero with real photography,
 * field-numbered sections, hairline rules, zero radius, single vermilion accent.
 * Single screen on desktop — hero fills the viewport, one band below.
 */
import { Link } from "wouter";
import SiteFooter from "@/components/SiteFooter";
import PageMeta from "@/components/PageMeta";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

const HERO = "/manus-storage/teluk-nusa-map-real_042467eb.jpg";
const JETTY = "/manus-storage/stilt-houses-real_4d70b8ec.jpg";
const MANGROVE = "/manus-storage/merbok-mangrove-real_ccdd2def.jpg";
const NETS = "/manus-storage/fishermen-dawn-nets-real_81f6e009.jpeg";
const LANGKAWI = "/manus-storage/clan-jetties-aerial-real_f756af5d.jpg";

const FIELD = [
  {
    n: "01",
    k: "Meet your town",
    t: "Teluk Nusa is a fictional Malaysian town on the Strait of Malacca. Fewer fish, flooding monsoons, salt water in the taps: the real problems of a thousand real towns. The people in these photographs are the people you are deciding for.",
    img: JETTY,
    cap: "Clan jetty, Penang. Houseboats and wooden walkways over the sea.",
  },
  {
    n: "02",
    k: "Change one thing. Watch the town.",
    t: "Eight decisions shape twenty-five years. Seven things to protect: the sea and air, nature, drinking water, flood safety, public health, prosperity, and fairness. Move one dial and the whole town responds, usually in ways you did not expect.",
    img: MANGROVE,
    cap: "Mangrove river, Langkawi. Nature's own sea wall.",
  },
  {
    n: "03",
    k: "Try again.",
    t: "You will not find a perfect plan; you will find trade-offs. Every result tells you why things changed, and the full mathematics is published on the transparency page. Come back when a run goes wrong and try a different plan.",
    img: NETS,
    cap: "Fishermen with nets at dawn, Kuala Kedah",
  },
];

export default function Home() {
  // Sticky mobile CTA: once the hero scrolls out of view, offer the main action
  // from the bottom of the screen on small devices.
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const el = document.getElementById("home-hero");
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      setPastHero(rect.bottom < 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <PageMeta
        title="ECO//SIM — A Field Study of a Coastal Town, 2026–2050"
        description="Change one thing, watch everything change. An interactive field study of Teluk Nusa, a fictional Malaysian coastal town: simple enough for a child, rigorous enough for a professor."
      />
    <div className="min-h-screen flex flex-col bg-background">
      {/* ────────────── Full-viewport editorial hero ────────────── */}
      <section id="home-hero" className="relative flex-1 grid lg:grid-cols-[1.1fr_1fr] min-h-screen">
        {/* Left: typographic hero, offset */}
        <div className="relative paper-grain flex flex-col justify-between px-6 sm:px-10 lg:px-14 py-8 lg:py-10 border-r border-border">
          <SiteHeader bare />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-xl"
          >
            <h1 className="font-display font-semibold tracking-tight text-[clamp(3rem,7.5vw,6.5rem)] leading-[1.02]">
              <span className="block mb-2 sm:mb-3">One million</span>
              <span className="block mb-2 sm:mb-3">people.</span>
              <span className="block">
                Twenty-five <em className="text-vermilion">years.</em>
              </span>
            </h1>
            <p className="mt-8 sm:mt-10 max-w-md text-base sm:text-lg leading-relaxed text-muted-foreground">
              You govern Teluk Nusa, a small town on the Malaysian coast,
              from 2026 to 2050. Keep the sea alive, the water clean, and
              treat people fairly. That is the whole job, and it has no easy
              answer.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/story"
                className="btn-press inline-flex items-center gap-3 bg-vermilion text-primary-foreground font-display italic text-lg px-8 py-3.5 hover:brightness-105 transition-all"
              >
                Read the story <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
                All equations published. No black boxes.
              </span>
            </div>
          </motion.div>

          <footer className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-5 border-t border-border gap-1.5">
            <span className="font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
              Est. 2026 · 05.94°N · an open learning model, not a forecast
            </span>
            <span className="hidden sm:block font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
              All equations published
            </span>
          </footer>
        </div>

        {/* Right: bleeding photograph plate */}
        <div className="relative min-h-[42vh] lg:min-h-0">
          <img
            src={HERO}
            alt="Aerial photograph of Kuala Kedah estuary showing the river mouth, coastal settlement, and breakwater"
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent dark:from-background dark:via-background/10" />
          <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 py-5">
            <div className="plate-caption !bg-transparent !border-transparent !text-background/90 !font-semibold">
              <span>Aerial view, Kuala Kedah estuary</span>
              <span>Fig. 01</span>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── Three numbered field plates (editorial triptych) ────────────── */}
      <section className="border-t border-border">
        <div className="grid lg:grid-cols-[1fr_auto] items-end px-6 sm:px-10 lg:px-14 pt-12 pb-8">
          <div>
            <h2 className="font-display font-semibold text-3xl sm:text-5xl tracking-tight">
              Three things, plainly.
            </h2>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border border-t border-border">
          {FIELD.map((f, i) => (
            <motion.div
              key={f.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              className="group"
            >
              <div className="px-6 sm:px-10 pt-8 pb-4">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="font-display italic font-semibold text-xl">{f.k}</span>
                </div>
                <p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground max-w-sm">
                  {f.t}
                </p>
              </div>
              <figure className="mx-6 sm:mx-10 mb-10 photo-plate overflow-hidden cursor-pointer">
                <img
                  src={f.img}
                  alt={f.cap}
                  className="h-52 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="plate-caption">{f.cap}</figcaption>
              </figure>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ────────────── CTA band: quote + closing photograph + actions ────────────── */}
      <section className="border-t border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="px-6 sm:px-10 lg:px-14 py-14 grid lg:grid-cols-[1.3fr_1fr_auto] items-center gap-8"
        >
          <div>
            <p className="font-display italic text-xl sm:text-2xl max-w-xl">
              “When I was young, the bay was full of fish. Can you keep it
              that way?”
            </p>
            <p className="mt-3 font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
              What a fisherman in Teluk Nusa actually wants to know
            </p>
          </div>
          <figure className="photo-plate overflow-hidden hidden md:block group cursor-pointer">
            <img
              src={LANGKAWI}
              alt="Aerial view of stilt house village on the coast, Penang"
              className="h-52 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />
            <figcaption className="plate-caption">
              <span>Coastal settlement, Penang</span>
              <span>Fig. 05</span>
            </figcaption>
          </figure>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/simulator"
              className="btn-press inline-flex items-center gap-3 bg-vermilion text-primary-foreground font-display italic text-lg px-8 py-3.5 hover:brightness-105 transition-all"
            >
              Start governing <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/briefing"
              className="btn-press inline-flex items-center border border-current px-8 py-3.5 font-data text-[11px] tracking-[0.14em] uppercase hover:bg-primary-foreground/10 transition-colors"
            >
              Mission briefing
            </Link>
            <Link
              href="/faq"
              className="btn-press inline-flex items-center border border-border px-5 py-3.5 font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
          </div>
        </motion.div>
      </section>

      <SiteFooter />
    </div>

    {/* Sticky mobile CTA bar — appears once the hero has scrolled away */}
    {pastHero && (
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-md px-4 py-3 flex items-center gap-3">
        <Link
          href="/simulator"
          className="btn-press flex-1 inline-flex items-center justify-center gap-2 bg-vermilion text-primary-foreground font-display italic text-base px-5 py-3 hover:brightness-105 transition-all"
        >
          Start governing <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/briefing"
          className="btn-press inline-flex items-center border border-border px-4 py-3 font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
        >
          Briefing
        </Link>
      </div>
    )}
    </>
  );
}
