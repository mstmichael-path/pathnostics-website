# Session Brief B — Listing Pages + Article Detail Pages

## YOUR JOB IN ONE SENTENCE

Build the three index/listing pages (Publications, UTI Knowledge Center,
News & Events) plus all the individual article/post detail pages
underneath them. Push to the `qa-preview` branch. Do not push to `main`.

---

## READ FIRST

1. **`CLAUDE.md`** in this directory — already auto-loaded. Read end-to-end.
2. **`tests/guidance-uti/index.html`** — the orchestrator's flagship anchor
   page. Look at it for design vocabulary cues (Playfair headings with italic
   accents, overline style, button treatments, references-section pattern).
3. **`templates/info-page.html`** + **`css/info-page.css`** — the info-page
   anchor (Session A's template). Reuse the hero pattern (`.ip-hero`) where
   it makes sense for your listing pages too. Don't duplicate the nav/footer
   markup design — copy it verbatim from the info-page template.
4. **`SESSION_BRIEF_A_info_pages.md`** — read for context and shared mandates.
   Items 1–12 in the "DESIGN MANDATES" section apply equally to you.

---

## YOUR SCOPE — exactly these slugs, no others

### 1) Three index/listing pages

| Slug | Output path | Scraped source |
|---|---|---|
| `/guidance-uti-publications/` | `/guidance-uti-publications/index.html` | `dev_web-old-website-scrape/pages/guidance-uti-publications/content.md` |
| `/uti-knowledge-center/` | `/uti-knowledge-center/index.html` | `.../pages/uti-knowledge-center/content.md` |
| `/news/` | `/news/index.html` | *(may need to derive from sitemap.json — see below)* |

### 2) All child detail pages

The scrape contains ~150 individual post pages. They fall into three groups:

- **Publications** — peer-reviewed citations and download links. Identify by
  scanning `dev_web-old-website-scrape/sitemap.json` for entries with academic
  paper titles or `parent_url` pointing at `/guidance-uti-publications/`.
- **Knowledge Center articles** — educational long-form content. Identify by
  `parent_url` pointing at `/uti-knowledge-center/` or topical urinary-tract
  content with substantive word counts.
- **News & Events posts** — press releases, awards, conference news. Identify
  by post date in title (e.g., "...wins 2023 Award", "...announces publication").

**You must read `dev_web-old-website-scrape/sitemap.json` first** and bucket
the 150-ish posts into these three groups. If a post genuinely doesn't fit
any of the three, add a TODO comment in `SESSION_LOG.md` and SKIP it — don't
build orphan pages.

Output paths for detail pages: keep the same slug as scraped, served at the
top-level URL (matching what the WP site did):

- `/<slug>/index.html` for each individual post

(e.g., `/guidance-uti-evidence-summary/index.html`,
`/new-york-state-approves-pathnostics-guidance-uti-test/index.html`)

The full URL list comes from the sitemap. Don't invent paths; preserve them
for SEO continuity.

### Do not touch

- `/index.html`, `/coming-soon.html`, `/vercel.json`
- `/tests/guidance-uti/`
- `/templates/` (don't modify the anchor template)
- Any page in Session A's scope (about, our-team, careers, innovation,
  veterans, customer-care, billing, order-supplies, patient-resources,
  clinical-resources, payors)

---

## TEMPLATES YOU NEED TO BUILD

The orchestrator pre-built `info-page` for Session A. You build two:

### Template 1: `templates/listing-page.html`

For the three index pages. Structure:

1. **Hero** — Reuse `.ip-hero` from `info-page.css`. Title states the
   collection (e.g., "Guidance® UTI Publications"). Lede describes the
   collection. No image needed.
2. **Filter / category strip** *(optional)* — if there are multiple
   sub-categories worth surfacing as filters (e.g., "Clinical Outcomes",
   "Patient Care", "Antibiotic Stewardship" for publications), show as
   a horizontal pill/chip strip. Skip if only one category.
3. **Card grid** — responsive grid of cards. Each card:
   - Tag (small overline, e.g., "AUA Cited" or "2024")
   - Title (Playfair, weight 400, link to detail page)
   - 1–2 line description / excerpt
   - "Read more →" or "Download PDF →" CTA
4. **Pagination** *(optional)* — if more than ~30 cards, paginate. Skip for
   smaller collections.
5. **Closing CTA** — green section, "Talk to a Rep". Required.
6. **Footer** — verbatim from homepage.

References section: only if the index page itself has citations (rare for
indexes). Detail pages are where references live.

### Template 2: `templates/article-detail.html`

For individual publication / KC article / news post pages. Structure:

1. **Hero** — narrower than listing-page hero. Just:
   - Overline ("Publication" or "Knowledge Article" or "News")
   - Title (Playfair, italicized accent if a phrase warrants it)
   - Date (for news), or journal citation (for publications), or
     reading time (for KC articles)
   - Optional: 1-line lede
2. **Article body** — long-form content rendered from the markdown. Reuse
   the `.ip-content__body` styling pattern from `info-page.css`. This already
   handles h2/h3, paragraphs, lists, links, images. Generous max-width
   (~720px) for readability.
3. **Inline CTA** *(optional)* — for publications, a "Download PDF" or
   "View on Journal Site" button. For news, a "Back to all news" link.
4. **References section** — if the source has citations (most publications do).
   Use homepage pattern (green gradient + lime accent + numbered list).
5. **Closing CTA** — green section, "Talk to a Rep". Required.
6. **Footer** — verbatim from homepage.

Build template HTML files at `templates/listing-page.html` and
`templates/article-detail.html`. Build CSS at `css/listing-page.css` and
`css/article-detail.css`. Reuse `.ip-hero`, `.ip-content`, `.references`,
`.closing-cta` where they fit — only add new classes for genuinely new
patterns (the card grid, the filter strip, the article meta line).

---

## WORKFLOW PER PAGE

### For listing index pages (3 of them)

1. Read scraped content.md.
2. Read sitemap.json. Filter to entries that belong in this listing.
3. Copy your template, populate hero + grid of cards (one card per child entry).
4. Save to `<slug>/index.html` in the Dropbox folder.
5. Sync to clone, commit on qa-preview, push.

### For detail pages (~150 of them)

This is volume work. Recommended flow:

1. Read sitemap.json once. Bucket pages into Publications / KC / News.
2. For each bucket, write a small Python script (in
   `dev_web-old-website-scrape/build_<bucket>.py`) that:
   - Iterates through the bucket's slugs
   - Reads each `pages/<slug>/content.md`
   - Renders markdown to HTML
   - Substitutes into `templates/article-detail.html`
   - Writes output to `<slug>/index.html` in the Dropbox folder
3. Run the script. Spot-check 2–3 generated pages by eye + preview server.
4. If output looks right, sync the directory to clone:
   ```bash
   rsync -av "/Users/msm_macstudio/MSM Dropbox/Melyssa St. Michael/CoWork/Pathnostics/prod_website/<bucket-folder>/" ~/Code/pathnostics-website/<bucket-folder>/
   ```
   *(or copy individual files if rsync feels too broad)*
5. Stage explicit filenames, commit on qa-preview, push.

**Important:** the build scripts live in `dev_web-old-website-scrape/`, NOT in
`prod_website/` (per CLAUDE.md, prod_website should not contain build steps).
The OUTPUT goes to prod_website. The script is one-time generation tooling.

---

## DESIGN MANDATES

Same as Session A. See `SESSION_BRIEF_A_info_pages.md` items 1–12 in the
"DESIGN MANDATES" section. Highlights:

- Nav identical to homepage. GSAP + ScrollTrigger CDN required.
- Last section parallaxes over navy footer.
- References per page when source has citations.
- Copy = 90% of original. Headers reframed in clinical-confident voice OK,
  body text largely preserved.
- ASCII filenames, absolute paths, unique title/meta per page.
- Mobile drawer copied verbatim from homepage.

---

## STOP CONDITIONS — when to ask the orchestrator

Pause and ask if:

- A pubication has a paywalled or broken DOI link.
- A scraped post doesn't fit any of Publications / KC / News.
- You're about to write a build script — confirm the script approach with
  the orchestrator before writing 200 lines of generation code.
- You hit a stylistic decision that affects all 150 detail pages
  (e.g., date format, citation format, "share on social" treatment).
  Lock it once, apply consistently.
- Your build script is producing output that looks broken in 5+ pages —
  stop, fix the script, regenerate.

---

## HANDOFF LOG

Append to `SESSION_LOG.md` after each push:

```
[2026-05-XX HH:MM] Session B built /<slug>/  — pushed <commit-sha>  — <notes>
```

When fully done with your scope:

```
[2026-05-XX HH:MM] Session B COMPLETE
                   - Built 3 listing index pages
                   - Generated N publication detail pages
                   - Generated M KC article pages
                   - Generated K news post pages
                   - L pages skipped (see notes above)
                   Awaiting orchestrator review and cherry-pick to main.
```

Do not cherry-pick to main yourself. Orchestrator handles that.

---

## QUESTIONS BEFORE YOU START

If anything in this brief is unclear, ask the orchestrator BEFORE writing any
code. Specifically check in if:

- The card grid design (image / no image / overline color) needs an opinion.
- The bucketing of "what counts as a publication vs news vs KC article"
  has edge cases.
- You want to deviate from the article-detail template structure for a
  specific content type.
