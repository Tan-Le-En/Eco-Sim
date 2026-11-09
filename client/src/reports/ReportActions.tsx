import { useMemo, useState } from "react";
import Mustache from "mustache";
import { Download, FileText, Printer } from "lucide-react";
import { toast } from "sonner";
import type { SimulationResult } from "@/lib/sim/types";
import { buildReportViewModel, computeGoalsMet } from "./buildReportViewModel";
import { getReportTemplate, printReportHtml } from "./printReport";

interface Props {
  result: SimulationResult;
}

export default function ReportActions({ result }: Props) {
  const [name, setName] = useState("");

  const goalsMet = useMemo(() => computeGoalsMet(result), [result]);
  const goals_met = goalsMet.filter(Boolean).length;
  const certDisabled = name.trim().length === 0;

  const renderAndPrint = async (kind: "certificate" | "transcript") => {
    try {
      const vm = buildReportViewModel(
        result,
        kind === "transcript" && !name.trim() ? "" : name
      );
      const html = Mustache.render(getReportTemplate(kind), vm);
      await printReportHtml(html);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not open print dialog"
      );
    }
  };

  return (
    <div className="border border-border bg-card p-4 mt-4" data-no-print="true">
      <div className="flex items-start gap-2 mb-3">
        <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
        <div>
          <div className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
            Certificate & transcript
          </div>
          <p className="text-[12px] text-muted-foreground leading-relaxed mt-1">
            Download printable A4 documents for this run ({goals_met}/3 goals).
            Transcript works without a name; certificate requires a name.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 min-w-[220px] flex-1 max-w-sm">
          <span className="font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
            Player name (for certificate)
          </span>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            className="h-9 px-3 border border-input bg-background text-sm font-data rounded-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Player name for certificate"
          />
        </label>
        <button
          type="button"
          onClick={() => renderAndPrint("certificate")}
          disabled={certDisabled}
          className="btn btn-outline h-9 px-3 text-[11px] disabled:opacity-40"
          title={certDisabled ? "Enter a name to download the certificate" : "Print/download certificate (A4 landscape)"}
        >
          <Download className="w-3.5 h-3.5" /> Download certificate
        </button>
        <button
          type="button"
          onClick={() => renderAndPrint("transcript")}
          className="btn btn-outline h-9 px-3 text-[11px]"
          title="Print/download transcript (A4 portrait, 2 pages)"
        >
          <Printer className="w-3.5 h-3.5" /> Download transcript
        </button>
      </div>
    </div>
  );
}
