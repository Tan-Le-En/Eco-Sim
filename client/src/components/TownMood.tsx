/**
 * ECO//SIM — TownMood band (Editorial Field Study v3)
 * Flat editorial register: field label + verdict sentence, three traffic-light
 * goal cells with status ticks, real photography used only at finish.
 */
import { Cloud, Leaf, Droplets, Umbrella, HeartPulse, Scale, Briefcase } from "lucide-react";
import { Indicators, KID_GOALS, MISSION_TARGETS } from "@/lib/sim/types";

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
  title?: string;
}

export default function TownMood({ indicators, year }: TownMoodProps) {
  const met = goalsMetCount(indicators);
  const isHappy = met >= 2;
  const isOkay = met >= 1;

  const verdict = isHappy
    ? { text: "Teluk Nusa is stable today.", tone: "text-foreground" }
    : isOkay
      ? { text: "Teluk Nusa is under pressure — watch the amber registers.", tone: "text-vermilion" }
      : { text: "Teluk Nusa is in trouble. Red registers need action now.", tone: "text-vermilion" };

  const stateDot = isHappy ? "bg-foreground" : isOkay ? "bg-vermilion" : "bg-vermilion";

  return (
    <div className="border border-border bg-card">
      <div className="px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border">
        <div className="flex items-center gap-2.5">
          <span className={`inline-block w-2.5 h-2.5 ${stateDot}`} aria-hidden="true" />
          <span className="font-display italic font-semibold text-lg leading-none">{verdict.text}</span>
        </div>
        <span className="font-data text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
          Year {year} · {met} of 5 mission targets reached
        </span>
      </div>

      {/* three goal cells */}
      <div className="grid grid-cols-3">
        {KID_GOALS.map((g, i) => {
          const keys = g.keys.filter((k) => goalMet(indicators, k)).length;
          const total = g.keys.length;
          return (
            <div key={g.id} className={`px-3 py-2.5 text-center ${i > 0 ? "border-l border-border" : ""}`}>
              <div className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground mb-1">
                {g.title}
              </div>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {[0, 1, 2].map((j) => (
                  <span
                    key={j}
                    className={`w-2.5 h-2.5 border border-border ${j < keys ? (keys >= 2 ? "bg-foreground" : "bg-vermilion") : "bg-transparent"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
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
                      <Icon className={`w-3.5 h-3.5 ${met2 ? "text-foreground" : "text-muted-foreground/35"}`} aria-hidden="true" />
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
