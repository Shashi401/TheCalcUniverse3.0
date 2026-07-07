import { Cents, roundCents, assertCents } from "./money.js";
import { EngineResult, TraceStep } from "./contract.js";

export interface MortgageInput {
  /** Purchase price in cents. */
  priceC: Cents;
  /** Down payment as a percentage of price, 0–100. */
  downPct: number;
  /** Annual note rate in percent, e.g. 6.8. */
  annualRatePct: number;
  termYears: number;
  /** Annual property tax in cents (0 if unknown). */
  taxYrC: Cents;
  /** Annual homeowners insurance in cents (0 if unknown). */
  insYrC: Cents;
  /** Gross annual household income in cents; 0 = not provided. */
  incomeYrC: Cents;
}

export interface MortgageValues {
  loanC: Cents;
  /** Principal & interest per month. */
  piC: Cents;
  /** Monthly PMI (0 when down payment >= 20%). */
  pmiC: Cents;
  /** Monthly escrow: tax + insurance. */
  escrowC: Cents;
  /** Full monthly payment: P&I + PMI + escrow. */
  totalC: Cents;
  /** Lifetime interest, summed over the actual schedule to the cent. */
  totalInterestC: Cents;
  /** The final payment after reconciliation (may differ from piC by cents). */
  finalPaymentC: Cents;
  /** Remaining balance at each year boundary (index 0 = today), in cents. */
  yearEndBalancesC: Cents[];
  /** Number of monthly payments actually made. */
  paymentsMade: number;
}

export type IncomeBand = "within" | "upper" | "above";

export interface MortgageFlags {
  /** Payment share of gross monthly income, when income provided. */
  incomeShare?: number;
  /** 28/36-rule band, when income provided. */
  band?: IncomeBand;
  pmi: boolean;
}

/** PMI annual rate applied when down payment < 20% (industry-typical mid). */
const PMI_ANNUAL_RATE = 0.0085;

/**
 * Fixed-rate mortgage, US convention: monthly compounding, payment rounded
 * half-up to cents, schedule amortized in integer cents with the final
 * payment absorbing the rounding remainder so that
 * sum(principal portions) === loan, exactly.
 */
export function mortgage(input: MortgageInput): EngineResult<MortgageValues, MortgageFlags> {
  assertCents(input.priceC, "priceC");
  assertCents(input.taxYrC, "taxYrC");
  assertCents(input.insYrC, "insYrC");
  assertCents(input.incomeYrC, "incomeYrC");
  if (input.downPct < 0 || input.downPct > 100) throw new RangeError("downPct out of range");
  if (input.termYears < 1 || input.termYears > 50) throw new RangeError("termYears out of range");
  if (input.annualRatePct < 0 || input.annualRatePct > 50) throw new RangeError("annualRatePct out of range");

  const downC = roundCents((input.priceC * input.downPct) / 100, "half-up");
  const loanC = input.priceC - downC;
  const r = input.annualRatePct / 100 / 12; // continuous intermediate — not money
  const n = input.termYears * 12;

  const factor = r === 0 ? 1 / n : (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const piC = roundCents(loanC * factor, "half-up");

  const pmiC = input.downPct < 20 ? roundCents((loanC * PMI_ANNUAL_RATE) / 12, "half-up") : 0;
  const escrowC = roundCents(input.taxYrC / 12, "half-up") + roundCents(input.insYrC / 12, "half-up");
  const totalC = piC + pmiC + escrowC;

  // Amortize in integer cents; final payment reconciles the remainder.
  let balance = loanC;
  let totalInterestC = 0;
  let finalPaymentC = piC;
  let paymentsMade = 0;
  const yearEndBalancesC: Cents[] = [balance];
  for (let m = 1; m <= n && balance > 0; m++) {
    const interestC = roundCents(balance * r, "half-up");
    let principalC = piC - interestC;
    if (m === n || principalC >= balance) {
      principalC = balance;
      finalPaymentC = principalC + interestC;
    }
    balance -= principalC;
    totalInterestC += interestC;
    paymentsMade = m;
    if (m % 12 === 0) yearEndBalancesC.push(balance);
  }
  if (yearEndBalancesC.length < input.termYears + 1) {
    while (yearEndBalancesC.length < input.termYears + 1) yearEndBalancesC.push(0);
  } else {
    yearEndBalancesC[yearEndBalancesC.length - 1] = balance; // exact tail
  }

  const flags: MortgageFlags = { pmi: pmiC > 0 };
  if (input.incomeYrC > 0) {
    const share = totalC / (input.incomeYrC / 12);
    flags.incomeShare = share;
    flags.band = share <= 0.28 ? "within" : share <= 0.36 ? "upper" : "above";
  }

  const fmt = (c: Cents) => (c / 100).toLocaleString("en-US", { minimumFractionDigits: 2 });
  const trace: TraceStep[] = [
    { label: `Loan amount: price − ${input.downPct}% down`, value: `$${fmt(loanC)}` },
    { label: `Monthly rate: ${input.annualRatePct}% ÷ 12`, value: `${(input.annualRatePct / 12).toFixed(4)}%` },
    { label: `Payments: ${input.termYears} years × 12`, value: `${n}` },
    { label: "P&I: loan × [r(1+r)ⁿ / ((1+r)ⁿ − 1)]", value: `$${fmt(piC)} /mo` },
    {
      label: pmiC > 0 ? `PMI +$${fmt(pmiC)}, escrow +$${fmt(escrowC)} → total` : `Escrow +$${fmt(escrowC)} → total`,
      value: `$${fmt(totalC)} /mo`,
    },
    { label: "Lifetime interest (schedule summed to the cent)", value: `$${fmt(totalInterestC)}` },
  ];

  return {
    values: { loanC, piC, pmiC, escrowC, totalC, totalInterestC, finalPaymentC, yearEndBalancesC, paymentsMade },
    trace,
    flags,
  };
}
