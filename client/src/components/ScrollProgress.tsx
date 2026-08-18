/**
 * ECO//SIM — Scroll progress bar (Editorial Field Study v3)
 * A 2px vermilion rule across the top of the viewport, driven by RAF —
 * flat editorial discipline, no glow. Honors prefers-reduced-motion.
 */
import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      if (barRef.current) {
        barRef.current.style.setProperty("--scroll-progress", `${progress}%`);
        barRef.current.style.width = `${progress}%`;
      }
      rafRef.current = null;
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" data-no-print="true" />;
}
