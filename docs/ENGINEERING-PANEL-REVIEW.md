# Engineering Panel Review — The Architecture on Trial
### Red team #3: staff engineers, systems designers, and architects attack the technical blueprint. The business panel asked "will it make money?"; the user panel asked "will anyone come?"; this panel asks "will it actually work — at 10,000 pages, for ten years?"

*Same rules as the previous panels (docs/RED-TEAM-REVIEW.md, docs/USER-PANEL-REVIEW.md): every attack gets a defense, every sustained hit gets absorbed into scope.*

---

## Panelist 1 — The Financial-Software Veteran (numerical precision)
**"Stop. Before architecture diagrams: what does `0.1 + 0.2` equal in your engine? Because in JavaScript it's `0.30000000000000004`, and you're proposing to compute 360-payment amortization schedules in IEEE-754 floats and open-source them so everyone can watch the pennies drift. Your accuracy moat has a rounding hole in it. And which rounding? Half-up? Banker's? CRA and IRS don't round the same way, and your Canadian mortgage pitch is precisely that you get jurisdiction rules right."**

**Defense:** None. This is the single most dangerous latent bug class in the whole plan, and the blueprint didn't name it. The panelist is sustained in full.

**Absorbed — the money-math contract, now the first law of the engines package:**
- **All currency arithmetic in integer minor units (cents) or a decimal library** — never raw floats for money. Floats are permitted only where the domain is genuinely continuous (physics, geometry).
- **Rounding is an explicit, named parameter, never a default:** each engine declares its rounding mode and *where* in the calculation rounding occurs (per-period vs. at-the-end changes real answers), with jurisdiction-specific modes in the data layer.
- **Final-payment reconciliation as a rule:** amortization schedules must sum exactly — the last payment absorbs the accumulated rounding remainder, and a test asserts `sum(payments) == principal + total interest` to the cent on every golden case.
- **Property-based tests alongside golden tests:** invariants fuzzed across the input space (balance never negative, monotonic payoff, symmetry properties), because golden tests only prove the examples you thought of.

---

## Panelist 2 — The Security Engineer
**"Your share-URL feature — `?p=300000&r=7` — is user-controlled input reflected into a page, on a site whose entire brand is trust. Calculator sites are a classic reflected-XSS graveyard. Your embed widget is an iframe you're begging strangers to put on their sites: clickjacking, postMessage abuse, and someone will iframe you inside a phishing page wearing your credibility. And 'client-side only' is not a security architecture — it's a marketing line until the API ships, at which point you own rate limiting, abuse, and a parser fed by every LLM on earth."**

**Defense:** Partial — static-first with no user accounts and no server-side data genuinely eliminates whole vulnerability classes, and the privacy pillar is real. But every specific vector named is real too.

**Absorbed:**
- **URL-parameter prefill is schema-validated, never reflected:** parameters parse through the same Zod input schema as the form (numbers, enums, bounded ranges); anything invalid is silently dropped. No URL value ever reaches the DOM as markup.
- **Embed hardening:** embeds served from a dedicated origin (e.g. `embed.` subdomain) with a strict CSP, `frame-ancestors` policy separating embed routes from the main site (main site denies framing; embed origin allows it), a versioned postMessage protocol limited to height/resize with origin checks, and SRI on the loader snippet.
- **Supply-chain discipline as CI policy:** dependency budget (every new package justified in the PR), lockfile audit in CI, no third-party scripts on calculator pages at all — analytics included until a privacy-preserving, self-hosted option is chosen. The ≤300KB Dave-contract budget doubles as an attack-surface budget.
- **The API ships with keys, rate limits, and quotas from day one** — see Panelist 6 on its blast radius.

---

## Panelist 3 — The Build & Release Engineer
**"Ten thousand statically generated pages. The 2027 federal tax table changes — one data file — and your CI rebuilds all ten thousand pages to update forty of them? What's your build time at that scale, what's your deploy atomicity story mid-rollout, and how does a content writer preview calculator #7,214 without building the world?"**

**Defense:** Astro full builds at 10K mostly-static pages are minutes, not hours, and CDN deploys on the named hosts are already atomic (immutable deploy, instant rollback). The cliff is real but further away than implied.

**Absorbed — because "minutes" quietly becomes "an hour" at 50K pages with i18n:**
- **A declared dependency graph from day one:** every page's build inputs (engine version, data modules, content file) are explicit, so affected-page incremental builds are a config change later, not a re-architecture. Data module → dependent pages is a queryable map.
- **Full clean build nightly** as the canary for graph bugs; incremental builds for PR/preview speed.
- **Per-PR preview deploys** are part of the definition of done for the content pipeline — a writer sees exactly their page.
- **Monorepo tooling settled now:** pnpm workspaces + task-graph caching (Turborepo or Nx), engines as versioned internal packages, CI matrix = typecheck → unit/golden/property → axe → Lighthouse budget → bundle-size gate.

---

## Panelist 4 — The Systems Architect (state & sources of truth)
**"You compute answers in three places and pretend it's one. The pre-answered static HTML for '30% off 80' is computed at build time. The island recomputes on input. The show-the-work trace is formatted somewhere. The verdict sentence interprets thresholds somewhere. When an engine changes, what guarantees the static answer, the live answer, the steps, and the sentence never disagree on the same page? A trust brand where the page contradicts itself is dead on arrival."**

**Defense:** The blueprint's pure-engine design intends exactly one compute path — the same TypeScript engine runs at build time and in the island.

**Panel pushback:** "Intent isn't a contract. Formatting, traces, and verdicts will drift into UI code within a month unless the engine owns them."

**Absorbed — the engine output contract, widened:**
- **Engines return a structured result object, not numbers:** `{ values, trace, flags }` — the computation trace (every step, for show-the-work mode) and threshold flags (e.g. `dtiBand: 'within-lender-range'`, feeding verdict sentences) are *engine* outputs. UI renders; it never re-derives. One brain, two render targets (build-time HTML and runtime island).
- **All display formatting through a single shared formatting module built on `Intl.NumberFormat`/`Intl.DateTimeFormat`** — used identically at build and runtime. No hand-rolled `toFixed` anywhere. This is simultaneously the i18n groundwork (see Panelist 7).
- **A hydration-consistency test in the template CI:** render page statically, hydrate, assert zero diff on the result region for the default inputs. Divergence is a build failure, not a bug report.

---

## Panelist 5 — The Data Engineer
**"Your data layer is 'TypeScript files with expiry dates.' Charming at 10 files. You're promising jurisdictional depth — that's hundreds of tables across US states, Canadian provinces, VAT regimes — each with an effective date, a source, and a human who vouched for it. Who reviews a data PR? The same person who wrote it? Show me the provenance chain when a journalist asks why your CMHC premium is right and Calculator.net's is wrong — because that moment IS your marketing plan."**

**Defense:** The shape is right (versioned modules, source + effective/expiry metadata, CI gates); the governance was underspecified.

**Absorbed:**
- **Data as schema-validated structured files** (JSON/TS with Zod schemas), each record carrying `{ value, sourceUrl, sourceDocument, retrievedAt, effectiveFrom, expiresAt, reviewedBy }`. Provenance is a field, not a comment.
- **Two-person rule for data PRs:** author ≠ approver, enforced by CODEOWNERS on `packages/data`. Math bugs embarrass; data bugs defame.
- **Human-readable data diffs in PRs** (a CI comment renders old→new values with sources), so review is actually possible rather than theatrical.
- **The provenance chain is rendered on the public methodology page automatically** — the journalist-proof story generates itself from the data files.

---

## Panelist 6 — The Platform / SRE Lead
**"Two systems are hiding in this blueprint wearing one trench coat. A static site with effectively 100% uptime for free — and an API/MCP service with availability, latency, abuse, versioning, and on-call. You're one founder. When the MCP server melts at 3 a.m. because someone's agent loop called it 400 times a second, does the website care? And separately: how do you even KNOW your static site is correct in production? Nobody watches a static page."**

**Defense:** The decoupling instinct exists (static site never depends on the API), but observability and blast-radius were unstated.

**Absorbed:**
- **Hard isolation:** the API/MCP service is a separate deployable on a separate origin with its own SLA; the website has zero runtime dependency on it. If the API dies, no page notices.
- **API from day one: keys, per-key rate limits, quotas, and versioned endpoints (`/v1/`)** — engines are versioned packages, so the API can pin engine versions and never break a consumer silently.
- **Synthetic canaries as correctness monitoring:** scheduled probes load key calculator pages in a real browser, compute known scenarios, and compare against golden values. A canary mismatch is a **sev-1** — this is the alarm on the accuracy moat itself.
- **RUM (Core Web Vitals) + island JS error tracking** with alerting on regression, because a CWV promise without measurement is a vibe.

---

## Panelist 7 — The Internationalization Architect
**"You plan i18n in 'phase 4' — which tells me you'll hardcode `$`, comma-thousands, and English strings into 10,000 pages first, then propose a re-platforming. And it's worse for you than for a blog: in half of Europe `1.000,50` means one thousand and a half. A CALCULATOR that misparses a decimal comma doesn't have a localization bug — it has a wrong-answer bug, the one thing your brand cannot survive."**

**Defense:** None needed for the ambition (Omni's 10+ languages validate the market), sustained on the sequencing.

**Absorbed — i18n readiness now, i18n content later:**
- **All formatting through the shared `Intl`-based module** (already absorbed via Panelist 4) — no literal `$`, no hardcoded separators.
- **Locale-aware input parsing at the field level from day one:** the number-input component owns parsing (including decimal-comma tolerance) so no calculator ever misreads a European decimal.
- **Template strings externalized** (message catalog per template, even with only `en` shipped). Translating later becomes a content task, not an engineering project.
- Actual translated content, hreflang clusters, and localized SEO remain phase 4 — the *architecture* stops being the blocker.

---

## Panelist 8 — The Staff Frontend Engineer (performance pedantry)
**"≤50KB JS per page and ≤300KB total — good numbers, no enforcement story. Budgets without gates rot in six weeks. Also: 10,000 pages sharing one island means your framework runtime is cached across the whole site — IF you keep chunks stable. One careless per-page import and you ship a unique bundle per calculator and your budget is fiction × 10,000."**

**Absorbed:**
- **Bundle-size gate in CI** per template (fails the PR over budget), plus a shared-chunk architecture rule: one framework runtime chunk + one engine chunk per calculator; per-page code approaches zero. Verified by a CI report of chunk composition, reviewed when it changes.
- **Preact (3KB) over React inside islands** unless a concrete need for React appears — at these page counts the runtime choice is a permanent tax or a permanent gift.
- **Fonts self-hosted and subsetted** (no third-party font CDN — also a privacy/CSP win), `font-display: swap`, zero layout shift verified in the template CI.

---

## Verdict

**Green light on the shape — static-first, pure engines, data-as-content survived unanimously. But the panel's consensus finding is sharper than approval:**

> *The blueprint's moat — "tested engines, dated data, trust posture" — is an engineering claim, and until this session it was missing its three load-bearing beams: exact money math, data governance, and untrusted-input discipline. Ranking is won in the SERP; trust is won or lost in the rounding of the 360th payment.*

### Absorptions ledger (added to blueprint scope)

| # | Absorption | Source |
|---|---|---|
| 1 | **Money-math contract**: integer cents/decimal only, explicit named rounding per jurisdiction, final-payment reconciliation, property-based tests beside golden tests | Financial-Software Veteran |
| 2 | **Untrusted-input discipline**: schema-validated URL prefill, hardened embed origin + postMessage protocol, no third-party scripts, dependency budget in CI | Security Engineer |
| 3 | **Build dependency graph declared now**; nightly clean build canary; per-PR previews; pnpm + task-graph monorepo with full CI matrix | Build & Release Engineer |
| 4 | **Engine output contract `{values, trace, flags}`** — steps and verdict logic are engine outputs; one shared Intl formatting module; hydration-consistency test in CI | Systems Architect |
| 5 | **Data governance**: provenance fields on every record, two-person rule via CODEOWNERS, human-readable data diffs, auto-generated public provenance page | Data Engineer |
| 6 | **API isolation + correctness monitoring**: separate origin/SLA, keys + rate limits + `/v1/` versioning from day one; synthetic canaries where a wrong result is sev-1; RUM + island error tracking | Platform / SRE Lead |
| 7 | **i18n-ready architecture now** (Intl formatting, locale-aware input parsing, externalized strings), translated content later | i18n Architect |
| 8 | **Enforced performance budgets**: bundle-size CI gate, stable shared-chunk rule, Preact-first islands, self-hosted subsetted fonts | Staff Frontend Engineer |
