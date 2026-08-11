/**
 * ECO//SIM — Landing (Editorial Field Study v3)
 * Documentary-editorial: full-viewport asymmetric hero with real photography,
 * field-numbered sections, hairline rules, zero radius, single vermilion accent.
 * Single screen on desktop — hero fills the viewport, one band below.
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HERO = "/manus-storage/real-kampung-boats_57e6e432.jpg";
const JETTY = "/manus-storage/real-penang-jetty_a82ca28d.jpg";
const MANGROVE = "/manus-storage/real-mangrove-aerial_deefef09.jpg";
const NETS = "/manus-storage/real-fishermen-nets_6fb1be29.jpg";
const LANGKAWI = "/manus-storage/real-langkawi-boats_00027e7a.jpg";

const FIELD = [
  {
    n: "01",
    k: "Meet your town",
    t: "Teluk Nusa is a fictional Malaysian town on the Strait. Its problems — fewer fish, flooding monsoons, salt water in the taps — are the real problems of a thousand real towns. The people in these photographs are the people you are deciding for.",
    img: JETTY,
    cap: "Clan jetty, Penang — houseboats and wooden walkways over the sea",
  },
  {
    n: "02",
    k: "Change one thing. Watch everything.",
    t: "Eight decisions. Twenty-five years. Seven things to protect: the sea and air, nature, drinking water, flood safety, public health, prosperity, and fairness. Move one dial and the whole town responds — usually in ways you did not expect.",
    img: MANGROVE,
    cap: "Mangrove river, Langkawi — nature's own sea wall",
  },
  {
    n: "03",
    k: "Try. Fail. Learn. Repeat.",
    t: "There is no perfect plan — only trade-offs. Every result tells you why things changed, and the full mathematics is published on the transparency page. A five-year-old can play it. A professor can defend it.",
    img: NETS,
    cap: "Fishermen hauling nets at dawn, East Coast Malaysia",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ────────────── Full-viewport editorial hero ────────────── */}
      <section className="relative flex-1 grid lg:grid-cols-[1.1fr_1fr] min-h-screen">
        {/* Left: typographic hero, offset */}
        <div className="relative paper-grain flex flex-col justify-between px-6 sm:px-10 lg:px-14 py-8 lg:py-10 border-r border-border">
          <header className="flex items-center justify-between">
            <Link href="/" className="flex items-baseline gap-1">
              <span className="font-display italic font-semibold text-2xl tracking-tight">
                ECO<span className="text-vermilion">//</span>SIM
              </span>
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/story"
                className="btn-press font-data text-[11px] tracking-[0.14em] uppercase px-3 py-2 border border-border hover:border-foreground transition-colors"
              >
                Story mode
              </Link>
              <Link
                href="/transparency"
                className="btn-press font-data text-[11px] tracking-[0.14em] uppercase px-3 py-2 border border-border hover:border-foreground transition-colors"
              >
                Transparency
              </Link>
              <Link
                href="/simulator"
                className="btn-press font-data text-[11px] tracking-[0.14em] uppercase px-3 py-2 bg-foreground text-background hover:bg-vermilion transition-colors"
              >
                Enter the field
              </Link>
            </nav>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-xl"
          >
            <div className="field-label mb-6">A field study · fictional Malaysian coastal town · 2026–2050</div>
            <h1 className="font-display font-semibold leading-[0.98] tracking-tight text-[clamp(3rem,7.5vw,6.5rem)]">
              One million
              <br />
              people. Twenty-five
              <br />
              <em className="text-vermilion">years.</em>
            </h1>
            <p className="mt-7 max-w-md text-base sm:text-lg leading-relaxed text-muted-foreground">
              You govern Teluk Nusa — a small town on the Malaysian coast — from
              2026 to 2050. Keep the sea alive, the water clean, and the people
              treated fairly. There is no easy answer, and that is the lesson.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/story"
                className="btn-press inline-flex items-center gap-3 bg-vermilion text-primary-foreground font-display italic text-lg px-8 py-3.5 hover:brightness-105 transition-all"
              >
                Read the story <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
                Simple enough for a child. Rigorous enough for a professor.
              </span>
            </div>
          </motion.div>

          <footer className="hidden lg:flex items-center justify-between pt-6 border-t border-border">
            <span className="font-data text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
              Est. 2026 · Latitude 05.94°N · not a forecast — an open learning model
            </span>
            <span className="font-data text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
              All equations published
            </span>
          </footer>
        </div>

        {/* Right: bleeding photograph plate */}
        <div className="relative min-h-[42vh] lg:min-h-0">
          <img
            src={HERO}
            alt="Real photograph of a Malaysian coastal kampung — boats and stilt houses on the water"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 py-5">
            <div className="plate-caption !bg-transparent !border-transparent !text-background/90 !font-semibold">
              <span>Boats and stilt houses, Kuala Kedah</span>
              <span>Fig. 01</span>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── Three numbered field plates (editorial triptych) ────────────── */}
      <section className="border-t border-border">
        <div className="grid lg:grid-cols-[1fr_auto] items-end px-6 sm:px-10 lg:px-14 pt-12 pb-8">
          <div>
            <div className="field-label mb-3">How the study works</div>
            <h2 className="font-display font-semibold text-3xl sm:text-5xl tracking-tight">
              Three things, plainly.
            </h2>
          </div>
          <span className="hidden lg:block font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground pb-1">
            Sections 01–03
          </span>
        </div>
        <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border border-t border-border">
          {FIELD.map((f, i) => (
            <motion.div
              key={f.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.04, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="group"
            >
              <div className="px-6 sm:px-10 pt-8 pb-4">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="font-data text-vermilion text-sm">{f.n}</span>
                  <span className="font-display italic font-semibold text-xl">{f.k}</span>
                </div>
                <p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground max-w-sm">
                  {f.t}
                </p>
              </div>
              <figure className="mx-6 sm:mx-10 mb-10 photo-plate overflow-hidden">
                <img
                  src={f.img}
                  alt=""
                  className="h-44 w-full group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
                <figcaption className="plate-caption">{f.cap}</figcaption>
              </figure>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ────────────── CTA band: quote + closing photograph + actions ────────────── */}
      <section className="border-t border-border">
        <div className="px-6 sm:px-10 lg:px-14 py-14 grid lg:grid-cols-[1.3fr_1fr_auto] items-center gap-8">
          <div>
            <div className="field-label mb-3">The year is 2026</div>
            <p className="font-display italic text-xl sm:text-2xl max-w-xl">
              "The bay was full of fish when I was young. Young boss — can you
              fix my town?"
            </p>
          </div>
          <figure className="photo-plate overflow-hidden hidden md:block">
            <img
              src={LANGKAWI}
              alt="Colourful fishing boats in a Langkawi bay"
              className="h-36 w-full object-cover"
              loading="lazy"
            />
            <figcaption className="plate-caption">
              <span>Fishing bay, Langkawi</span>
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
              className="btn-press inline-flex items-center border border-foreground px-8 py-3.5 font-data text-[11px] tracking-[0.14em] uppercase hover:bg-foreground hover:text-background transition-colors"
            >
              Mission briefing
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border mt-auto">
        <div className="px-6 sm:px-10 lg:px-14 py-5 flex flex-wrap items-center justify-between gap-3">
          <span className="font-data text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
            ECO//SIM · Teluk Nusa · an open educational model, not real-world advice
          </span>
          <span className="font-data text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
            © 2026 · Sayang bumi kita
          </span>
        </div>
      </footer>
    </div>
  );
}
