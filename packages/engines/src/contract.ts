/**
 * Engine output contract (engineering panel, absorption #4):
 * engines return {values, trace, flags} — the computation trace (for
 * "show the work") and threshold flags (for verdict sentences) are engine
 * outputs. UI renders; it never re-derives.
 */

export interface TraceStep {
  /** Human-readable step text, e.g. "Monthly rate: 6.8% ÷ 12 =". */
  label: string;
  /** The step's result, preformatted by the caller's formatter or raw. */
  value: string;
}

export interface EngineResult<V, F> {
  values: V;
  trace: TraceStep[];
  flags: F;
}
