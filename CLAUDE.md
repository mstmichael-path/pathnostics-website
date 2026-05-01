# Pathnostics Website — Deployable Repo

## ⚠️ This is the deploy repo — pushes go live

You are in `~/Code/pathnostics-website/`, the git repo Vercel watches. **Every
push to `main` triggers an auto-deploy** to `pathnostics.com` (alias
`pathnostics-website.vercel.app`). There is no manual deploy step and no
staging environment — `main` is production.

Be deliberate about commits and pushes here. Stage files by explicit name
(never `git add -A` or `.`).

## The other folder — design references live there

Design references, copy decks, the whitepaper subproject, and homepage
iteration history live in a separate **non-git** Dropbox folder:

`~/MSM Dropbox/Melyssa St. Michael/CoWork/Pathnostics/website/`

That folder contains things you may need to read but should NOT copy into
this repo:

- `DESIGN_REFERENCE.md` — design system reference
- `REPORT_ANIMATION_BRIEF.md` — animation spec for the report explainer
- `Pathnostics_ClaudeCode_Brief_v2.docx` — original project brief
- `Pathnostics_Homepage_Copy_v8.docx` — homepage copy source
- `whitepaper/` — UTI Crisis whitepaper (its own self-contained subproject)
- `index_v2.html` … `index_v9.html` — full homepage iteration history
- `node_modules/` — leftover from local tooling

The Dropbox folder is the user's editing/staging area. They sometimes edit
there first, then copy specific files into this repo to deploy. If asked to
"deploy" or "push" something they've been working on, check whether the
change is already in this clone — if not, the file needs to be copied over
from the Dropbox folder before commit.

---

## Current production state — Launch teaser is active

As of 2026-04-30, the homepage is gated behind a launch teaser ahead of the
**May 5, 2026 at 6:00 AM local** launch.

Files in the repo for this:

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

### To launch (remove the gate)

The user wants to trigger this **manually** when ready — do not schedule it,
do not do it preemptively. When asked:

1. Delete `vercel.json` (or set `"rewrites": []`).
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
  `#E82065` + sky `#8FCAEB` + green `#00AE81`, signature gradient bar,
  Newsreader display + Be Vietnam Pro body). See the Dropbox folder's
  `DESIGN_REFERENCE.md` and `whitepaper/colors_and_type.css` for full system.
- The user prefers small, focused changes shipped in one bundled PR over
  many micro-PRs.
- Plan first, ask clarifying questions, then build.
