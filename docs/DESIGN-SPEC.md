# Design Specification — TheCalcUniverse UI/UX
### Produced by the design panel (design engineers + design architects), reviewed and approved by the CEO panel. The living mockup is `design/mockups/flagship-mortgage.html`.

*This spec turns the three red-team reviews into pixels. Every rule below traces to a panel absorption — nothing here is taste alone.*

---

## 1. Design position

The incumbents split the market's visual language: Calculator.net looks like 2005, Omni looks like a content site with a widget in it, CalculatorSoup looks like an ad network. The design position that beats all three:

> **A financial instrument, not a web page.** Calm, exact, and quiet — the visual language of a well-set ledger and a good bank statement, executed with modern typography. The number is the interface; everything else recedes.

Three design laws (from the product laws):
1. **The answer is the hero.** The largest object on every page is the result. Inputs serve it; content supports it; chrome disappears behind it.
2. **Exactness is visible.** Tabular figures everywhere, cent-accurate values, breakdowns under every total, steps on demand. The design *looks* like it can't be wrong.
3. **Quiet earns trust.** One accent color, generous whitespace, no decoration that doesn't inform. Restraint is the brand — and (per the user panel) the thing incumbents structurally can't copy.

---

## 2. Design tokens

### Color — "Ledger green"
A green-black ink and paper world with one deep green accent (money heritage without fintech-navy cliché) and copper as the *comparison* counterpart — Scenario B, deltas, second series. Chart palettes are **validator-passed** (dataviz six-checks: lightness band, chroma floor, CVD separation, surface contrast) in both modes.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--paper` | `#F7F8F7` | `#101715` | page ground (green-biased neutral — chosen, not defaulted) |
| `--card` | `#FFFFFF` | `#18211D` | panels |
| `--ink` / `--ink-2` / `--ink-3` | `#16211C` / `#4A5A52` / `#7A877F` | `#E8EDEA` / `#A9B6AF` / `#76837C` | text hierarchy |
| `--accent` | `#1F6D53` | `#3E9E78` | the one accent: links, primary actions, focus |
| `--series-a` | `#0E8A5C` | `#2E9A72` | chart series A (validated) |
| `--series-b` | `#A66327` | `#BC7638` | chart series B / comparison (validated) |
| `--good` / `--warn` / `--bad` | semantic set | semantic set | status only — never decoration, never series colors |

Theme mechanics: tokens on `:root`, redefined under `@media (prefers-color-scheme: dark)`, and re-overridden under `:root[data-theme="light"]` / `:root[data-theme="dark"]` so a user toggle beats the OS in both directions. **Dark is designed, not inverted** — its own validated chart steps against the dark surface.

### Type
| Role | Stack | Why |
|---|---|---|
| Display (H1/H2, hero number) | `Charter, 'Bitstream Charter', 'Sitka Text', Cambria, Georgia, serif` | editorial authority — the trust register of a financial publication |
| UI & body | `system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, sans-serif` | native, instant, zero bytes |
| Figures | UI stack + `font-variant-numeric: tabular-nums` | every money value aligns; exactness made visible |
| Code/formula | `ui-monospace, Menlo, Consolas` | formulas read as math |

**Zero webfonts is a design decision, not a compromise** — it is the Dave-contract page-weight budget and the sub-3s time-to-first-answer, expressed typographically. Scale: 34/24/17/16/14/13/12 with the 46px hero number above all.

### Space & shape
1080px max content width; calculator grid `minmax(330px,5fr) : 7fr`; article column 70ch. Radius 10px panels / 8px controls. One shadow level. All sibling spacing via flex/grid `gap`.

---

## 3. The flagship template (what the mockup demonstrates)

Implemented and screenshot-verified in light, dark, and 390px mobile:

1. **Answer above the fold, pre-filled** — $2,636.16/mo computes on load from sensible 2026 defaults; no submit button exists.
2. **Breakdown under the hero** (CEO-round addition): "P&I $2,086.16 · Tax & insurance $550.00" — the total has anatomy; no black boxes.
3. **Verdict sentence** — engine `flags` drive one human sentence ("…31% of your gross income — inside the 28% guideline"); interest-multiple fallback when income isn't given; PMI warning inline.
4. **Scenario Compare** — the signature feature: A/B tabs (green/copper), dual heroes, delta strip ("B vs A: pays +$754/mo, saves $239,712 in interest, paid off 15 years sooner"), dual-series chart. Compare defaults B to a 15-year term — the comparison people actually came to make.
5. **Chart per dataviz method** — balance-over-time line, area fill 8%, faint grid, endpoint dots, crosshair + tabular tooltip, legend only when 2 series, **"view as table" equivalent** (accessibility = crawlability).
6. **Progressive disclosure** — 4 essential inputs; taxes/insurance/income behind "Add detail"; "what's this?" micro-explanations with typical values under every field.
7. **Show the work** — numbered steps rendered from the engine's `trace` with the user's numbers; article formula block matches the engine to the cent (hydration-consistency rule — a prose/engine mismatch was caught and fixed during this very build).
8. **Byline strip** — author, credentialed reviewer, dated changelog note with "what changed."
9. **FAQ in snippet format** — question as heading, 40–60-word answer first.
10. **Actions without pollution** — Copy-link-with-my-numbers (primary), Print, Embed (inline expansion, not a popup); privacy line "Your numbers never leave your device."
11. **A11y baked in** — `aria-live` hero, labeled fields, `inputmode` keypads, visible focus, `prefers-reduced-motion` respected, keyboard operable.

## 4. CEO approval round (design review record)

The screenshots went to the executive panel. Result: **approved, with one sustained critique and two acknowledgments.**

- **Sustained — "the hero is a total with no anatomy":** a black-box number is incumbent behavior. → Breakdown line added under the hero (shipped in the mockup).
- **Acknowledged — placeholders:** "R. Sharma, CPA" and the changelog note are illustrative placeholders pending the real reviewer roster (EE reviewer owns math/electrical clusters; CPA/CFA before finance scales, per the compliance absorption).
- **Acknowledged — ad slots:** deliberately absent below 100K sessions/mo per the monetization ladder; when introduced, slots get fixed reserved space *below* the results panel, never between input and answer.

**Sign-off:** the design satisfies the template contract from all three red teams and is the reference for the Astro build. Deviations from this spec in implementation require a note in this file.

## 5. Verification performed

- Chart palettes passed `validate_palette.js` in light (`#0E8A5C, #A66327` on `#FCFCFB`) and dark (`#2E9A72, #BC7638` on `#1A1A19`) — lightness band, chroma floor, CVD ΔE, contrast all PASS.
- Rendered and inspected at 1280px light, 1280px dark, 1280px compare-mode, 390px mobile. Caught and fixed: y-axis cents/dollars mislabel ($32k→$320k), label wrap, nav overflow, prose/engine value mismatch.
- Engine math cross-checked: $320,000 @ 6.8%/30yr → P&I $2,086.16/mo; $300,000 @ 7%/30yr → $1,995.91/mo (matches the published FAQ example).
