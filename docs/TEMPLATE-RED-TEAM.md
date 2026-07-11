# Template Red Team — Design Selection Review

### All panels reconvened (executive, user, engineering, design) over the six candidates: directions A/B/C (Ledger, Instrument, Blueprint) and templates 1/2/3 (Aurum, Bold Minimal, Glass). One question: **which single design wins the market, and what must be fixed before it ships?**

---

## 1. The scoring pass

Criteria drawn from the blueprint's product laws and the competitive teardown: differentiation vs the three incumbents, trust register, time-to-answer feel, performance on low-end mobile (where calculator search traffic actually lives), print/share quality, scalability across 10,000 pages, and aging risk.

| Candidate | Differentiation | Trust register | Performance | Scales to 10k pages | Aging risk | Verdict |
|---|---|---|---|---|---|---|
| A · Ledger | Medium — quiet, bank-like | Excellent | Excellent | Yes | Low | Runner-up |
| B · Instrument | High — nothing like it in market | Wrong audience: reads "trading terminal," intimidates the tip-splitter | Good | Awkward for health/everyday | Medium | Rejected |
| C · Blueprint | High — charming | Good | Good (grid bg cheap) | The drafting metaphor strains outside math/engineering | Medium | Rejected |
| T1 · Aurum | Medium-high | "Private banking" — but **dark-only** | Good | Yes | Medium (gold+dark trends) | Rejected |
| T2 · Bold Minimal | High — confidence as brand | Excellent — restraint reads as honesty | **Best of six** (no blur, no texture, hairlines only) | **Best of six** — the system is typography + one accent | **Lowest** — bold type + whitespace doesn't date | **Winner** |
| T3 · Glass | Medium (glass is everywhere in SaaS) | Good | **Worst of six** — backdrop-filter jank on low-end Android | Yes | **Highest** — trend-bound | Rejected |

## 2. Panel objections that decided it

**Executive:** the brand promise is *"the answer, before you ask"* — the design that IS that sentence wins. T2's oversized answer-first typography makes the strategy visible. Dark-only (T1/B) caps the mainstream audience; glass (T3) borrows a look every SaaS has, so it can't be a moat.

**User:** calculator traffic is someone on a phone in a store, a kitchen, a bank meeting. They need the number readable in sunlight, printable for a spouse, screenshot-able for a group chat. T2 wins all three; dark-only fails print and sunlight; glass fails screenshot legibility on busy gradients.

**Engineering:** T2 is the only candidate whose entire design system is expressible as ~12 tokens + one embedded variable font (~48KB subsettable to ~20KB). No backdrop-filter, no gradients to band on cheap panels, trivially themeable. Ships inside the 300KB Dave-contract budget with the most room to spare.

**Design:** T2's risk is the opposite one — **"Inter + whitespace" is the default look of a thousand AI-generated pages.** Winning requires signature moves that only make sense for a calculator brand, not more decoration.

## 3. Winner: Template 2 · Bold Minimal — with 8 mandatory absorptions

1. **Own the digits (design).** The numerals ARE the brand: hero renders with the cents in accent orange (`$2,636`<span style="color:#EA580C">`.16`</span>) everywhere a money value is the hero — a signature no incumbent can copy without looking like us. Tabular figures universally.
2. **Dark mode as a toggle, not a brand (exec + user).** Absorb T1's night register as a *designed* dark theme (warm near-black, brightened orange) behind the header toggle; OS preference respected, user choice wins.
3. **Editable comparison (user).** Scenario tabs must actually switch input binding — comparing is the signature feature; a dead second tab is a broken promise. Scenarios keep their names ("My offer" / "15-year plan").
4. **Answer follows you (user).** On mobile, a slim fixed bar keeps the live payment visible once the results panel scrolls away — the answer is never off-screen on the answer machine.
5. **Chart data as table (engineering).** "View as table" disclosure under the chart — accessibility is crawlability (blueprint §6), and it ships in the winner from day one.
6. **Change must be felt (design).** A subtle value-pulse when the hero recomputes — 300ms background fade, disabled under `prefers-reduced-motion`. No count-up gimmicks.
7. **Warmth guard (user).** Stark ≠ cold: warm off-white paper, sentence-case microcopy, the "what's this?" explainers and estimate-grade cue stay prominent. Restraint in chrome, generosity in explanation.
8. **Orange discipline (design).** One accent, spent only on: the cents, the primary action, the estimate/summary moments. Never on decoration; semantic green/amber stay reserved for status.

**Runner-up preserved:** Direction A (Ledger) remains on file as the fallback register if user testing finds Bold Minimal too stark for the finance cluster.

## 4. Beat-the-competitor checklist (must be visible on every calculator page)

| Incumbent weakness | Our visible counter |
|---|---|
| Calculator.net: blank forms + submit button, 2005 chrome | Pre-filled live answer on load, no submit anywhere, oversized type |
| OmniCalculator: content-first, widget buried, signup nags | Answer is the largest object on the page; zero gates, zero nags |
| CalculatorSoup: ad-choked, slow | No ads between input and answer ever; sub-3s time-to-first-answer |
| All three: black-box totals | Breakdown line + estimate-grade cue + show-the-work with the user's numbers |
| All three: single-scenario | Editable A/B compare with loss-framed delta |
| All three: server-side / tracked | "Your numbers never leave your device" under every result |

**Verdict: unanimous — build Bold Minimal v2 with the eight absorptions.** The mockup `design/mockups/final-bold-minimal.html` is the reference implementation; the Astro build follows it.
