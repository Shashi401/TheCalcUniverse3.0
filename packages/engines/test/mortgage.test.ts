import { describe, it, expect } from "vitest";
import { mortgage, MortgageInput } from "../src/mortgage.js";
import { roundCents } from "../src/money.js";

const base: MortgageInput = {
  priceC: 0,
  downPct: 0,
  annualRatePct: 0,
  termYears: 30,
  taxYrC: 0,
  insYrC: 0,
  incomeYrC: 0,
};

function loanOnly(loanDollars: number, ratePct: number, years: number) {
  // downPct 0 → loan == price, isolating the P&I math.
  return mortgage({ ...base, priceC: loanDollars * 100, annualRatePct: ratePct, termYears: years });
}

describe("mortgage — golden cases (published examples)", () => {
  // Classic textbook / CFPB-style example: $200,000 at 6% for 30 years = $1,199.10/mo.
  it("$200,000 @ 6% / 30yr → P&I $1,199.10", () => {
    expect(loanOnly(200_000, 6, 30).values.piC).toBe(119_910);
  });

  // Freddie Mac calculator example: $300,000 at 7% for 30 years = $1,995.91/mo.
  it("$300,000 @ 7% / 30yr → P&I $1,995.91", () => {
    expect(loanOnly(300_000, 7, 30).values.piC).toBe(199_591);
  });

  // Site flagship default: $320,000 at 6.8% for 30 years = $2,086.16/mo.
  it("$320,000 @ 6.8% / 30yr → P&I $2,086.16 (flagship default)", () => {
    expect(loanOnly(320_000, 6.8, 30).values.piC).toBe(208_616);
  });

  // 15-year comparison used by Scenario Compare's default.
  it("$320,000 @ 6.8% / 15yr → P&I $2,840.98", () => {
    const r = 0.068 / 12;
    const n = 180;
    const expected = roundCents(32_000_000 * ((r * (1 + r) ** n) / ((1 + r) ** n - 1)), "half-up");
    expect(loanOnly(320_000, 6.8, 15).values.piC).toBe(expected);
  });

  it("zero-rate loan divides principal evenly, reconciled", () => {
    const res = loanOnly(100_000, 0, 10);
    expect(res.values.piC).toBe(roundCents(10_000_000 / 120, "half-up")); // $833.33
    expect(res.values.totalInterestC).toBe(0);
    expect(res.values.yearEndBalancesC.at(-1)).toBe(0);
  });
});

describe("mortgage — reconciliation invariants (money-math contract)", () => {
  it("schedule sums exactly: principal portions === loan, to the cent", () => {
    const res = loanOnly(320_000, 6.8, 30);
    // paid principal = sum(payments) - totalInterest; payments = (n-1)*piC + final
    const paidC = (res.values.paymentsMade - 1) * res.values.piC + res.values.finalPaymentC;
    expect(paidC - res.values.totalInterestC).toBe(res.values.loanC);
    expect(res.values.yearEndBalancesC.at(-1)).toBe(0);
  });

  it("PMI applies under 20% down and not at 20%", () => {
    const under = mortgage({ ...base, priceC: 40_000_000, downPct: 10, annualRatePct: 6.8 });
    const at = mortgage({ ...base, priceC: 40_000_000, downPct: 20, annualRatePct: 6.8 });
    expect(under.flags.pmi).toBe(true);
    expect(under.values.pmiC).toBeGreaterThan(0);
    expect(at.flags.pmi).toBe(false);
    expect(at.values.pmiC).toBe(0);
  });

  it("28/36 bands from income flag", () => {
    // $2,086.16 P&I on $150k income → 16.7% → within
    const ok = mortgage({ ...base, priceC: 32_000_000, annualRatePct: 6.8, incomeYrC: 15_000_000 });
    expect(ok.flags.band).toBe("within");
    // same payment on $60k income → 41.7% → above
    const tight = mortgage({ ...base, priceC: 32_000_000, annualRatePct: 6.8, incomeYrC: 6_000_000 });
    expect(tight.flags.band).toBe("above");
  });
});

describe("mortgage — property tests (seeded sweep)", () => {
  // Deterministic LCG so failures are reproducible.
  let seed = 42;
  const rand = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;

  it("invariants hold across 500 random loans", () => {
    for (let i = 0; i < 500; i++) {
      const input: MortgageInput = {
        ...base,
        priceC: Math.floor(rand() * 2_000_000 + 50_000) * 100,
        downPct: Math.floor(rand() * 51),
        annualRatePct: Math.round(rand() * 1500) / 100, // 0–15%
        termYears: 1 + Math.floor(rand() * 40),
      };
      const res = mortgage(input);
      // balances monotonically non-increasing and never negative
      for (let y = 1; y < res.values.yearEndBalancesC.length; y++) {
        expect(res.values.yearEndBalancesC[y]!).toBeLessThanOrEqual(res.values.yearEndBalancesC[y - 1]!);
        expect(res.values.yearEndBalancesC[y]!).toBeGreaterThanOrEqual(0);
      }
      // schedule reconciles to the cent
      const paidC = (res.values.paymentsMade - 1) * res.values.piC + res.values.finalPaymentC;
      expect(paidC - res.values.totalInterestC).toBe(res.values.loanC);
      // all money outputs are integer cents
      for (const v of [res.values.piC, res.values.totalC, res.values.totalInterestC, res.values.finalPaymentC]) {
        expect(Number.isInteger(v)).toBe(true);
      }
    }
  });
});
