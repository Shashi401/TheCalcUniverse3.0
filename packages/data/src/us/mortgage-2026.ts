import { DatedValue } from "../provenance.js";

/** FHFA conforming loan limit, one-unit properties, baseline (2026). */
export const conformingLoanLimitC: DatedValue<number> = {
  value: 80_640_000, // $806,400 in cents — placeholder pending verification against the FHFA bulletin
  sourceUrl: "https://www.fhfa.gov/data/conforming-loan-limit-values",
  sourceDocument: "FHFA Conforming Loan Limit Values 2026 (verify against published bulletin before launch)",
  retrievedAt: "2026-07-07",
  effectiveFrom: "2026-01-01",
  expiresAt: "2027-01-01",
  reviewedBy: "UNREVIEWED — requires second reviewer per data governance rule",
};

/** Typical private mortgage insurance annual rate band used for estimates. */
export const pmiAnnualRate: DatedValue<{ low: number; mid: number; high: number }> = {
  value: { low: 0.0046, mid: 0.0085, high: 0.015 },
  sourceUrl: "https://www.urban.org/",
  sourceDocument: "Urban Institute HFPC PMI pricing range (verify current-year publication before launch)",
  retrievedAt: "2026-07-07",
  effectiveFrom: "2026-01-01",
  expiresAt: "2027-01-01",
  reviewedBy: "UNREVIEWED — requires second reviewer per data governance rule",
};
