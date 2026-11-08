p=r"C:\Users\ryant\OneDrive\Desktop\Projects\Eco Sim\Eco-Sim\client\src\pages\Story.tsx"
s=open(p,encoding="utf-8").read()
start=s.index("function Chapters()")
end=s.index("Router")
prefix=s[:start]
suffix=s[end:]
new='''function Chapters() {
  const [page, setPage] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  const c = CHAPTERS[page];
  const isFirst = page === 0;
  const isLast = page === CHAPTERS.length - 1;

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background">
      <PageMeta
        title="ECO//SIM - Five Chapters of Teluk Nusa"
        description="Walk through Teluk Nusa as it is today."
      />
      <SiteHeader backHref="/" />

      <main id="main" tabIndex={-1} className="flex-1 outline-none overflow-hidden">
        <motion.section
          key={c.n}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="h-full grid lg:grid-cols-[1fr_1.15fr] gap-0 min-w-0"
        >
          <div className="px-6 sm:px-10 lg:px-14 py-8 lg:py-10 lg:border-r border-border min-w-0 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-data text-vermilion text-base">{c.n}</span>
                <span className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">Page {page + 1} of {CHAPTERS.length}</span>
              </div>
              <blockquote className="font-display italic text-xl sm:text-2xl leading-snug border-l-2 border-vermilion pl-5 mb-4">
                {c.voice}
              </blockquote>
              <h2 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight mb-3">{c.title}</h2>
              <p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground max-w-xl">{c.lesson}</p>
              <div className="mt-4">
                <span className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">{c.connects}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 mt-6">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={isFirst} className="btn btn-outline disabled:opacity-40">Previous</button>
              <button onClick={() => setPage((p) => Math.min(CHAPTERS.length - 1, p + 1))} disabled={isLast} className="btn btn-primary">{isLast ? "Finish" : "Next"}</button>
            </div>
          </div>
          <figure className="photo-plate overflow-hidden m-6 sm:m-8 lg:m-8 h-full">
            <FadeImg src={c.photo} alt={c.alt} className="h-full w-full object-cover" />
            <figcaption className="plate-caption">
              <span>{c.cap}</span>
              <span>{c.fig}</span>
            </figcaption>
          </figure>
        </motion.section>
      </main>

      <button onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} className="fixed bottom-4 right-4 z-50 btn-press inline-flex items-center p-3 border border-border bg-background/90 backdrop-blur rounded-full shadow-md">
        {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <SiteFooter />
    </div>
  );
}

'''
# ensure imports
if 'import { useState }' not in s:
    s=s.replace('import { Link } from "wouter";','import { Link } from "wouter";\nimport { useState } from "react";\nimport { useTheme } from "@/contexts/ThemeContext";',1)
# add Sun Moon imports? lucide already imports ArrowRight, Undo2. Need Sun, Moon.
s=s.replace('import { ArrowRight, Undo2 } from "lucide-react";','import { ArrowRight, Undo2, Sun, Moon } from "lucide-react";',1)
s=prefix+new+suffix
open(p,"w",encoding="utf-8").write(s)
print("done")
