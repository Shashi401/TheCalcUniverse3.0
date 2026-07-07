/**
 * Money-math contract (engineering panel, absorption #1):
 * - All currency arithmetic in integer minor units (cents). Floats are
 *   permitted only for genuinely continuous intermediates (rate factors),
 *   and every currency result passes through an explicit rounding call.
 * - Rounding is a named, explicit choice at each call site — never a default.
 */

/** Integer number of cents. The only representation of money in any engine. */
export type Cents = number;

export type RoundingMode = "half-up" | "half-even" | "down";

/** Round a fractional cent amount to integer cents with an explicit mode. */
export function roundCents(value: number, mode: RoundingMode): Cents {
  switch (mode) {
    case "half-up":
      // Symmetric half-up (0.5 away from zero), the US consumer-lending norm.
      return Math.sign(value) * Math.round(Math.abs(value));
    case "half-even": {
      const floor = Math.floor(value);
      const diff = value - floor;
      if (diff > 0.5) return floor + 1;
      if (diff < 0.5) return floor;
      return floor % 2 === 0 ? floor : floor + 1;
    }
    case "down":
      return Math.trunc(value);
  }
}

export function dollarsToCents(dollars: number): Cents {
  return roundCents(dollars * 100, "half-up");
}

export function assertCents(value: number, label: string): asserts value is Cents {
  if (!Number.isInteger(value)) {
    throw new TypeError(`${label} must be integer cents, got ${value}`);
  }
}
