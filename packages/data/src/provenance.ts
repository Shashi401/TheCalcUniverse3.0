/**
 * Data governance (engineering panel, absorption #5): every dated record
 * carries provenance. CI enforces freshness via the two-stage expiry gate:
 * warn inside `warnDays` of expiry, fail past expiry.
 */

export interface Provenance {
  sourceUrl: string;
  sourceDocument: string;
  retrievedAt: string; // ISO date
  effectiveFrom: string; // ISO date
  expiresAt: string; // ISO date — data must be reviewed before this date
  reviewedBy: string;
}

export interface DatedValue<T> extends Provenance {
  value: T;
}

export type ExpiryStatus = "ok" | "warn" | "expired";

export function expiryStatus(p: Provenance, now = new Date(), warnDays = 60): ExpiryStatus {
  const expires = new Date(p.expiresAt);
  if (now >= expires) return "expired";
  const warnAt = new Date(expires.getTime() - warnDays * 86_400_000);
  return now >= warnAt ? "warn" : "ok";
}
