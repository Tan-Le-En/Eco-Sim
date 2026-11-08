/**
 * ECO//SIM — Scroll progress bar (Editorial Field Study v3)
 * A 2px vermilion rule across the top of the viewport, driven by RAF —
 * flat editorial discipline, no glow. Honors prefers-reduced-motion,
 * including live changes to that setting.
 */
import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      rafRef.current = null;
      const bar = barRef.current;
      if (!bar) return;
      if (reducedQuery.matches) {
        // No motion: the bar stays parked instead of tracking the scroll.
        bar.style.setProperty("--scroll-progress", "0%");
        return;
      }
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      bar.style.setProperty("--scroll-progress", `${progress}%`);
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(update);
    };
    const onMediaChange = () => update();

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reducedQuery.addEventListener("change", onMediaChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reducedQuery.removeEventListener("change", onMediaChange);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="scroll-progress"
      aria-hidden="true"
      data-no-print="true"
    />
  );
}
