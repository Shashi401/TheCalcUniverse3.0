# UX Psychology Absorptions

### Owner-supplied review, July 2026. Six behavioral principles evaluated against the template contract — each marked already-covered, absorbed, or rejected, following the same discipline as the three red-team reviews.

*Rule applied throughout: adopt the psychology, reject the coercion. Any technique that conflicts with the Dave contract (/promises) or the trust pillar is rejected regardless of its conversion upside — trust is the moat incumbents can't copy.*

---

## 1. Smart defaults (decision fatigue)

**Claim:** 70–90% of users never change defaults; pre-filled forms convert dramatically better than blank ones. Defaults read as recommendations.

**Status: already product law #1.** "The answer appears before the user asks" — every calculator loads pre-filled with sensible 2026 defaults and a live result; no Calculate button exists. No change needed.

**One extension absorbed:** wherever a CTA leads to a result set (homepage search, category hubs), show the real payoff in the control itself where feasible ("214 finance calculators", live example readout) — never a bare verb into the unknown.

## 2. Goal gradient ("never start at zero")

**Claim:** People finish faster the closer they feel to done; a head start (2 of 10 stamps pre-filled) nearly doubles completion.

**Status: absorbed — honest version only.** Calculators have no onboarding, but they have an accuracy journey. Template contract addition:

- **Estimate-completeness cue:** with only essential inputs filled, the hero result is labeled a *good estimate*; the "Add detail" affordance states what completing it buys ("add taxes & insurance for a lender-grade payment"). Progress toward accuracy is real and already partially earned — never a fake percentage.

**Rejected:** artificial progress bars and invented head starts ("even fake progress creates real momentum"). Fake anything is off-brand for a site whose promise is verifiable correctness.

## 3. Reciprocity (give before asking)

**Claim:** Value delivered first creates a pull to reciprocate; gated results ("create an account to see your report") kill conversion.

**Status: already the business model.** Full answer, free, no gate, no signup, client-side computation. Codified explicitly:

- **No result is ever gated, blurred, or truncated behind an ask.** Owned-audience prompts (save this calculation, email me the schedule) appear only *after* the complete answer is delivered, inline below the results panel — never as a modal, never between the user and the number.

## 4. IKEA / endowment effect (investment creates ownership)

**Claim:** People value what they configure or build; leaving then feels like abandoning something theirs.

**Status: half-built; remainder absorbed.** Already in the template: copy-link-with-*my*-numbers, scenario compare, show-the-work rendered with the user's own figures, result-card image export (blueprint §10). Additions to the template contract:

- **Ownership language everywhere:** "Your numbers", "your scenario", "your payment" — never generic labels where the user's own data is on screen.
- **Nameable scenarios:** in Scenario Compare, A and B accept user labels ("Current offer" vs "15-year"); the labels persist in share URLs and print/export artifacts, so the thing being shared is unmistakably *theirs*.

## 5. Loss aversion / status-quo bias

**Claim:** Losses motivate roughly twice as strongly as gains; frame the cost of inaction, not the benefit of action.

**Status: absorbed for copy; rejected for UI mechanics.**

- **Absorbed — verdict-sentence library rule:** where two options are compared, the verdict frames the *cost of the status quo* honestly: "staying at 30 years costs you $239,712 more in interest" rather than "switching saves you money." Both are true; the loss frame lands harder and remains factual.
- **Rejected:** countdown timers, manufactured scarcity, threat screens, and guilt-toned dismissals ("I'll risk it"). These are the dark patterns /promises exists to forbid. A calculator that manipulates is a calculator that can't be trusted, and accuracy-trust is the entire brand.

## 6. Contrast effect / anchoring

**Claim:** Numbers are evaluated relative to whatever was seen immediately before; control the anchor.

**Status: absorbed as a formatting rule.**

- **No significant number in isolation:** secondary values are contextualized against the natural anchor already on screen — PMI shown as $/mo *and* % of the payment; total interest side-by-side with the loan amount (the "1.3× for every dollar borrowed" multiple, already in the verdict library); compare deltas always anchored to Scenario A.
- Anchoring is used to *aid comprehension of true magnitudes*, never to make a cost look smaller than it is (no burying a real cost behind a flattering percentage without the absolute number beside it).

---

## Summary of committed template changes

1. Estimate-completeness cue on the hero result + "what detail buys you" copy on progressive disclosure.
2. Owned-audience prompts positioned only after the delivered answer; gating banned in writing.
3. Ownership language and nameable, share-persistent scenario labels.
4. Loss-framed (honest) verdict sentences for all comparisons.
5. "No number in isolation" contextualization rule for secondary metrics.

## Explicitly rejected (anti-brand)

Fake progress · countdowns and manufactured urgency · guilt-toned dismiss buttons · gated/blurred results · anchoring that hides true cost. Each violates the published Dave contract and the user-panel absorptions (blueprint §11).
