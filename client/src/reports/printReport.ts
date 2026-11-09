import certificateTemplate from "./templates/certificate.html?raw";
import transcriptTemplate from "./templates/transcript.html?raw";

export type ReportKind = "certificate" | "transcript";

/**
 * Render a filled report template into a hidden iframe and invoke print().
 * Templates carry @page size and data-certificate; global print CSS keeps
 * [data-certificate] visible while hiding app chrome.
 * Security: callers must render with Mustache double braces only; this
 * function does not use innerHTML with user input.
 */
export async function printReportHtml(html: string): Promise<void> {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) {
    document.body.removeChild(iframe);
    throw new Error("Print frame unavailable");
  }

  doc.open();
  doc.write(html);
  doc.close();

  await new Promise<void>(resolve => {
    if (doc.readyState === "complete") resolve();
    else win.addEventListener("load", () => resolve(), { once: true });
    setTimeout(() => resolve(), 600);
  });

  win.focus();
  win.print();

  setTimeout(() => {
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
  }, 1500);
}

export function getReportTemplate(kind: ReportKind): string {
  return kind === "certificate" ? certificateTemplate : transcriptTemplate;
}
