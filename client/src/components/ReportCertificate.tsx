/**
 * ECO//SIM — Certificate & transcript for a completed 2050 run.
 * Rendered in Results; printable via window.print() with print CSS keeping
 * [data-certificate] visible.
 */
import { useState } from "react";
import { Printer, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  INDICATOR_KEYS,
  INDICATOR_META,
  KID_GOALS,
  KID_INDICATORS,
  MISSION_TARGETS,
  type SimulationResult,
} from "@/lib/sim/types";

interface Props {
  result: SimulationResult;
  verdict: string;
  goalsMet: boolean[];
}

export default function ReportCertificate({ result, verdict, goalsMet }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [issued, setIssued] = useState<string | null>(null);

  const final = result.years[result.years.length - 1]!.indicators;
  const base = result.baselineYear.indicators;
  const pop = result.years[result.years.length - 1]!.population;

  const handleIssue = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setIssued(trimmed);
    setOpen(false);
  };

  const dateLabel = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-press inline-flex items-center gap-1.5 font-data text-[11px] tracking-[0.14em] uppercase px-4 py-2 border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
      >
        <FileText className="w-3.5 h-3.5" /> Certificate & transcript
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-popover rounded-none border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              Certificate & transcript
            </DialogTitle>
            <DialogDescription className="text-sm">
              Enter a name for the certificate. The transcript summarizes this
              run (2050 outcome, indicators, and model account). This is an
              educational record, not a real credential.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              onKeyDown={e => e.key === "Enter" && handleIssue()}
              className="font-data rounded-none"
              aria-label="Name for certificate"
            />
            <button
              type="button"
              onClick={handleIssue}
              disabled={!name.trim()}
              className="btn btn-primary shrink-0 disabled:opacity-40"
            >
              Issue
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {issued && (
        <section
          data-certificate="true"
          className="border border-border bg-card mt-6 print:mt-0 print:border-2"
          aria-label="Certificate and transcript"
        >
          <div className="p-6 sm:p-8 border-b border-border print:border-b-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="font-data text-[10px] tracking-[0.18em] uppercase text-vermilion mb-2">
                  ECO//SIM · Field Study Certificate
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
                  {issued}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-xl leading-relaxed">
                  Completed a 25-year governance simulation of Teluk Nusa (2026–
                  2050), a fictional Malaysian coastal town, using an open
                  educational model. Results reflect the chosen policy mix, not a
                  real-world forecast.
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                data-no-print="true"
                className="btn btn-outline shrink-0"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border/60 pt-4">
              <div>
                <div className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                  Score
                </div>
                <div className="font-data text-2xl tabular-nums">
                  {result.score.toFixed(0)} / 100
                </div>
              </div>
              <div>
                <div className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                  Verdict
                </div>
                <div className="text-sm font-medium">{verdict}</div>
              </div>
              <div>
                <div className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                  Goals reached
                </div>
                <div className="font-data text-xl tabular-nums">
                  {goalsMet.filter(Boolean).length} / {KID_GOALS.length}
                </div>
              </div>
              <div>
                <div className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                  Issued
                </div>
                <div className="text-sm">{dateLabel}</div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-3">
              Transcript · Indicator outcomes (2026 baseline → 2050)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="font-data text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border text-left">
                    <th className="py-2 pr-3 font-medium">Indicator</th>
                    <th className="py-2 px-2 font-medium text-right">2026</th>
                    <th className="py-2 px-2 font-medium text-right">2050</th>
                    <th className="py-2 px-2 font-medium text-right">Change</th>
                    <th className="py-2 pl-2 font-medium">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {INDICATOR_KEYS.map(k => {
                    const meta = INDICATOR_META[k];
                    const delta = Number((final[k] - base[k]).toFixed(1));
                    const good = meta.higherIsBetter ? delta >= 0 : delta <= 0;
                    const t = MISSION_TARGETS.find(x => x.key === k);
                    const met =
                      t &&
                      (t.direction === "above"
                        ? final[k] >= t.threshold
                        : final[k] <= t.threshold);
                    return (
                      <tr key={k} className="border-b border-border/40">
                        <td className="py-2 pr-3">
                          <span className="font-medium">
                            {KID_INDICATORS[k].kidName}
                          </span>
                          <span className="block text-[11px] text-muted-foreground">
                            {meta.label}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right tabular-nums text-muted-foreground">
                          {base[k].toFixed(0)}
                        </td>
                        <td className="py-2 px-2 text-right tabular-nums font-medium">
                          {final[k].toFixed(0)}
                        </td>
                        <td
                          className={`py-2 px-2 text-right tabular-nums ${good ? "text-ok" : "text-vermilion"}`}
                        >
                          {delta === 0 ? "—" : delta > 0 ? "+" : ""}
                          {delta.toFixed(1)}
                        </td>
                        <td className="py-2 pl-2 text-[11px] text-muted-foreground">
                          {t
                            ? `${t.direction === "above" ? "≥" : "≤"} ${t.threshold} ${met ? "· met" : "· not met"}`
                            : "weights score"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-4 text-[13px] leading-relaxed">
              <div className="border-l-2 border-ok pl-3">
                <div className="font-data text-[10px] uppercase tracking-wider text-ok font-bold mb-1">
                  Worked
                </div>
                {result.biggestSuccess}
              </div>
              <div className="border-l-2 border-vermilion pl-3">
                <div className="font-data text-[10px] uppercase tracking-wider text-vermilion font-bold mb-1">
                  Failed
                </div>
                {result.biggestFailure}
              </div>
            </div>

            <p className="mt-5 font-data text-[10px] tracking-[0.06em] text-muted-foreground leading-relaxed border-t border-border/60 pt-4">
              Population 2050: {pop.toLocaleString()} · Budget remaining:{" "}
              {result.years[result.years.length - 1]!.budgetRemaining.toFixed(0)}{" "}
              pts · Educational simulation only (Teluk Nusa is fictional).
            </p>
          </div>
        </section>
      )}
    </>
  );
}
