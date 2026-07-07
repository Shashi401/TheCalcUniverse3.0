# Build-Readiness Review — Joint Panel Session
### All four panels together: executive, user, engineering, and design. One question on the table: **are we ready to build?**

*Each panel re-examined the full package — blueprint (with all absorptions), design spec, and the working flagship mockup — against its own original objections. Format: verification, residual concerns, vote.*

---

## 1. Executive panel — strategy check

**Verified:** all six conditions from the executive red team are committed scope in the blueprint (§10): Scenario Compare (working in the mockup), API/MCP pillar, Winnable-Value gate, two-stage data gate, reviewer-category matching, client-side privacy pillar with owned-audience loops. Decisions locked: repo (done — `TheCalcUniverse3.0`), flagship (mortgage), reviewer plan (EE → math/electrical; CPA/CFA before finance scales), monetization ladder.

**Residual concerns:** none blocking. One watch-item: the 6–9-month traffic expectation must survive contact with impatience — the Winnable-Value gate only works if it's obeyed when weeks 4–8 show zeros.

**Vote: GO.**

## 2. User panel — value-proposition check

**Verified against the mockup, pillar by pillar:**

| Pillar | Evidence in the mockup |
|---|---|
| Instant | Pre-filled answer on load, no submit button, answer-first on mobile |
| Understandable | Verdict sentence, "what's this?" with typical values, show-the-work steps, breakdown under the hero |
| Verifiable | Byline + reviewer + dated changelog; formula matches engine to the cent; "check our math" link slot |
| Respectful | No popups/interstitials by construction, ≤300KB (zero webfonts), WCAG structure, night mode |
| Everywhere | Copy-link-with-my-numbers, embed (inline, not popup), print, table view of the chart |

**Residual concerns:** "R. Sharma, CPA" is a placeholder — shipping a *fictional* reviewer name to production would be exactly the fraud the critic persona described. Must be a real person (or the byline drops to "CalcUniverse Editorial" + sources) before launch.

**Vote: GO** — with the placeholder rule made explicit: *no fictional credentials ever reach production.*

## 3. Engineering panel — technical check

**Verified:** the mockup already demonstrates the engine contract in miniature — integer-cent math, half-up rounding, final-payment reconciliation, `{values, trace, flags}` output driving both the verdict and show-the-work, one compute path. The design process itself caught a prose/engine divergence ($2,086.59 vs $2,086.16), proving the hydration-consistency rule earns its CI slot.

**Residual concerns — build-order conditions, not blockers:**
1. **Engines before pages.** `@calc/engines` with the money-math contract and golden tests is Sprint 1, before any UI. A pretty page over unproven math is the failure mode.
2. CI matrix (typecheck → unit/golden/property → axe → Lighthouse → bundle gate) lands with the scaffold, not "later."
3. The mockup is a *reference*, not production code — the Astro build reimplements it as components; no copy-paste of the single-file prototype.

**Vote: GO**, conditional on that build order.

## 4. Design panel — design check

**Verified:** CEO-approved v1 (ledger green + copper, serif display, tabular figures, both themes, validated chart palettes). Template contract fully demonstrated; screenshots verified at desktop/mobile, light/dark/compare.

**Residual concerns:** the design was approved by simulated executives — the *owner's* eye is the one that matters and is still pending. Wordmark and final brand name rendering ("TheCalcUniverse") assumed, not confirmed.

**Vote: GO**, pending owner sign-off on the visual direction.

---

## Joint verdict

> **GO — unanimous, four panels.** The plan has survived a business red team, a user red team, an engineering red team, and a design review; 25 improvements were absorbed and 11 items consciously deferred with reasons on record. Remaining risk is concentrated where it should be: in execution discipline (build order, the Winnable-Value gate, no fictional credentials), not in unknowns.

## Owner confirmations required before Sprint 0

The panels can recommend; only the owner can commit. Four confirmations:

1. **Design direction** — approve the "financial instrument" identity (serif display, ledger green + copper) as seen in the mockup, or request an iteration round.
2. **Domain** — production target (thecalcuniverse.com assumed). DNS + hosting account (Vercel assumed) are owner-held resources.
3. **Engines license** — the open-source-the-math absorption needs a license: MIT (maximum reach/citations) or Apache-2.0 (patent clause). Panel recommendation: **MIT**.
4. **Final GO** — authorize Sprint 0.

## Owner decisions (recorded July 2026)

1. **GO confirmed** — build authorized.
2. **Design approved as-is** — mockup v1 is the production reference.
3. **Engines private for now** — the open-source absorption (user panel #8) is deferred by owner decision; the public methodology page carries the verification story. Revisitable at any time.
4. **Domain `thecalcuniverse.com`; host TBD** (not Vercel) — build targets host-agnostic static output; deploy wiring waits on the host choice.

## The build plan (first three sprints, upon GO)

| Sprint | Deliverable |
|---|---|
| **0 — Scaffold** | Monorepo (pnpm + Astro app + `packages/engines` + `packages/data`), CI matrix live, deploy pipeline to preview + production, `/promises` and `/methodology` page shells |
| **1 — Engines** | Mortgage engine to the money-math contract: golden tests vs. CFPB/Freddie Mac examples, property tests, trace/flags output; data modules with provenance fields; open-source license applied |
| **2 — Flagship** | The template as Astro components + Preact island (per design spec), mortgage page end-to-end: schema, sitemap, share URLs, embed, FAQ, WCAG checks passing, deployed |

Then: mortgage cluster spokes (refinance, affordability, extra payments, Canadian), electrical cluster kickoff under the EE reviewer, and the embed-first launch checklist.
