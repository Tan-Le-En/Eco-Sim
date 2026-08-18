/**
 * ECO//SIM — UTM tracking (v7 production layer)
 * Reads utm_source / utm_medium / utm_campaign from the URL on first load,
 * persists once to localStorage for attribution, and logs a one-line record.
 * Fully anonymous — no network call, no personal data.
 */

const KEY = "utm-record";

interface UtmRecord {
  source: string;
  medium: string;
  campaign: string;
  firstSeen: string; // ISO timestamp
}

function readParams(): Partial<UtmRecord> {
  const params = new URLSearchParams(window.location.search);
  const record: Partial<UtmRecord> = {};
  const src = params.get("utm_source");
  const med = params.get("utm_medium");
  const cmp = params.get("utm_campaign");
  if (src) record.source = src;
  if (med) record.medium = med;
  if (cmp) record.campaign = cmp;
  return record;
}

/**
 * Call once at app boot. Returns the stored record, or null if none.
 */
export function initUtm(): UtmRecord | null {
  const stored = localStorage.getItem(KEY);
  const incoming = readParams();

  // Merge: keep existing record, fill in anything newly present.
  const base: UtmRecord = stored
    ? (JSON.parse(stored) as UtmRecord)
    : { source: "", medium: "", campaign: "", firstSeen: "" };

  if (incoming.source) base.source = incoming.source;
  if (incoming.medium) base.medium = incoming.medium;
  if (incoming.campaign) base.campaign = incoming.campaign;
  if (!base.firstSeen) base.firstSeen = new Date().toISOString();

  if (base.source || base.medium || base.campaign) {
    localStorage.setItem(KEY, JSON.stringify(base));
    console.info(
      `[ECO//SIM] visit attributed · source=${base.source} medium=${base.medium} campaign=${base.campaign}`
    );
    return base;
  }
  return null;
}

/** Read-only access for components that want to display attribution. */
export function getUtm(): UtmRecord | null {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as UtmRecord) : null;
}
