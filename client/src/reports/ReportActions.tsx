import { useMemo, useState } from "react";
import Mustache from "mustache";
import { Download, FileText, Mail, Printer } from "lucide-react";
import { toast } from "sonner";
import type { SimulationResult } from "@/lib/sim/types";
import { buildReportViewModel, computeGoalsMet } from "./buildReportViewModel";
import { getReportTemplate, printReportHtml } from "./printReport";

interface Props {
  result: SimulationResult;
}

export default function ReportActions({ result }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

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

  const emailReport = (kind: "certificate" | "transcript") => {
    if (!email.trim()) {
      toast.error("Enter an email address");
      return;
    }
    const vm = buildReportViewModel(
      result,
      kind === "transcript" && !name.trim() ? "" : name
    );
    const subject = `ECO//SIM · Teluk Nusa 2050 Field Report${vm.recipient_name ? " · " + vm.recipient_name : ""}`;
    const body = [
      `ECO//SIM — Teluk Nusa 2050 Field Report`,
      ``,
      `Participant: ${vm.recipient_name}`,
      `Issued: ${vm.issued_date}`,
      `Run ID: ${vm.report_id}`,
      `Place: ${vm.run_place} (${vm.run_baseline_year}–${vm.run_final_year})`,
      `Score: ${vm.score_display} / ${vm.score_max}`,
      `Verdict: ${vm.verdict}`,
      `Goals: ${vm.goals_met} / ${vm.goals_total}`,
      ``,
      `Worked: ${vm.worked}`,
      `Failed: ${vm.failed}`,
      ``,
      `Simulator: ${vm.simulator_url}`,
      ``,
      `Educational simulation, not a real forecast.`,
    ].join("\n");

    const url = `mailto:${encodeURIComponent(email.trim())}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    toast("Opened your mail app to send the report");
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
        <label className="flex flex-col gap-1 min-w-[220px] flex-1 max-w-sm">
          <span className="font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
            Send report to email
          </span>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-9 px-3 border border-input bg-background text-sm font-data rounded-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Email address to send report to"
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
          onClick={() => emailReport("certificate")}
          disabled={!email.trim() || certDisabled}
          className="btn btn-outline h-9 px-3 text-[11px] disabled:opacity-40"
          title={!email.trim() ? "Enter an email address" : certDisabled ? "Enter a name to email the certificate" : "Email certificate"}
        >
          <Mail className="w-3.5 h-3.5" /> Email certificate
        </button>
        <button
          type="button"
          onClick={() => renderAndPrint("transcript")}
          className="btn btn-outline h-9 px-3 text-[11px]"
          title="Print/download transcript (A4 portrait, 2 pages)"
        >
          <Printer className="w-3.5 h-3.5" /> Download transcript
        </button>
        <button
          type="button"
          onClick={() => emailReport("transcript")}
          disabled={!email.trim()}
          className="btn btn-outline h-9 px-3 text-[11px]"
          title={!email.trim() ? "Enter an email address" : "Email transcript"}
        >
          <Mail className="w-3.5 h-3.5" /> Email transcript
        </button>
      </div>
    </div>
  );
}
