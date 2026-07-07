# User Panel Review — The Value Proposition on Trial
### Red team #2: not executives — the audience. Daily users, typical users, critics, and haters interrogate one question: *"why would I ever use this site?"*

*Format mirrors the executive red team (docs/RED-TEAM-REVIEW.md): each persona attacks, the value proposition defends, and every sustained hit is absorbed into scope. The executive panel tested whether the business survives; this panel tests whether anyone shows up.*

---

## Persona 1 — Sarah, first-time homebuyer (the typical user, one visit, highest stakes)
**"I'm terrified of this decision. I googled 'mortgage calculator', clicked the first result, and it asked me eight questions I don't understand — PMI? Escrow? Points? I just want to know if I can afford the house. Every site assumes I already know what I'm doing."**

**What she exposes:** Calculator sites are built by people who understand the domain, for people who understand the domain. The single largest audience — anxious novices at a life decision — is served worst. Her real question isn't "compute my payment," it's *"am I going to be okay?"*

**Absorbed:**
- **Progressive disclosure as a template rule:** every calculator opens with the 3–4 essential inputs; advanced fields (PMI, points, escrow) live behind an "add detail" expansion. The default experience is the novice experience; experts opt into depth, not the reverse.
- **Plain-language input help, one tap away:** every field label carries a "what's this?" that explains the term in one sentence *with a typical value* ("PMI: usually 0.5–1% of the loan per year; applies if your down payment is under 20%"). These micro-explanations are also long-tail SEO content.
- **The verdict sentence:** the hero result is followed by one human sentence that interprets it ("At $2,340/mo, this is 31% of your gross income — inside the 28–36% range most lenders allow."). Numbers inform; sentences reassure. No incumbent does this.

---

## Persona 2 — Marcus, loan officer (the daily professional user)
**"I open a mortgage calculator 15 times a day with a client watching over my shoulder. I need it instant, I need it keyboard-only, and I need the printout to not look like a coupon site. If your page loads an ad between me and the numbers even once while a client is watching, I'm gone forever — and I'm the guy who would've sent you 200 clients a year."**

**What he exposes:** Daily users are 1% of visitors and the source of most embeds, links, and word-of-mouth. They have zero tolerance and enormous distribution value. Retention features aren't nice-to-haves; they're the referral engine.

**Absorbed:**
- **Keyboard-first contract:** tab order, Enter-to-jump, arrow-key increments on every numeric field — tested in CI, not aspirational.
- **Remembered defaults:** the site recalls his last inputs per calculator (localStorage — consistent with "your numbers never leave your device"). A daily user should never re-type his standard rate.
- **Client-presentable output:** the print/PDF and shareable result card are clean enough to hand across a desk — no branding louder than a footer line. The professional *is* the distribution; the artifact he hands out is the ad.
- **The ads rule gets sharpened:** when ads eventually come, *never* between input and result, never before first paint of the answer, no exceptions. One violated session with a client watching costs 200 referrals.

---

## Persona 3 — Priya, college student (daily during the semester)
**"Calculator sites give me the answer, but my professor wants the work. CalculatorSoup shows steps but looks like it was built in 2009 and half the ads are for things I don't want my roommate seeing on my screen. Also I'm doing this on my phone in the library at 1 a.m."**

**What she exposes:** For students, the *answer is not the product — the steps are.* And the student segment is the future daily-adult segment; win them at 19 and keep them at 35.

**Absorbed:**
- **"Show the work" mode on every math-capable calculator:** the step-by-step derivation with the user's actual numbers, formatted like a textbook solution. This was in the template as a breakdown; it's now promoted to a first-class, toggleable mode with its own anchor URL (linkable in a study group chat).
- **Night mode** (prefers-color-scheme respected) — trivial to build, disproportionately loved by the 1 a.m. cohort.
- The clean-ads policy is re-confirmed as a *student* requirement, not just a professional one: no remnant-quality ad inventory, ever.

---

## Persona 4 — Dave, the hater
**"My phone HAS a calculator. My spreadsheet HAS formulas. Every 'calculator website' is an SEO landfill with 4,000 words of filler some intern wrote, nine ads, a newsletter popup, and a cookie banner covering the one thing I came for. You're all the same site wearing different fonts. Delete your startup."**

**Defense — and Dave deserves a real one:** Dave is right about the category and wrong about the job. His phone calculator does arithmetic; it cannot answer *questions* — "what's my payment at 6.8% vs 7.1%", "is this marriage penalty real", "which discount stacking is better." The moment a question has structure (rates, rules, jurisdictions, time), a purpose-built tool beats a keypad and beats a blank spreadsheet. That's the value proposition in one line: **we answer number-shaped questions, not arithmetic.**

But every specific insult — filler text, popups, banner-blocking-the-tool — is an accurate description of the incumbents, which means it's a free differentiation list:

**Absorbed — the "Dave contract," a published UX constitution:**
1. The calculator is interactive above the fold on every device. Nothing ever covers it.
2. No newsletter popups. No notification prompts. No interstitials. Ever.
3. Total page weight budget ≤ 300KB on first load (incumbent calculator pages routinely ship megabytes).
4. Explanatory content exists *below* the tool for the people who want it — and it's written to be worth reading (the FAQ archetypes), never to pad word count. If a section doesn't survive "would a human scroll back up to cite this?", it's cut.
5. The site works with JavaScript disabled for reading (static HTML) and degrades gracefully.

Publishing this as a page (/promises) converts hater-fuel into brand. Dave will never love us; Dave's upvoted Reddit comment saying "fine, this one's actually not cancer" is worth more than any ad campaign.

---

## Persona 5 — Jen, the checkout-line shopper (the 10-second user)
**"I'm holding a sweater that's 30% off with an extra 15% coupon and there's a line behind me. I have maybe eight seconds. Every site wants me to accept cookies, rotate my phone, and read a paragraph first."**

**What she exposes:** A huge share of calculator traffic is *micro-sessions* — single-question, mobile, urgent. Time-to-answer is the entire experience; there is no second impression.

**Absorbed:**
- **A hard product metric: time-to-first-answer under 3 seconds** on mid-range mobile, *including* the user's first input — which means numeric keypads (`inputmode` attributes) on every field, huge touch targets, and defaults so sensible that many users only change one number.
- **Value-tail pages pre-answer the query:** the page for "30% off 80" loads with the answer already computed in the static HTML. Zero interaction needed; the JS island is optional enhancement. (This also makes these pages fully answer-complete for AI crawlers.)

---

## Persona 6 — Robert, the skeptical critic (writes the "SEO content farm" exposé)
**"Every calculator site claims to be 'accurate' and 'trusted by millions.' Claims are free. Your 'reviewed by experts' byline is a stock photo away from being a lie, and your 'updated 2026' badge — did anything actually change, or did you bump a date for freshness signals like everyone else? Prove any of it or you're just a better-dressed content farm."**

**Defense:** This is exactly why accuracy was designed as *architecture*: golden tests citing IRS/CMHC published examples, data files carrying sources and effective dates, and a public methodology page. The plan doesn't ask for trust; it shows receipts.

**Panel pushback:** "Receipts nobody can inspect are still claims."

**Absorbed:**
- **Open-source the engines and their test suites.** The math packages (`@calc/engines`) go public on GitHub — anyone, including Robert, can read the mortgage formula and run the tests against the IRS's own examples. No competitor dares do this because their math lives in minified page scripts. "Check our math" becomes a literal link on every calculator, and it's simultaneously a developer-audience acquisition channel (stars, forks, backlinks from awesome-lists).
- **Honest changelogs:** the "Updated 2026" badge links to a real diff-style note ("Jan 2: 2026 federal brackets, source: Rev. Proc. 2025-32"). A date bump with no note is treated as a bug.

---

## Persona 7 — Amara, screen-reader user (the excluded user)
**"Calculator sites are among the worst experiences on the assistive web: unlabeled inputs, results that update silently so I never hear the answer, charts with no text alternative. You will build 10,000 pages — you will either bake access in on page one or retrofit 10,000 pages later."**

**What she exposes:** Accessibility on a calculator site isn't a checklist item — the *product is a form and a result*, the two things assistive tech depends on most. And she's right about the economics: it's a template-level decision that costs almost nothing now and a re-platforming later.

**Absorbed:**
- **WCAG 2.2 AA as a template contract:** labeled inputs, `aria-live` announcement of the hero result on every recomputation, full keyboard operability (already demanded by Marcus), visible focus, and every chart paired with a data table equivalent (which also happens to be crawlable, snippet-eligible content — access and SEO are the same work here).
- Automated axe checks in CI on the template; a template-level fix fixes every page.

---

## Persona 8 — Ethan, 19, AI-native (the user who may never come)
**"I don't google. I ask my AI. It answers in my chat and I never see a website. You're building for a behavior I don't have."**

**Defense:** Ethan is why the executive red team made the **Calculation API + MCP server** a pillar: when his AI needs a number it shouldn't hallucinate — a 2026 tax liability, a CMHC premium — the assistant calls our engines and cites us. Ethan doesn't visit, and we're still in the loop.

**Absorbed:**
- **The follow-through link is designed for Ethan's one click:** when an AI cites us, the landing must be *the pre-filled calculator with his numbers* (the share-URL scheme doubles as the citation deep-link format). If he ever does click, he lands in a live tool mid-answer — the one thing the chat window can't be.
- **Natural-language input (later phase, flagged as an idea, not scope):** a single box on the homepage — "paste your question" → parsed client-side into the right calculator, pre-filled. Meets AI-era users in their native grammar without pretending to be a chatbot.

---

## The Value Proposition, distilled by the panel

Eight personas, one convergent finding. The site's promise, in the users' own hierarchy:

> **"Ask a number-shaped question. Get a verifiably correct answer in seconds — with the work shown, your options compared, nothing in your way, and your numbers never leaving your device."**

Five pillars, each owned by the personas who demanded it:

| Pillar | Owed to |
|---|---|
| **Instant** — answer under 3s, tool above the fold, nothing ever covers it | Jen, Dave, Marcus |
| **Understandable** — plain-language fields, verdict sentences, show-the-work mode | Sarah, Priya |
| **Verifiable** — open-source engines, cited sources, honest changelogs | Robert |
| **Respectful** — the Dave contract: no popups, no ad ambushes, ≤300KB, WCAG AA | Dave, Amara, Marcus |
| **Everywhere** — share-URLs, embeds, print-worthy artifacts, API/MCP for AI assistants | Marcus, Ethan |

## Absorptions ledger (added to blueprint scope)

1. **Progressive disclosure** — essential inputs first, expertise opt-in (template rule).
2. **Verdict sentences** — every hero result gets one interpreting sentence.
3. **"What's this?" micro-explanations** with typical values on every field.
4. **Keyboard-first + remembered defaults** for daily users; client-presentable print/share artifacts.
5. **"Show the work" mode** promoted to first-class, linkable feature; night mode.
6. **The Dave contract published at /promises** — no popups, ≤300KB, tool never covered, content earns its words.
7. **Time-to-first-answer < 3s** as a tracked product metric; value-tail pages pre-answered in static HTML.
8. **Open-source the engines + test suites**; changelogs with real diffs behind every "Updated" badge.
9. **WCAG 2.2 AA in the template contract**, axe checks in CI, chart-to-table equivalents.
10. **Citation deep-links = share URLs** so AI referrals land mid-answer; natural-language input parser logged as a future idea.

**Panel verdict:** the business-side moats (tested engines, dated data, trust posture) survive contact with users only if the *experience* keeps five promises the incumbents structurally can't — because their revenue depends on breaking them. The ad-soaked leaders cannot adopt the Dave contract without firing their business model. That asymmetry, not any feature, is the durable user-side advantage.
