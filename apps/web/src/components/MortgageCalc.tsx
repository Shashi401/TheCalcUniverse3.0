/** Flagship mortgage island. All math comes from @calc/engines — this
 * component renders {values, trace, flags}; it never re-derives (engine
 * output contract). URL prefill is schema-validated, never reflected. */
import { useMemo, useState } from "preact/hooks";
import { mortgage, type MortgageInput } from "@calc/engines";

interface Scenario {
  price: number;
  downPct: number;
  rate: number;
  termYears: number;
  taxYr: number;
  insYr: number;
  incomeYr: number;
}

const DEFAULTS: Scenario = { price: 400000, downPct: 20, rate: 6.8, termYears: 30, taxYr: 4800, insYr: 1800, incomeYr: 0 };

/** Security absorption #2: query params parse through the same bounded
 * schema as the form; invalid values are silently dropped. */
export function prefillFromSearch(search: string): Scenario {
  const q = new URLSearchParams(search);
  const num = (key: string, min: number, max: number, fallback: number) => {
    const raw = q.get(key);
    if (raw === null) return fallback;
    const v = Number(raw);
    return Number.isFinite(v) && v >= min && v <= max ? v : fallback;
  };
  return {
    price: num("p", 0, 100_000_000, DEFAULTS.price),
    downPct: num("d", 0, 100, DEFAULTS.downPct),
    rate: num("r", 0, 50, DEFAULTS.rate),
    termYears: num("y", 1, 50, DEFAULTS.termYears),
    taxYr: num("t", 0, 1_000_000, DEFAULTS.taxYr),
    insYr: num("i", 0, 1_000_000, DEFAULTS.insYr),
    incomeYr: num("inc", 0, 100_000_000, DEFAULTS.incomeYr),
  };
}

function toEngineInput(s: Scenario): MortgageInput {
  return {
    priceC: Math.round(s.price * 100),
    downPct: s.downPct,
    annualRatePct: s.rate,
    termYears: s.termYears,
    taxYrC: Math.round(s.taxYr * 100),
    insYrC: Math.round(s.insYr * 100),
    incomeYrC: Math.round(s.incomeYr * 100),
  };
}

const fmtC = (c: number) => (c / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt$ = (c: number) => "$" + Math.round(c / 100).toLocaleString("en-US");

function Field(props: {
  id: string; label: string; value: number; suf?: string; pre?: string;
  min?: number; max?: number; step?: number; help?: string;
  onInput: (v: number) => void;
}) {
  const [showHelp, setShowHelp] = useState(false);
  return (
    <div class="field">
      <label for={props.id}>
        {props.label}{" "}
        {props.help && (
          <button type="button" class="whats" aria-expanded={showHelp} onClick={() => setShowHelp(!showHelp)}>
            what’s this?
          </button>
        )}
      </label>
      {props.help && showHelp && <div class="help open">{props.help}</div>}
      <div class="inwrap">
        {props.pre && <span class="pre">{props.pre}</span>}
        <input
          id={props.id}
          type="number"
          inputMode="decimal"
          value={props.value}
          min={props.min}
          max={props.max}
          step={props.step}
          onInput={(e) => props.onInput(Number((e.target as HTMLInputElement).value) || 0)}
        />
        {props.suf && <span class="suf">{props.suf}</span>}
      </div>
    </div>
  );
}

function BalanceChart({ a, b }: { a: number[]; b: number[] | null }) {
  const CW = 560, CH = 240, PL = 52, PR = 16, PT = 12, PB = 26;
  const years = Math.max(a.length, b?.length ?? 0) - 1;
  const maxV = Math.max(...a, ...(b ?? [0]), 1);
  const X = (i: number) => PL + ((CW - PL - PR) * i) / years;
  const Y = (v: number) => PT + (CH - PT - PB) * (1 - v / maxV);
  const line = (d: number[]) => d.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
  const area = (d: number[]) => `${line(d)} L${X(d.length - 1).toFixed(1)} ${Y(0)} L${X(0)} ${Y(0)} Z`;
  const ticks = [0, 1, 2, 3, 4].map((t) => (maxV * t) / 4);
  const step = years > 20 ? 10 : 5;
  const xlabels = [];
  for (let yr = 0; yr <= years; yr += step) xlabels.push(yr);
  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} role="img" aria-label="Loan balance over time" style="width:100%;height:auto;display:block">
      {ticks.map((v) => (
        <g>
          <line x1={PL} y1={Y(v)} x2={CW - PR} y2={Y(v)} stroke="var(--line-soft)" stroke-width="1" />
          <text x={PL - 8} y={Y(v) + 4} text-anchor="end" font-size="10.5" fill="var(--ink-3)">
            ${Math.round(v / 100000)}k
          </text>
        </g>
      ))}
      {xlabels.map((yr) => (
        <text x={X(yr)} y={CH - 8} text-anchor="middle" font-size="10.5" fill="var(--ink-3)">
          {yr === 0 ? "now" : `${yr}y`}
        </text>
      ))}
      <path d={area(a)} fill="var(--series-a)" opacity="0.08" />
      <path d={line(a)} fill="none" stroke="var(--series-a)" stroke-width="2" stroke-linejoin="round" />
      <circle cx={X(a.length - 1)} cy={Y(a[a.length - 1] ?? 0)} r="3.5" fill="var(--series-a)" />
      {b && (
        <g>
          <path d={area(b)} fill="var(--series-b)" opacity="0.08" />
          <path d={line(b)} fill="none" stroke="var(--series-b)" stroke-width="2" stroke-linejoin="round" />
          <circle cx={X(b.length - 1)} cy={Y(b[b.length - 1] ?? 0)} r="3.5" fill="var(--series-b)" />
        </g>
      )}
    </svg>
  );
}

export default function MortgageCalc() {
  const [a, setA] = useState<Scenario>(() =>
    typeof location !== "undefined" ? prefillFromSearch(location.search) : DEFAULTS
  );
  const [b, setB] = useState<Scenario | null>(null);
  const [active, setActive] = useState<"A" | "B">("A");
  const [toast, setToast] = useState(false);

  const ra = useMemo(() => mortgage(toEngineInput(a)), [a]);
  const rb = useMemo(() => (b ? mortgage(toEngineInput(b)) : null), [b]);

  const cur = active === "A" ? a : (b as Scenario);
  const setCur = (patch: Partial<Scenario>) =>
    active === "A" ? setA({ ...a, ...patch }) : setB({ ...(b as Scenario), ...patch });

  let verdict;
  if (ra.flags.band) {
    const pct = `${((ra.flags.incomeShare ?? 0) * 100).toFixed(0)}%`;
    verdict =
      ra.flags.band === "within" ? (
        <>At <strong>{pct} of your gross income</strong>, this payment sits inside the 28% housing guideline most lenders use. Room to breathe.</>
      ) : ra.flags.band === "upper" ? (
        <>At <strong>{pct} of your gross income</strong>, this payment is above the 28% housing guideline but inside the 36% total-debt ceiling. Workable, if other debts are light.</>
      ) : (
        <>At <strong>{pct} of your gross income</strong>, this payment exceeds the 36% ceiling most lenders allow. A lower price, larger down payment, or longer term would help.</>
      );
  } else {
    const mult = (ra.values.totalInterestC / ra.values.loanC).toFixed(1);
    verdict = (
      <>Over {a.termYears} years you’ll pay <strong>${fmtC(ra.values.totalInterestC)} in interest</strong> — {mult}× for every dollar borrowed. Extra payments cut this fastest in the first decade.</>
    );
  }

  const copyLink = () => {
    const q = `?p=${a.price}&d=${a.downPct}&r=${a.rate}&y=${a.termYears}`;
    const url = `${location.origin}${location.pathname}${q}`;
    navigator.clipboard?.writeText(url).finally(() => {
      setToast(true);
      setTimeout(() => setToast(false), 1800);
    });
  };

  return (
    <div class={`calc${b ? " compare-on" : ""}`}>
      <section class="panel inputs" aria-label="Calculator inputs">
        <h2>Your numbers</h2>
        {b && (
          <div class="scenario-tabs" role="tablist" aria-label="Scenario">
            <button role="tab" aria-selected={active === "A"} onClick={() => setActive("A")}>
              <span class="dot" style="background:var(--series-a)"></span>Scenario A
            </button>
            <button role="tab" aria-selected={active === "B"} onClick={() => setActive("B")}>
              <span class="dot" style="background:var(--series-b)"></span>Scenario B
            </button>
          </div>
        )}
        <Field id="price" label="Home price" pre="$" value={cur.price} min={0} step={1000}
          help="The full purchase price of the home — before your down payment. U.S. median in 2026 is about $420,000."
          onInput={(v) => setCur({ price: v })} />
        <div class="row2">
          <Field id="down" label="Down payment" suf="%" value={cur.downPct} min={0} max={100} step={1}
            help="Cash you pay upfront. Below 20%, lenders add PMI — usually 0.5–1% of the loan per year. We add it automatically."
            onInput={(v) => setCur({ downPct: Math.min(100, Math.max(0, v)) })} />
          <Field id="term" label="Loan term" suf="yrs" value={cur.termYears} min={1} max={50} step={1}
            onInput={(v) => setCur({ termYears: Math.max(1, Math.min(50, v || 30)) })} />
        </div>
        <Field id="rate" label="Interest rate" suf="% / yr" value={cur.rate} min={0} max={50} step={0.05}
          help="The yearly note rate on your loan. The average 30-year fixed rate in mid-2026 is around 6.8%."
          onInput={(v) => setCur({ rate: Math.min(50, Math.max(0, v)) })} />
        <details class="more">
          <summary>Add detail — taxes, insurance, income</summary>
          <div class="row2">
            <Field id="tax" label="Property tax" pre="$" suf="/yr" value={cur.taxYr} min={0} step={100} onInput={(v) => setCur({ taxYr: v })} />
            <Field id="ins" label="Home insurance" pre="$" suf="/yr" value={cur.insYr} min={0} step={100} onInput={(v) => setCur({ insYr: v })} />
          </div>
          <Field id="income" label="Household income (optional)" pre="$" suf="/yr" value={cur.incomeYr} min={0} step={1000} onInput={(v) => setCur({ incomeYr: v })} />
        </details>
        <button
          type="button"
          class="compare-cta"
          onClick={() => {
            if (b) { setB(null); setActive("A"); }
            else { setB({ ...a, termYears: 15 }); setActive("B"); }
          }}
        >
          {b ? "✕ Remove comparison" : "⇄ Compare a second scenario"}
        </button>
      </section>

      <section class="panel results" aria-label="Results">
        <h2>Monthly payment</h2>
        <div class="hero-row" aria-live="polite">
          <div class="hero hero-a"><span>${fmtC(ra.values.totalC)}</span><span class="per"> /mo</span></div>
          {rb && <div class="hero hero-b"><span>${fmtC(rb.values.totalC)}</span><span class="per"> /mo</span></div>}
        </div>
        <p class="breakdown">
          P&I ${fmtC(ra.values.piC)}
          {ra.values.pmiC > 0 && <><i>·</i>PMI ${fmtC(ra.values.pmiC)}</>}
          {ra.values.escrowC > 0 && <><i>·</i>Tax & insurance ${fmtC(ra.values.escrowC)}</>}
        </p>
        <p class="verdict">
          {verdict}{" "}
          {ra.flags.pmi && <span style="color:var(--warn)">Includes PMI — vanishes at 20% equity.</span>}
        </p>
        {rb && b && (
          <div class="delta">
            <b>B vs A:</b> pays <b>{rb.values.totalC >= ra.values.totalC ? "+" : "−"}${fmtC(Math.abs(rb.values.totalC - ra.values.totalC))}/mo</b>,{" "}
            {rb.values.totalInterestC < ra.values.totalInterestC
              ? <>saves <b>${fmtC(ra.values.totalInterestC - rb.values.totalInterestC)}</b> in lifetime interest</>
              : <>adds <b>${fmtC(rb.values.totalInterestC - ra.values.totalInterestC)}</b> lifetime interest</>}
            {b.termYears !== a.termYears && (
              <>, and is paid off <b>{Math.abs(b.termYears - a.termYears)} years {b.termYears < a.termYears ? "sooner" : "later"}</b></>
            )}.
          </div>
        )}
        <div class="metrics">
          <div class="metric"><div class="k">Loan amount</div><div class="v">{fmt$(ra.values.loanC)}</div></div>
          <div class="metric"><div class="k">Total interest</div><div class="v">{fmt$(ra.values.totalInterestC)}</div></div>
          <div class="metric"><div class="k">Payments</div><div class="v">{ra.values.paymentsMade}</div></div>
        </div>
        <div class="chartbox">
          <h3>Loan balance over time</h3>
          {rb && (
            <div class="legend">
              <span class="la"><i></i>Scenario A</span>
              <span class="lb" style="display:inline-flex"><i></i>Scenario B</span>
            </div>
          )}
          <BalanceChart a={ra.values.yearEndBalancesC} b={rb ? rb.values.yearEndBalancesC : null} />
        </div>
        <div class="actions">
          <button type="button" class="primary" onClick={copyLink}>Copy link with my numbers</button>
          <button type="button" onClick={() => window.print()}>Print</button>
        </div>
        <p class="privacy-note">🛡 Your numbers never leave your device — all math runs in your browser.</p>
        {toast && <div class="toast show" role="status">Link copied</div>}
      </section>

      <div class="worklist-host">
        <h2 class="work-h" id="work">Show the work — with your numbers</h2>
        <ol class="worklist">
          {ra.trace.map((s) => (
            <li>{s.label} → <b>{s.value}</b></li>
          ))}
        </ol>
      </div>
    </div>
  );
}
