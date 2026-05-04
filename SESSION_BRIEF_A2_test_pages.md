# Session Brief A2 — Remaining Test Product Pages

## YOUR JOB IN ONE SENTENCE

Build the six remaining test-product pages using `/tests/guidance-uti/`
as the anchor. **Each page gets a different brand colorway as its
primary accent color.** Push to `qa-preview` only. Do not push to `main`.

---

## READ FIRST

1. **`CLAUDE.md`** — auto-loaded. Read end-to-end.
2. **`/tests/guidance-uti/index.html`** — the flagship anchor. Your
   templates derive from this. 9 sections; full nav + footer; GSAP wired.
3. **`css/flagship-test.css`** — the page-specific stylesheet (~700 lines).
   Classes prefixed `.ft-`. You will be making per-page CSS overrides
   that extend this.
4. **`css/tokens.css`** — the brand color tokens you'll swap.
5. **`SESSION_BRIEF_A_info_pages.md`** — read for shared design
   mandates (items 1–12 in "DESIGN MANDATES"). They apply equally here.
6. **`SESSION_LOG.md`** — append handoff lines after each push.

---

## YOUR SCOPE — exactly these six slugs, each with an assigned colorway

| Slug | Output path | Scraped source folder | **Primary colorway** |
|---|---|---|---|
| `/tests/guidance-prostatitis/` | `/tests/guidance-prostatitis/index.html` | `tests--guidance-prostatitis` | **Coral** `#e82065` (sister to Guidance UTI in urology family) |
| `/tests/anatomic-pathology/` | `/tests/anatomic-pathology/index.html` | `tests--anatomic-pathology` | **Green** `#00ae81` (clinical evidence) |
| `/tests/barretts-esophagus/` | `/tests/barretts-esophagus/index.html` | `tests--barretts-esophagus` | **Navy deep** `#1B2A4A` (gravitas — precancerous condition) |
| `/tests/gyn-cytology-hr/` | `/tests/gyn-cytology-hr/index.html` | `tests--gyn-cytology-hr` | **Sky** `#8fcaeb` (women's health, approachable) |
| `/tests/bladder-fish-urovysion/` | `/tests/bladder-fish-urovysion/index.html` | `tests--bladder-fish-urovysion` | **Lime** `#b6cd2f` (distinct accent identity) |
| `/tests/womens-cytology-high-risk-hpv/` | `/tests/womens-cytology-high-risk-hpv/index.html` | `tests--womens-cytology-high-risk-hpv` | **Coral-dark** `#b8004b` (women's cytology family, differentiated from sister) |

Scraped content lives at:
`/Users/msm_macstudio/MSM Dropbox/Melyssa St. Michael/CoWork/Pathnostics/dev_web-old-website-scrape/pages/<source folder>/content.md`

### Do not touch

- `/index.html`, `/coming-soon.html`, `/vercel.json`
- `/tests/guidance-uti/` (the anchor — don't modify)
- `/templates/`
- Any page already built by Session A or B (info pages, listing pages,
  detail pages — see `SESSION_LOG.md`)

---

## COLORWAY IMPLEMENTATION — what changes per page

The colorway is an **accent** layer, NOT a body-text replacement. Body
text and headlines stay in `--color-purple` for legibility and brand
consistency. The colorway shows up in:

1. **Hero overline** (`.ft-hero__overline` color)
2. **Italic emphasis** in titles (`.ft-hero__title em`,
   `.ft-section__title em` color)
3. **Hero background tint** — radial gradient ellipse uses the colorway
   at low opacity (replace the sky-blue `rgba(143, 202, 235, 0.18)` in
   `.ip-hero` / `.ft-hero` with the colorway at similar opacity)
4. **Section accents** — capability card icon backgrounds, evidence stat
   numbers, the "rule" lines under section titles
5. **References section gradient** (if present) — match the colorway's
   gradient pattern. For dark colorways (navy, coral-dark), use the
   green-gradient pattern from the homepage references section. For
   light colorways (sky, lime), the references gradient should pair
   the colorway with a darker companion (e.g., sky pairs with navy;
   lime pairs with green-dark) so text stays legible.
6. **Closing CTA section** — keep the green-gradient closing CTA on
   ALL pages. It's the consistent brand outro. Don't recolor it.

### How to implement

Create one stylesheet per page at `css/test-<slug>.css`. Each is a thin
override that extends `flagship-test.css`. Pattern:

```css
/* css/test-guidance-prostatitis.css */
/* Colorway: Coral #e82065 */

.ft-hero {
  background:
    radial-gradient(ellipse 80% 60% at 30% 0%, rgba(232, 32, 101, 0.18) 0%, transparent 70%),
    linear-gradient(180deg, #fff5f7 0%, #ffffff 70%);
}

.ft-hero__overline,
.ft-hero__title em,
.ft-section__title em,
.ft-evidence__stat-number {
  color: #e82065;
}

/* ...other overrides as needed... */
```

In each page's `<head>`, load BOTH stylesheets:

```html
<link rel="stylesheet" href="/css/flagship-test.css">
<link rel="stylesheet" href="/css/test-guidance-prostatitis.css">
```

### Special notes per colorway

- **Sky `#8fcaeb`** is the lightest. Its hero gradient must be more
  saturated (try `rgba(143, 202, 235, 0.32)` not `0.18`). For italic
  emphasis text on white, sky alone is too pale — pair with a darker
  blue (`#5099c8` or similar) or fall back to purple for emphasis text.
  Use sky for backgrounds, accents, the references gradient — not for
  small text on white.
- **Lime `#b6cd2f`** has the same legibility issue as sky. Use it as a
  background/accent, but emphasis text on white should use `--color-purple`
  or a darkened lime variant.
- **Navy `#1B2A4A`** can read as drab if used flat. Pair with a warm
  accent (try lime `#b6cd2f`) for the references gradient and CTA hovers.
- **Coral-dark `#b8004b`** vs **Coral `#e82065`**: keep them visibly
  distinct. Coral-dark page should lean burgundy in its hero gradient
  (`rgba(184, 0, 75, 0.16)` mixed with a warm cream `#fff8f5`).

If a colorway feels broken or fights the design, **stop and ask the
orchestrator**. Don't ship a page where the color hurts legibility or
clashes with the closing CTA.

---

## WORKFLOW PER PAGE

1. **Read the scraped content.** Path is the source folder above. Note
   frontmatter (`title`, `meta_description`, `h1`) and the markdown body.
2. **Bucket the content** into the flagship-test 9-section structure:
   - Hero (overline / title / lede / CTAs)
   - Capability cards (3-up of what the test detects/covers)
   - Evidence stats (real-world data, if available)
   - Sample report visual (if applicable to this test)
   - How it works (sample → results timeline)
   - Specimen / collection (if applicable)
   - At-Home option (mostly Guidance UTI specific — likely SKIP for these)
   - FAQ
   - References (if source has citations)
   - Closing CTA (always required)
3. **For thin content**: most of these scraped pages are 40–50 lines.
   Don't fabricate — if the source has no FAQ, omit the FAQ section.
   If there's no evidence stat, omit the evidence section. The shell is
   modular; use only what the content supports. **Guidance Prostatitis
   has 168 lines and can fit the full shell.**
4. **Copy the anchor.** From `/tests/guidance-uti/index.html`. Save to
   `/tests/<slug>/index.html`.
5. **Update head metadata.** `<title>X — Pathnostics`, meta description
   from frontmatter, page-specific keywords.
6. **Swap content.** Replace the Guidance UTI copy with this test's copy.
   Voice: 90% original meaning, headers reframed in clinical-confident
   tone (look at Guidance UTI hero for reference).
7. **Add the page-specific stylesheet.** Create `css/test-<slug>.css`,
   load it in `<head>` AFTER `flagship-test.css`.
8. **Update Tier 3 local-nav anchors.** They must point to sections that
   exist on this page. Drop sections that don't apply.
9. **Migrate images.** If scraped content references
   `pathnostics.com/wp-content/uploads/...`, download to
   `/assets/<sensible-folder>/<ascii-name>.<ext>` and update reference
   to absolute `/assets/...`. ASCII filenames only.
10. **Verify.** Spot-check via the local preview server (port 8080) or
    by reading file structure.
11. **Sync to clone.** Copy your new file(s) into
    `~/Code/pathnostics-website/` matching the same paths.
12. **Stage explicit filenames, commit, push to `qa-preview`:**
    ```bash
    cd ~/Code/pathnostics-website
    git add tests/<slug>/index.html css/test-<slug>.css
    git add assets/<any-new-assets>
    git commit -m "Add /tests/<slug>/ — <colorway> colorway

    Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
    git push origin qa-preview
    ```
13. **Append to `SESSION_LOG.md`.** Then move to the next slug.

---

## DESIGN MANDATES (same as Sessions A & B)

1. Nav identical to homepage. GSAP + ScrollTrigger CDN required (already
   in the anchor — don't remove).
2. Last content section parallaxes over the navy footer (handled by
   GSAP + matching footer markup).
3. References section per page when source has citations. Use the
   homepage pattern, recolored per the colorway notes above.
4. Copy = 90% of original. Reframe headers in the clinical-confident
   voice. Body text largely preserved.
5. ASCII asset filenames only. Absolute paths (`/assets/...`, `/css/...`).
6. Each page: unique `<title>` + `<meta description>` from scraped
   frontmatter.
7. Mobile drawer markup verbatim from homepage.
8. Cross-page links — preserve internal links even if the linked page
   doesn't exist yet. Add `<!-- TODO: page not built yet -->` near
   broken targets.
9. Asset migration: default to migrate WP-hosted images to local
   `/assets/`. Flag very large heroes with `<!-- TODO: optimize -->`.
10. Don't modify any file outside this scope.

---

## STOP CONDITIONS — when to ask the orchestrator

Pause and ask if:

- A colorway looks broken in practice (sky/lime read too pale; navy
  too drab without a paired accent). Show a screenshot, propose an
  adjustment.
- Scraped content for a test is so thin that even the modular shell
  feels empty. Propose either a "compact" page layout or skipping
  certain sections.
- Two of the test pages end up looking too similar in structure (e.g.,
  Gyn Cytology HR and Women's Cytology HPV are sister products). The
  colorway alone may not be enough differentiation; flag if you want to
  vary structure too.
- The references for a test are paywalled or have broken DOIs.
- You hit 3+ pages and feel the design is drifting from the anchor.
  Stop and ask for a checkpoint review.

---

## HANDOFF LOG

After each push, append to `SESSION_LOG.md`:

```
[2026-05-XX HH:MM] Session A2 built /tests/<slug>/  — pushed <commit-sha>
                   — colorway: <name>
```

When fully done with your scope:

```
[2026-05-XX HH:MM] Session A2 COMPLETE — built 6 test pages.
                   Colorways: prostatitis=coral, anatomic=green,
                   barretts=navy, gyn-cytology=sky, bladder-fish=lime,
                   hpv=coral-dark.
                   Awaiting orchestrator review and cherry-pick to main.
```

Do **not** cherry-pick to main yourself. Orchestrator handles that.

---

## CHECKLIST BEFORE EACH PUSH

- [ ] File path is `/tests/<slug>/index.html` (matches the table)
- [ ] Page-specific stylesheet at `/css/test-<slug>.css` and loaded in `<head>`
- [ ] `flagship-test.css` ALSO loaded (the override extends, doesn't replace)
- [ ] `<title>` and `<meta description>` updated from scraped frontmatter
- [ ] Tier 3 local-nav anchors point at sections that exist
- [ ] No `pathnostics.com/wp-content/...` URLs left (migrated to `/assets/`)
- [ ] All asset filenames ASCII-only
- [ ] Closing CTA section present (green gradient, NOT recolored)
- [ ] Footer markup verbatim from homepage
- [ ] `git status --short` shows only the files you intend to push
- [ ] Push target is `qa-preview` (NEVER main)

---

## QUESTIONS BEFORE YOU START

If anything is unclear, ask the orchestrator BEFORE writing code.
Specifically check in if:

- A colorway assignment feels wrong for the content (e.g., navy on
  Barrett's might read too funereal — propose an alternative).
- The flagship-test 9-section structure doesn't fit a particular test
  (e.g., Anatomic Pathology is more of a service line than a single test).
- You want to add a section the anchor doesn't have (e.g., a specimen
  diagram for FISH/UroVysion that needs custom illustration).
