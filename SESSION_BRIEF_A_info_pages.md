# Session Brief A — Info Pages (~10 pages)

## YOUR JOB IN ONE SENTENCE

Build the static-content sub-pages (About, Our Team, Careers, etc.) using the
**`templates/info-page.html`** anchor, populate them from the scraped WP content,
and push to the `qa-preview` branch. Do not push to `main`.

---

## READ FIRST

1. **`CLAUDE.md`** in this directory — already auto-loaded by Claude Code. Read
   it end-to-end before doing anything.
2. **`templates/info-page.html`** — the anchor template. It is also a
   working `/about/` page. Your first deliverable is a verbatim sync of this to
   `tests/guidance-uti/`-style URL — no, wait, to `/about/index.html`. See workflow.
3. **`css/info-page.css`** — page-specific styles. You don't need to modify this
   for most pages; reuse the existing classes.
4. **The Guidance UTI page** (`tests/guidance-uti/index.html`) — this is the
   sibling sub-page. Look at it for design vocabulary cues.

---

## YOUR SCOPE — exactly these slugs, no others

Build these sub-pages (in priority order):

| Slug to build | Output path | Scraped source (absolute path) |
|---|---|---|
| `/about/` | `/about/index.html` | `/Users/msm_macstudio/MSM Dropbox/Melyssa St. Michael/CoWork/Pathnostics/dev_web-old-website-scrape/pages/about/content.md` |
| `/our-team/` | `/our-team/index.html` | `.../pages/our-team/content.md` |
| `/careers/` | `/careers/index.html` | `.../pages/careers/content.md` |
| `/innovation/` | `/innovation/index.html` | `.../pages/innovation/content.md` |
| `/veterans/` | `/veterans/index.html` | `.../pages/veterans/content.md` *(may not exist — see "if scraped content missing")* |
| `/customer-care/` | `/customer-care/index.html` | `.../pages/customer-care/content.md` |
| `/billing/` | `/billing/index.html` | `.../pages/billing/content.md` |
| `/order-supplies/` | `/order-supplies/index.html` | `.../pages/order-supplies/content.md` |
| `/patient-resources/` | `/patient-resources/index.html` | `.../pages/patient-resources/content.md` |
| `/clinical-resources/` | `/clinical-resources/index.html` | `.../pages/clinical-resources/content.md` |
| `/payors/` | `/payors/index.html` | `.../pages/payors/content.md` |

**Do not** build any other slugs. **Do not** touch:

- `/index.html` (homepage)
- `/coming-soon.html`
- `/vercel.json`
- `/tests/guidance-uti/` (already built by orchestrator)
- `/templates/` (don't modify the anchor template)
- Pages in another session's scope (Session B owns publications, knowledge center, news)

---

## WORKFLOW PER PAGE

For each slug in your list:

1. **Read the scraped content.** Path is in the table above. Note the frontmatter
   (`title`, `meta_description`, `h1`, `parent_url`) and the markdown body.
2. **Verify the content.** If word_count is 0 or the body is empty, see
   "if scraped content missing" below before building.
3. **Copy the template.** Make a new directory at the output path and copy
   `templates/info-page.html` to `<slug>/index.html` in the Dropbox folder.
   Use Bash like:
   ```bash
   mkdir -p "/Users/msm_macstudio/MSM Dropbox/Melyssa St. Michael/CoWork/Pathnostics/prod_website/<slug>"
   cp "/Users/msm_macstudio/MSM Dropbox/Melyssa St. Michael/CoWork/Pathnostics/prod_website/templates/info-page.html" "/Users/msm_macstudio/MSM Dropbox/Melyssa St. Michael/CoWork/Pathnostics/prod_website/<slug>/index.html"
   ```
4. **Update the head metadata.** Replace `<title>` and `<meta name="description">`
   with the scraped frontmatter values. Keep the company suffix: `<title>X — Pathnostics</title>`.
5. **Replace the page-specific content sections.**
   - Hero (Section 1): overline, H1, lede, body, CTAs. Keep CTA destinations
     pointing at `/contact/?type=...` and a relevant secondary anchor.
   - Mission/statement (Section 2): use this for any "values" or "intro" content.
     Skip if not applicable.
   - Two-column cohort (Section 3): use for any "list of two related groups"
     pattern. Skip if not applicable.
   - Add `.ip-content` blocks (see `css/info-page.css`) for long-form text content
     that doesn't fit a special pattern.
   - Use `.ip-team` for Our Team-style profile grids.
   - Use `.ip-jobs` for the Careers job listing pattern.
6. **Update the local-nav (Tier 3).** Anchors must point to sections that EXIST
   on this page. Replace the `#mission` / `#who-we-serve` placeholders with
   real anchors for your page's sections. Drop any that don't apply.
7. **Add references section** ONLY IF the scraped content has citations.
   Use the commented `<section class="references">` block at the bottom of the
   template (uncomment and fill in). Match the homepage's pattern: numbered list,
   white text on green gradient.
8. **Migrate images and PDFs.** If the scraped content references
   `https://pathnostics.com/wp-content/uploads/...`, download the asset and place
   it in `/assets/<sensible-folder>/<ascii-name>.<ext>`. Update the reference to
   absolute `/assets/...` path. **Filenames must be ASCII only — no `®`, brackets,
   plus signs, etc.** Use Bash `curl` or `wget` to download.
9. **Verify locally** with the preview MCP if available, or by reading the file
   structure and known patterns. The preview server is on port 8080.
10. **Sync to clone.** Copy your file(s) to `~/Code/pathnostics-website/` matching
    the same structure.
11. **Commit and push to qa-preview** (the clone's working branch is qa-preview):
    ```bash
    cd ~/Code/pathnostics-website
    git add <slug>/index.html  # explicit filename, never git add -A or .
    git add assets/<any-new-assets>  # if you migrated images/PDFs
    git commit -m "Add /<slug>/ info page

    Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
    git push origin qa-preview
    ```
12. **Move to the next slug.**

---

## DESIGN MANDATES (from orchestrator)

These are non-negotiable. Cribbed from CLAUDE.md plus orchestrator additions:

1. **Nav identical to homepage** — every page must include GSAP + ScrollTrigger
   CDN tags (already in template; don't remove). Tier 1, Tier 2, Tier 3 all
   present. Mobile drawer markup verbatim from homepage.
2. **Last content section parallaxes over the navy footer** — automatic when
   GSAP loads + footer markup matches homepage. Already wired up in template.
3. **References per page** — only when scraped content has citations. Use the
   homepage pattern (commented in template).
4. **Copy = 90% of original** — preserve substance. Headers can be reframed in
   the new clinical-confident voice (look at the Guidance UTI hero for tone
   reference). Body text stays largely as-is unless awkward in the new layout.
5. **Asset filenames ASCII only.** Vercel CDN won't reliably serve `®`,
   brackets, plus signs, spaces in URLs. Rename before placing in `/assets/`.
6. **All asset/CSS/JS paths absolute** (`/assets/...`, `/css/...`, `/js/...`).
7. **Each page has unique `<title>` and `<meta description>`** — pull from
   scraped frontmatter.
8. **Mobile drawer markup is identical to homepage** — copy/paste verbatim.
9. **Cross-page references — preserve internal links** even if the linked
   page doesn't exist yet. We catch 404s in QA.
10. **Image migration policy** — default to migrate images from
    `pathnostics.com/wp-content/uploads/...` to local `/assets/`. Exception:
    very large hero images flagged with a `<!-- TODO: optimize -->` comment.
11. **Hard scope walls** — see "DO NOT TOUCH" list above.
12. **Pages that link to unbuilt pages** — leave the link, add
    `<!-- TODO: page not built yet -->` comment near it.

---

## IF SCRAPED CONTENT IS MISSING / EMPTY

Some scraped pages have 0 word count or no `content.md`. Decide between:

- **Skip the page.** Note in the handoff log. Move on.
- **Build a placeholder.** Hero with the slug-derived title + a single
  `<p>` saying `[PLACEHOLDER — content from JMS pending]` + the standard
  closing CTA + footer. Mark in the handoff log as needing copy.

When in doubt, skip. Don't fabricate substantive copy.

---

## STOP CONDITIONS — when to ask the orchestrator

Pause and ask if:

- A page's content needs a section type the template doesn't have (and
  before writing custom CSS for it, check whether `css/info-page.css` already
  has a pattern that fits — `.ip-team`, `.ip-jobs`, `.ip-content`, etc.).
- A reference is in the source but you can't tell which sentence it supports.
- You're about to delete or modify any file outside your scope (don't).
- A scraped image is corrupted, missing, or fails to download.
- You hit 5+ pages and feel like the design is drifting from the anchor.
  Stop and ask for a checkpoint review.

---

## HANDOFF LOG

After each push, append a line to `SESSION_LOG.md` in the Dropbox root:

```
[2026-05-XX HH:MM] Session A built /<slug>/  — pushed <commit-sha>  — <notes>
```

When fully done with your scope, push your final commit and write a closing
line in `SESSION_LOG.md`:

```
[2026-05-XX HH:MM] Session A COMPLETE — built N pages, M skipped, K placeholders.
                   Awaiting orchestrator review and cherry-pick to main.
```

Do **not** cherry-pick to main yourself. The orchestrator handles that.

---

## CHECKLIST BEFORE EACH PUSH

- [ ] File path matches output path table (e.g., `/about/index.html`, not `/about.html`)
- [ ] `<title>` and `<meta description>` updated from scraped frontmatter
- [ ] Local-nav anchors updated to point at sections that exist
- [ ] References section uncommented + filled in IF page has citations
- [ ] No `pathnostics.com/wp-content/...` URLs left in the page (migrated to `/assets/`)
- [ ] All asset filenames ASCII-only
- [ ] Closing CTA section present (always required)
- [ ] Footer present (verbatim from homepage)
- [ ] Tested with `git status --short` that you're staging only the files you intend
- [ ] Push target is `qa-preview` (NEVER main)

---

## QUESTIONS BEFORE YOU START

If anything in this brief is unclear, ask the orchestrator BEFORE writing any
code. A two-minute clarification beats an hour of rework.
