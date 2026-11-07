/**
 * ECO//SIM — UTM tracking (v7 production layer)
 * Reads utm_source / utm_medium / utm_campaign from the URL on first load.
 * First-touch semantics: the FIRST attributed visit is recorded and later
 * visits never overwrite it. Fully anonymous, local-only, silent — no
 * network call, no personal data, no console noise.
 */

const KEY = "utm-record";

interface UtmRecord {
  source: string;
  medium: string;
  campaign: string;
  firstSeen: string; // ISO timestamp
}

function readParams(): Partial<UtmRecord> {
  try {
    const params = new URLSearchParams(window.location.search);
    const record: Partial<UtmRecord> = {};
    const src = params.get("utm_source");
    const med = params.get("utm_medium");
    const cmp = params.get("utm_campaign");
    if (src) record.source = src;
    if (med) record.medium = med;
    if (cmp) record.campaign = cmp;
    return record;
  } catch {
    return {};
  }
}

function readStored(): UtmRecord | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UtmRecord> | null;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      source: typeof parsed.source === "string" ? parsed.source : "",
      medium: typeof parsed.medium === "string" ? parsed.medium : "",
      campaign: typeof parsed.campaign === "string" ? parsed.campaign : "",
      firstSeen: typeof parsed.firstSeen === "string" ? parsed.firstSeen : "",
    };
  } catch {
    return null; // corrupted record
  }
}

/**
 * Call once at app boot. Records the first attributed visit; later visits
 * never overwrite the first-touch record. Returns the stored record, or
 * null when unattributed.
 */
export function initUtm(): UtmRecord | null {
  const stored = readStored();
  const incoming = readParams();

  let record = stored;
  if (!record) {
    const attributed = incoming.source || incoming.medium || incoming.campaign;
    if (!attributed) return null;
    record = {
      source: incoming.source ?? "",
      medium: incoming.medium ?? "",
      campaign: incoming.campaign ?? "",
      firstSeen: new Date().toISOString(),
    };
    try {
      localStorage.setItem(KEY, JSON.stringify(record));
    } catch {
      /* best-effort attribution */
    }
  }
  return record;
}
