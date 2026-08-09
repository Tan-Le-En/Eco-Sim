/**
 * ECO//SIM — Kampung Coast hand-drawn wave divider.
 * Warm Malaysian daylight modernism: a soft, slightly organic wave with a
 * little boat token. Used between sections as a brand signature.
 */

export default function WaveDivider({ tone = "sand", flip = false }: { tone?: "sand" | "cream"; flip?: boolean }) {
  const fill = tone === "sand" ? "var(--wave-sand, oklch(0.95 0.02 95))" : "var(--wave-cream, oklch(0.98 0.01 95))";
  return (
    <div className={`w-full overflow-hidden leading-none ${flip ? "rotate-180" : ""}`} aria-hidden>
      <svg viewBox="0 0 1440 70" className="block w-full h-10 md:h-14" preserveAspectRatio="none">
        <path
          d="M0,40 C120,10 260,62 420,44 C560,28 640,58 820,42 C980,28 1120,60 1300,40 C1370,32 1410,24 1440,20 L1440,70 L0,70 Z"
          fill={fill}
          opacity="0.85"
        />
        <path
          d="M0,50 C150,24 300,66 480,50 C620,38 700,62 880,48 C1040,34 1180,64 1360,46 C1400,42 1430,34 1440,30 L1440,70 L0,70 Z"
          fill={fill}
        />
        {/* little boat token */}
        <g transform="translate(1250,30) rotate(-4)">
          <path d="M0,0 L46,0 L38,9 L8,9 Z" fill="var(--teal-signal, oklch(0.55 0.11 195))" />
          <line x1="23" y1="0" x2="23" y2="-16" stroke="var(--teal-signal, oklch(0.55 0.11 195))" strokeWidth="2" strokeLinecap="round" />
          <path d="M23,-15 Q33,-9 23,-3" fill="none" stroke="var(--teal-signal, oklch(0.55 0.11 195))" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
