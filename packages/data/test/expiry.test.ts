import { describe, it, expect } from "vitest";
import { expiryStatus } from "../src/provenance.js";
import { conformingLoanLimitC, pmiAnnualRate } from "../src/us/mortgage-2026.js";

describe("two-stage expiry gate", () => {
  const rec = { ...conformingLoanLimitC };

  it("ok well before expiry", () => {
    expect(expiryStatus(rec, new Date("2026-06-01"))).toBe("ok");
  });
  it("warns inside the 60-day window", () => {
    expect(expiryStatus(rec, new Date("2026-12-15"))).toBe("warn");
  });
  it("expired past the effective end", () => {
    expect(expiryStatus(rec, new Date("2027-01-02"))).toBe("expired");
  });
});

describe("CI freshness gate — all shipped data must not be expired *now*", () => {
  for (const [name, rec] of Object.entries({ conformingLoanLimitC, pmiAnnualRate })) {
    it(`${name} is not expired`, () => {
      expect(expiryStatus(rec)).not.toBe("expired");
    });
  }
});
