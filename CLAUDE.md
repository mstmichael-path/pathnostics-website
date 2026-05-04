# Pathnostics Website — Working Notes

## Session handoff — current state (May 3, 2026, evening)

**v13** shipped (mobile menu, Our Tests mega panel rework, trailing-slash
normalization, laptop-range fluid clamp typography, scroll-collapsed local
nav polish, asset filename ASCII fix). All on both branches.

**Guidance UTI flagship-test page** shipped at `/tests/guidance-uti/` with
its own page-specific stylesheet `/css/flagship-test.css`. This is the
**anchor for the flagship-test template** — to be reused for the other
six test pages (Guidance Prostatitis, Anatomic Pathology, Barrett's
Esophagus, Gyn Cytology HRT, Bladder FISH/UroVysion, Cytology HR HPV).
Page assets: `/assets/guidance-uti-header-image.webp`,
`/assets/Guidance-UTI-Sample-Test-Report.png`,
`/assets/Dec.-1-Guidance-UTI-Sample-Report_EH.pdf`,
`/assets/Real-World-Evidence-Summary.pdf`.

**Info-page anchor template** built at `/templates/info-page.html` (with
`/css/info-page.css`). Designed around `/about/` content; reusable for
all static-content sub-pages (about, our-team, careers, innovation,
veterans, customer-care, billing, order-supplies, patient-resources,
clinical-resources, payors).

**Parallel-session work in flight (May 3, 2026, evening):**

The user spawned two parallel sessions tonight to re-skin the legacy
pages. They run autonomously (Claude Code Auto Mode) per their briefs.

- **Session A** — `/SESSION_BRIEF_A_info_pages.md`. Builds 11 info pages
  using `/templates/info-page.html` as anchor.
- **Session B** — `/SESSION_BRIEF_B_listing_pages.md`. Builds three index
  pages (`/guidance-uti-publications/`, `/uti-knowledge-center/`, `/news/`)
  plus ~150 detail pages. Builds two new templates of its own:
  `templates/listing-page.html` and `templates/article-detail.html`.

Both sessions push to `qa-preview` only and append to `/SESSION_LOG.md`.
**Orchestrator (this session) handles cherry-picks to `main`.** When you
return after compaction:
1. Read `/SESSION_LOG.md` to see what they shipped.
2. `git log main..qa-preview --oneline` (or better: `git cherry main qa-preview`)
   in the clone to see unmerged commits.
3. User reviews on QA URL, says "go", you cherry-pick.

**Scraped content lives at sibling folder:**
`/Users/msm_macstudio/MSM Dropbox/Melyssa St. Michael/CoWork/Pathnostics/dev_web-old-website-scrape/`
(204 pages with content.md + raw.html + screenshot.png each, plus sitemap.json).

To avoid stepping on each other:
- Read this file fully before making changes.
- Push design work to **`qa-preview`** only — never `main`. After the user
  QAs and says "go", cherry-pick (don't merge) to `main`.
- Coordinate with the user before touching files outside this session's
  scope (especially `vercel.json`, `coming-soon.html`, `whitepaper/`,
  files another session is editing).

## Quick orientation for a fresh session

1. Read this file end-to-end before doing anything.
2. The deployable code lives at `~/Code/pathnostics-website/` (a clone of
   `mstmichael-path/pathnostics-website`). The clone normally sits on
   `qa-preview`. The Dropbox folder you're in right now is the editing area
   — files have to be copied to the clone before any push.
3. `qa-preview` is your working branch. Push there, share the QA URL, wait
   for user "go", then cherry-pick to `main`. See "QA workflow" below for
   the full protocol.
4. Current to-do list is at the bottom of this file.

---

## ⚠️ Two folders, different roles — read this first

This Dropbox folder (`~/MSM Dropbox/Melyssa St. Michael/CoWork/Pathnostics/website/`)
is the **editing / staging area**. It is **not** a git repo. Saving here does
**not** deploy anything.

The repo Vercel watches is a separate clone:

| Purpose | Path |
| --- | --- |
| Editing / staging (this folder) | `~/MSM Dropbox/.../CoWork/Pathnostics/website/` |
| Git repo deployed by Vercel | `~/Code/pathnostics-website/` |
| GitHub remote | `mstmichael-path/pathnostics-website` (branch `main`) |
| Live site | `pathnostics.com` (alias `pathnostics-website.vercel.app`) |

Vercel auto-deploys on every push to `main`. There is no manual deploy step.

> **Use `~/Code/pathnostics-website/` exclusively.** A previous session
> (May 2026) created a temporary clone at `/tmp/pathnostics-website-fresh/`
> and pushed from there. Both clones target the same GitHub remote, but
> their working trees can diverge. Going forward, only use the persistent
> clone at `~/Code/pathnostics-website/`. If it doesn't exist or is out of
> sync, run `git clone https://github.com/mstmichael-path/pathnostics-website.git ~/Code/pathnostics-website` (then delete any stale `/tmp/pathnostics-website-fresh/` to avoid accidentally pushing from there).

### Workflow for shipping a change

1. Edit and verify in this Dropbox folder (or directly in the clone — your call).
2. Copy the changed files into `~/Code/pathnostics-website/`.
3. From the clone: `git add <files-by-name>`, commit, push.
4. **Push to `staging` first for QA** (see "QA workflow" below). Push to
   `main` only after user explicitly approves the staging preview.

If a session starts in this Dropbox folder and the user asks to "deploy" or
"push," the change has to be propagated to the clone first — they are not
linked. **Stage files by explicit name, never `git add -A` or `git add .`**
(the Dropbox folder contains node_modules, .DS_Store, .docx briefs, etc.;
the clone doesn't, but keep the habit anyway).

### Reference files that live ONLY in this Dropbox folder

These are design/strategy references, not deployable code. Don't copy into
the clone:

- `DESIGN_REFERENCE.md` — design system reference
- `REPORT_ANIMATION_BRIEF.md` — animation spec for the report explainer
- `Pathnostics_ClaudeCode_Brief_v2.docx` — original project brief
- `Pathnostics_Homepage_Copy_v8.docx` — homepage copy source
- `whitepaper/` — UTI Crisis whitepaper (its own self-contained subproject)
- `stitch/` — Stitch design exports
- `index_v3.html` … `index_v12.html` — homepage iteration history

The deployed clone has a slimmer footprint (no node_modules, no docx, no
whitepaper subfolder).

---

## QA workflow — qa-preview branch + cherry-pick to main

**Updated state (2026-05-03):** A `qa-preview` branch is wired up to the
production Vercel project as a branch preview, so the homepage can be
QA'd on real Vercel infrastructure during the launch-gate window.

### Branch model

| Branch | Role | What it deploys |
|---|---|---|
| `main` | Production | Has the launch-gate `vercel.json`. Vercel deploys to `pathnostics.com` — currently serves `coming-soon.html` |
| `qa-preview` | QA working branch | Same code as `main` minus `vercel.json`, so the homepage actually renders. Vercel auto-deploys to `pathnostics-website-git-qa-preview-pathnostics.vercel.app` |
| `staging` | Stale, not in use | Don't push here |

The clone (`~/Code/pathnostics-website/`) should normally sit on
`qa-preview` — it's the working branch.

### Local preview is still useful for fast iteration

Claude Code's local preview MCP (`mcp__Claude_Preview__preview_*`, port
8080, configured in `.claude/launch.json`) serves the Dropbox folder
locally. Use it to verify changes before pushing — it saves Vercel
build time on broken iterations.

### The flow

1. Edit in the Dropbox folder, verify with the local preview MCP.
2. Sync changed files (by explicit filename) into `~/Code/pathnostics-website/`.
3. From the clone (on `qa-preview`):
   ```bash
   git add <files-by-name>          # NEVER `git add .` or `git add -A`
   git commit -m "..."              # see commit conventions below
   git push origin qa-preview
   ```
4. Vercel rebuilds the QA preview URL in ~30–60s. Share that URL with
   the user.
5. **Wait for explicit "go" from the user.** Do not cherry-pick to
   `main` without it.
6. Cherry-pick to `main` (see protocol below) and push.

### Cherry-pick protocol — every commit, in order

⚠️ **Cherry-pick, never merge `qa-preview → main`.** A merge would
delete `vercel.json` from `main` (since it's removed on `qa-preview`),
silently dropping the launch gate.

⚠️ **Always check what's truly unmerged before cherry-picking.**
Multiple commits often accumulate on `qa-preview` between user "go"s.
Picking only the latest will fail when it depends on earlier commits —
common when one commit refactors what another modifies.

**Use `git cherry`, not `git log`.** `git log main..qa-preview` shows
commits whose SHAs differ between branches — but cherry-picked commits
get new SHAs on `main`, so the source commit still appears in `git log`
output. That's misleading. `git cherry main qa-preview` uses patch-id
matching to detect equivalent commits and prefixes each with `+` (not
in main) or `-` (already in main). Only `+` lines need cherry-picking.

**One commit on `qa-preview` will always show as `+`:** the original
"qa-preview: drop launch gate vercel.json" commit (SHA `9587fc0`) that
removes `vercel.json` on the QA branch. That divergence is intentional
and permanent — never cherry-pick it to `main` or you'll drop the
launch gate.

Standard procedure when the user says "go":

```bash
cd ~/Code/pathnostics-website
git checkout main
git pull origin main --ff-only
git cherry main qa-preview                   # + = unmerged, - = already in main
# Filter out 9587fc0 (the launch-gate-removal commit, always intentionally on qa-preview only)
# Cherry-pick the remaining + lines, oldest first:
git cherry-pick <oldest-sha>
git cherry-pick <next-sha>
# ... continue through the newest
git push origin main
git checkout qa-preview                      # back to working branch
```

If a cherry-pick errors with a conflict, that's almost always a sign
you forgot an earlier commit. Run `git cherry-pick --abort`, recheck
`git cherry main qa-preview`, and pick the missing dependency first.

### Asset filenames must be ASCII-only

Vercel's CDN doesn't reliably serve files with `®`, brackets, plus
signs, spaces, or other non-ASCII characters in URLs — the asset will
load fine on local dev and then 404 on Vercel deploy. **Rename source
assets to safe ASCII** (e.g. `pathnostics-logo-color.png`) before
referencing them in HTML. When renaming, use `git mv` in the clone so
git records it as a rename for clean history.

### Commit message conventions

Match the existing project style — short sentence-case titles, optional
`vN:` or `ci:` prefix, optional body for non-obvious changes, always a
`Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`
trailer (system requirement).

### Recovering if qa-preview drifts from main

If `main` gets a hotfix from another session while you're working on
`qa-preview`, rebase qa-preview on the new main:

```bash
cd ~/Code/pathnostics-website
git checkout main && git pull
git checkout qa-preview
git rebase main          # vercel.json will reappear during rebase
git rm vercel.json       # remove it again on qa-preview
git commit -m "qa-preview: drop launch gate vercel.json"
git push --force-with-lease origin qa-preview
```

Use `--force-with-lease`, never `--force` — protects against overwriting
someone else's push.

---

## Current production state — Launch teaser is active

As of 2026-04-30, the homepage is gated behind a launch teaser ahead of the
**May 5, 2026 at 6:00 AM local** launch.

Files added to the clone for this:

- `coming-soon.html` — self-contained teaser page (logo inlined as base64,
  inline CSS, inline SVG turbulence filter for the liquid-ink-in-water
  background, typewriter animation on the H1/H2). No external dependencies
  beyond Google Fonts.
- `vercel.json` — uses the legacy `routes` config with two rules:
  1. `^/$` → serves `/coming-soon.html` (URL stays `/`)
  2. `/.+` → 302 to `https://pathnostics.com/` (catch-all wildcard
     gating every deep link, including `/index.html`, `/coming-soon.html`,
     and all CSS/JS/asset paths)

  This is a **total gate** — no deep link works on production right now,
  including the QA path the user previously used. To re-enable a hidden
  QA preview, add an exception rule ABOVE the catch-all (e.g.
  `{ "src": "^/qa-preview-<slug>$", "dest": "/index.html" }`).

  ⚠️ **Why `routes` and not `rewrites` + `redirects`?** Vercel's modern
  `rewrites` are evaluated AFTER the static filesystem, so a rewrite for
  `/` never fires while `index.html` exists at the root. The legacy
  `routes` config is evaluated BEFORE the filesystem, which forces the
  gate. Don't "modernize" this back to `rewrites`/`redirects` — it'll
  break the gate. (The two configs are mutually exclusive in vercel.json.)

  ⚠️ **302, not 301.** Temporary so browsers and search engines don't
  cache the redirect past launch. When `vercel.json` is removed at
  launch, everything reverts cleanly.

  ⚠️ **The gate only applies to `main`.** Branch previews (e.g. the
  `staging` branch) are not gated and are reachable directly via their
  Vercel preview URLs. This is by design — it's how QA works during
  the launch-gate window.

### To launch (remove the gate)

The user wants to trigger this **manually** when ready — do not schedule it,
do not do it preemptively. When asked:

1. In the clone: delete `vercel.json` (or set `"rewrites": []`).
2. Commit and push to `main`.
3. Vercel auto-deploys; `pathnostics.com/` flips back to `index.html`.

`coming-soon.html` can stay in the repo — without the rewrite it's just
unreachable. Removing it is optional cleanup, not required.

### Teaser internals worth knowing

- The countdown targets `new Date(2026, 4, 5, 6, 0, 0)` (6:00 AM local
  May 5). After zero, it freezes at "Learn more Tuesday, May 5th, 2026."
- Typewriter pacing: ~6.6s total. Pauses are deliberately weighted around
  "Yes." → rhetorical pause → "It's a *crisis*." (italic on "crisis", coral
  period). Don't shorten without checking with the user.
- The blinking cursor uses a `width: 0` element with an absolutely-positioned
  `::before` so cursor movement causes zero layout reflow (this was a real
  bug fix — naïve inline-block cursor caused the H1 to jitter when the H2
  started typing).
- Background is **static** (no motion). The marbled ink-in-water look is
  produced by three blurred radial-gradient blobs (coral, sky, magenta)
  warped through a static SVG `feTurbulence` + `feDisplacementMap` filter.
  Motion was removed at the user's request after launch — don't reintroduce
  the blob `@keyframes` or the SVG `<animate>` on `baseFrequency` without
  asking. If you need to reduce visual weight further, drop the filter
  entirely before touching blob positions.

---

## Style and tone reminders

- Visual language is the whitepaper cover (deep purple `#39378F` + coral
  `#E82065` + sky `#8FCAEB` + green `#00AE81`, signature gradient bar).
  Anything new on this site should fit that language. See `DESIGN_REFERENCE.md`
  and `whitepaper/colors_and_type.css`.
- The user prefers small, focused changes shipped in one bundled push over
  many micro-pushes.
- Plan first, ask clarifying questions, then build.

> **Font question — TBD.** The whitepaper subproject uses Newsreader +
> Be Vietnam Pro (premium). The main homepage currently loads
> **Playfair Display + DM Sans** from Google Fonts — these are open-source
> substitutes specified in the original brief
> (`Pathnostics_ClaudeCode_Brief_v2.docx`) since the licensed Orpheus Pro
> and Gotham Rounded weren't available. Whether to swap the homepage to
> match the whitepaper is an open decision — confirm with the user before
> changing fonts. If switching, plan to retest all section weights and
> tracking (Playfair has tighter optical sizing than Newsreader).

---

## Recent work (May 2026 session) — v9 through v12

A separate Claude session shipped versions v9–v12 to the same repo. These
versions all live behind the launch gate and won't be visible at
`pathnostics.com` until the gate is removed.

### v9 — JMS copy rewrite

CCO-approved copy applied to all sections from `Pathnostics_Homepage_Rewrite_JMS.docx`:
- New nav labels: Why It Matters, Guidance UTI, Guidance @Home, Evidence,
  Resources, UTI Crisis, About
- New hero copy: "Right Treatment. *First Time.*" with new subhead/body
- Restructured Cost section as "When the First Answer Is Wrong, Everyone Pays"
- New "Why Current UTI Diagnostics Fail" section
- Updated TIRT, Product, Evidence, @Home, Closing CTA copy

### v10–v12 — Three-tier nav system (mega menu + utility + local sticky)

Replaces the single-row v9 nav with a layered system:

- **Tier 1 — Utility bar:** Pay Your Bill | Provider Login | Contact (left),
  underlined `800.493.4490` (right). Pale lavender bg.
- **Tier 2 — Global mega menu (glassmorphic):**
  - "Our Tests" mega panel with hero card (Guidance UTI w/ P-AST) on left
    and provider/care-setting directory on right (centered to viewport, not
    anchored to its menu item)
  - Flyout dropdowns for Providers, Patient Resources, Clinical Resources, About
  - Search dropdown + coral pill "Talk to a Rep" CTA
- **Tier 3 — Local nav (sticky):** Why it Matters · UTI Crisis · Current
  Standard · Different Approach · Guidance UTI · Guidance @Home. Centered,
  no hashtag prefix. Coral progress bar at bottom fills as user scrolls.
  Active state: bold light pink `#ff9ec0` (same family/size as siblings —
  no layout shift).

### Scroll behavior (v12)

- Whole `nav-system` goes solid purple on scroll past 80px
- Utility + global collapse to height 0 (`opacity: 0; padding: 0; height: 0`)
- Local nav stays sticky, expands from 62px to 78px (thicker)
- Logo + Talk to a Rep button move into the local nav
  - Logo on left, items in center, CTA on right (CSS grid: `auto 1fr auto`)
- Rainbow gradient bar moved INSIDE `.nav-system` (was `body::before`) to
  eliminate sub-pixel gap (anti-aliased white sliver)

### Files added/modified in v9–v12

- `index_v9.html`, `index_v10.html`, `index_v11.html`, `index_v12.html`
- `index.html` (mirrors v12)
- `css/nav.css` — NEW dedicated three-tier nav stylesheet
- `css/report-explainer.css` — NEW (scoped report walkthrough)
- `js/main.js` — added mega menu hover handlers, scroll progress, scroll-collapse
- `js/report-explainer.js` — NEW BeatController for inline report animation
- `report-explainer.html` — NEW standalone version of the animated report
  walkthrough (also embedded inline on the homepage)
- Whitepaper carousel (8 cards) added to Evidence section
- "How Physicians Read a Guidance UTI Report" inline interactive added to
  Guidance UTI section

---

## Active to-do list (in priority order)

1. **Footer redesign** — integrate WP-archive footer links from
   `Client Docs/Path/Claude_Code/new-navigation/old-footer/Old_Footer.html`
   into the existing dark navy footer. Match v12 nav design language.

2. **Mobile menu** — current mobile uses an old hamburger overlay from
   pre-v9. Needs full redesign for the three-tier system. Probably a
   single bar with hamburger + Talk to a Rep, opens to a stacked overlay
   showing utility, global menu items, and local nav items.

3. **Page templates per section (Stitch glassmorphic approach)** —
   apply the design language across new pages for each top-level section
   (Our Tests, Providers, Patient Resources, Payors, Clinical Resources,
   About, Guidance UTI, Guidance @Home, etc.). Sub-templates likely
   needed for: detail pages (each test under Our Tests), index/landing
   pages for each section, and content pages (Careers, News, etc.).

4. **Hero ticker** — replace placeholder stats (68%, 1 in 5, 1 in 3) with
   UTI Crisis Whitepaper roundtable data and a "Download the Whitepaper" CTA.

5. **Cost section redesign** — "When the First Answer Is Wrong" layout and
   message comprehension not landing. Needs structural rethink.

6. **Remotion animations** — two placeholder containers waiting for animations:
   - "Detection Isn't Direction" headline moment (TIRT section)
   - Specimen container in Guidance UTI product section

7. **301 redirects** — JMS will provide a list when the WP site cuts over.
   Add to `vercel.json` redirects array. Coordinate with the launch-gate
   removal so we don't accidentally re-add the gate.

8. **DNS cutover** — JP at IT handles Route 53. Records:
   - `pathnostics.com` (apex): A record → `76.76.21.21`
   - `www.pathnostics.com`: CNAME → `cname.vercel-dns.com`
   - Pre-cutover: lower TTLs to 300s on those records
   - Don't touch MX, TXT (SPF/DKIM/DMARC), or other email-related records
   - **Timing TBD** — original plan was a Friday night cutover; with launch
     on May 5 (Tuesday), confirm the date with the user.

---

## Brand colors (current `css/tokens.css`)

| Token | Hex | Use |
|---|---|---|
| `--color-purple` | `#39378f` | Primary, headlines |
| `--color-purple-mid` | `#5554ad` | Mid purple (scrolled nav) |
| `--color-coral` | `#e82065` | CTAs, accents |
| `--color-coral-dark` | `#b8004b` | Italic emphasis |
| `--color-green` | `#00ae81` | Proof, evidence, TIRT |
| `--color-green-dark` | `#00694d` | Evidence support |
| `--color-sky` | `#8fcaeb` | Atmospheric accents |
| `--color-lime` | `#b6cd2f` | Pop accent |
| `--color-navy-deep` | `#1B2A4A` | Dark consequence boxes |
| `#ff9ec0` (literal) | — | Local nav active state (pink) |

---

## Important decisions (don't undo without checking)

- **Three-tier nav** — utility/global/local serve different needs. Don't
  collapse back to a single row.
- **Mega panel for Our Tests is centered to viewport** (`position: fixed;
  left: 50%`), not anchored to its menu item. Other flyouts use absolute.
- **Active state is bold + color, not italic serif** — the italic Playfair
  alternative caused optical sizing shifts (logo jumped). Don't reintroduce.
- **Logo `max-width: none` + `flex-shrink: 0`** — base.css `img { max-width:
  100% }` was causing a circular flex sizing issue squishing the logo.
  Override is required.
- **Body padding-top is constant at 194px** — doesn't shrink on nav collapse.
  Simpler, no body content jumps.
- **Rainbow gradient bar lives inside `.nav-system::before`**, not in
  `body::before`. The body::before rule from base.css is suppressed in
  nav.css to prevent a sub-pixel gap.
- **Don't push without explicit user approval** — push to `staging` first,
  share the preview URL, wait for OK before merging to `main`.

---

## Things to NEVER do

- Push to `main` without explicit user approval (always `qa-preview` first,
  then cherry-pick to `main` after they say "go")
- **Merge** `qa-preview` → `main` — always **cherry-pick**. Merging would
  delete `vercel.json` from `main` and silently drop the launch gate.
- Cherry-pick only the latest commit when there are multiple unmerged
  commits behind. Always run `git cherry main qa-preview` first
  (patch-id matching) and pick all `+`-marked commits in order — except
  `9587fc0` (the launch-gate-removal commit), which is permanently on
  qa-preview only.
- Reference assets with non-ASCII or special characters in their filenames
  (`®`, `[`, `]`, `+`, etc.) — Vercel CDN won't serve them. Rename to ASCII
  via `git mv` first.
- Push to `path-murex.vercel.app` (the OLD Vercel project) — current is
  `pathnostics-website.vercel.app` under `mstmichael-path` GitHub account
- Touch `vercel.json` while the launch gate is active without confirming
- "Modernize" the gate's `routes` config to `rewrites` (will break the gate)
- Use placeholder lorem ipsum (mark `[PLACEHOLDER]` in HTML comments instead)
- Auto-fix copy that JMS approved (v9 and later are CCO-approved verbatim)
- Add a build step (the site runs files directly in the browser)
- Run `git add -A` or `git add .` — always stage by explicit filename
- Push from `/tmp/pathnostics-website-fresh/` — only from `~/Code/pathnostics-website/`

### Framework / library policy

**Don't introduce client-side frameworks for cosmetic or UI purposes.**
No React, Vue, Svelte for the homepage. No Tailwind. No jQuery for DOM
manipulation. Vanilla CSS + JS + GSAP is the stack.

**Pragmatic exceptions are allowed for functional needs** that have no
clean vanilla solution:

- **Form submission**: services like Formspree, Netlify Forms, HubSpot
  embeds, or custom backends are fine. Avoid embedding entire form
  libraries (Formik, etc.) — use the platform's native HTML.
- **Site search**: Algolia, Pagefind, or similar are fine. Don't roll
  your own search index.
- **Light interactivity** (carousels, modals): try vanilla first.
  If genuinely needed, prefer tiny dependency-free libraries (e.g.
  Embla Carousel ~3KB) over Alpine/Stimulus.
- **Analytics, A/B testing, pixels**: per-stakeholder request.

**Always confirm with the user before adding any new dependency**, even
if it's an exception above. Note the reason and the bundle size impact.
