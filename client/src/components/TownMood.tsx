/**
 * ECO//SIM — TownMood band (Kampung Coast v2)
 * The one-glance layer: living Teluk Nusa mood portrait FIRST, three
 * traffic-light goals SECOND, expert numbers THIRD. Kid-friendly voice,
 * Baloo/Nunito, warm paper world. Expert mono layer stays hidden elsewhere.
 */
import { Cloud, Leaf, Droplets, Umbrella, HeartPulse, Scale, Briefcase } from "lucide-react";
import { Indicators, KID_GOALS, MISSION_TARGETS } from "@/lib/sim/types";

const HAPPY = "/manus-storage/city-happy_12950284.png";
const WORRIED = "/manus-storage/city-sad_01d243a3.png";

/** Whether one indicator currently meets its mission threshold. */
function goalMet(indicators: Indicators, key: keyof Indicators): boolean {
  const t = MISSION_TARGETS.find((m) => m.key === key);
  if (!t) return true; // publicHealth / economicWellbeing have no target
  return t.direction === "above" ? indicators[key] >= t.threshold : indicators[key] <= t.threshold;
}

/** How many of the 5 mission targets the current indicators meet. */
export function goalsMetCount(indicators: Indicators): number {
  return MISSION_TARGETS.filter((m) => goalMet(indicators, m.key)).length;
}

interface TownMoodProps {
  indicators: Indicators;
  year: number;
  title?: string; // panel label shown above
}

const GOAL_DOT_COLORS = ["bg-teal-signal", "bg-amber-warn", "bg-coral-risk", "bg-purple-fair", "bg-sky-deep"];

export default function TownMood({ indicators, year, title }: TownMoodProps) {
  const met = goalsMetCount(indicators);
  // Baseline Teluk Nusa is a nice town — happy image until truly in trouble.
  const isHappy = met >= 2;
  const isOkay = met >= 1;

  const seaMet = KID_GOALS[0].keys.filter((k) => goalMet(indicators, k)).length >= 2;
  const cityMet = KID_GOALS[1].keys.filter((k) => goalMet(indicators, k)).length >= 2;
  const peopleMet = KID_GOALS[2].keys.filter((k) => goalMet(indicators, k)).length >= 2;

  const sentence = isHappy
    ? "Teluk Nusa is smiling today. Keep going, boss!"
    : isOkay
      ? "Teluk Nusa is a little worried. Some lights are amber."
      : "Teluk Nusa needs help — the red lights mean trouble.";

  return (
    <div className="soft-card overflow-hidden">
      {/* mood portrait band */}
      <div className="relative">
        <img
          src={isHappy ? HAPPY : WORRIED}
          alt={isHappy ? "Teluk Nusa feeling happy" : "Teluk Nusa feeling worried"}
          className="w-full h-44 md:h-52 object-cover object-top"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${isHappy ? "from-emerald-life/30" : "from-coral-risk/30"} to-transparent`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.98_0.01_95)]/85 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-wrap items-end gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[240px]">
            <span
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shadow-md text-xl ${
                isHappy ? "bg-emerald-life/20" : isOkay ? "bg-amber-warn/20" : "bg-coral-risk/20"
              }`}
              aria-hidden="true"
            >
              {isHappy ? "😊" : isOkay ? "😐" : "😟"}
            </span>
            <div>
              <div className="font-display text-lg md:text-xl font-extrabold leading-tight">{sentence}</div>
              <div className="font-data text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">
                Year {year} · {met} of 5 mission targets reached
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* three traffic-light goals */}
      <div className="grid grid-cols-3 divide-x divide-border/60 border-t border-border/60">
        {KID_GOALS.map((g, i) => {
          const metStatus = i === 0 ? seaMet : i === 1 ? cityMet : peopleMet;
          const dot = metStatus ? "bg-emerald-life" : "bg-amber-warn";
          return (
            <div key={g.id} className="py-3 px-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {GOAL_DOT_COLORS.slice(0, 3).map((c, j) => (
                  <span key={j} className={`w-2.5 h-2.5 rounded-full ${j === 0 ? dot : "bg-secondary"}`} aria-hidden="true" />
                ))}
              </div>
              <div className="font-display text-[13px] md:text-sm font-bold leading-tight">{g.title}</div>
              <div className="font-data text-[10px] text-muted-foreground mt-0.5">{g.bm}</div>
              <div className="mt-1.5 flex items-center justify-center gap-1">
                {g.keys.map((k) => {
                  const Icon =
                    k === "climatePressure" ? Cloud :
                    k === "biodiversity" ? Leaf :
                    k === "waterSecurity" ? Droplets :
                    k === "floodResilience" ? Umbrella :
                    k === "publicHealth" ? HeartPulse :
                    k === "economicWellbeing" ? Briefcase : Scale;
                  const met2 = goalMet(indicators, k);
                  return (
                    <span key={k} title={k}>
                      <Icon className={`w-3.5 h-3.5 ${met2 ? "text-emerald-life" : "text-muted-foreground/40"}`} aria-hidden="true" />
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {title && (
        <div className="sr-only">{title}</div>
      )}
    </div>
  );
}
