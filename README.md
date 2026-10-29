# Daniel Oliveira — Portfolio

Professional portfolio of Daniel Oliveira: data analytics, data engineering,
data science and AI automation, told through business problems, solutions and
verified impact.

**Live:** https://agentealfredoclaw.github.io/portfolio/

## Stack

- **[Astro 7](https://astro.build/) + TypeScript** — static-first: every page is
  pre-rendered HTML, so GitHub Pages serves real files for every route (no 404 on
  refresh, no client router) and pages ship almost no JavaScript.
- **CSS design tokens** — ORDIVOX brand primitives, [Open Props](https://open-props.style/)
  and [Utopia](https://utopia.fyi/) fluid scales. See [DESIGN_TOKENS.md](DESIGN_TOKENS.md).
- **Vanilla WebGL** for the light ribbons in the hero and the contact section (one fragment shader, no libraries).
- **Self-hosted fonts** (Manrope, Inter). No analytics, no tracking, no backend.

## Run it

```bash
npm ci
npm run dev          # http://localhost:4321
npm run build        # static site in dist/
npm run preview      # serve dist/
npm run check        # TypeScript and Astro diagnostics
npm run tokens:utopia  # regenerate src/styles/tokens/utopia.css
```

Requires Node 22.23 or newer (CI uses Node 24).

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and
publishes it with GitHub Pages (repository **Settings → Pages → Source: GitHub
Actions**). The workflow reads the real Pages URL from `actions/configure-pages`
and passes it to the build as `SITE_URL` and `BASE_PATH`, so the same code works
for a project site (`/portfolio/`), a `<user>.github.io` repository or a custom
domain without changes.

## Where to edit

| What | File |
|---|---|
| Name, metadata, CV file, email, LinkedIn, GitHub, navigation, header call to action | `src/content/site.ts` |
| Intro line, hero, About text, section headings, contact copy | `src/content/profile.ts` |
| The three areas of expertise (cards, badges, category pages, skills in scope) | `src/content/expertise.ts` |
| Projects and case studies | `src/content/projects.ts` |
| Project images | `src/assets/projects/<slug>/` (imported in `projects.ts`) |
| Professional experience (cards and pages) | `src/content/experience.ts` |
| Education and certifications (home cards and the `/education/` timeline) | `src/content/education.ts` |
| Education page copy: caption, placeholder for courses without a summary | `src/content/profile.ts` → `educationPage` |
| CV PDF | replace `public/cv/Daniel-Oliveira-CV.pdf` (same name) |
| Social preview image | `public/og/daniel-oliveira-og.jpg` (1200 × 630) |
| Colours, type, spacing, motion, WebGL parameters | `src/styles/tokens/semantic.css` |
| Breakpoints | `src/styles/media.css` |
| Fluid type and space scales | `scripts/generate-utopia.mjs`, then `npm run tokens:utopia` |

Components never contain raw colours, sizes or durations — only tokens.

## Adding a project

1. Put images in `src/assets/projects/<slug>/` and import them at the top of
   `src/content/projects.ts`.
2. Add an object to the `projects` array:

```ts
{
  slug: 'churn-forecast',               // URL: /<category>/churn-forecast/
  category: 'data-science',             // automation | data-engineering-analytics | data-science
  title: 'Churn Forecast',
  origin: 'personal',                   // product | personal | professional (omit for planned work)
  status: 'in-development',             // published | in-development | coming-soon
  summary: 'One or two sentences on the problem and the result.',
  tags: ['Python', 'scikit-learn', 'Forecasting'],
  links: [{ label: 'GitHub repository', href: 'https://github.com/…', external: true }],
  sections: {
    problem: [{ type: 'p', text: '…' }],
    objectives: [{ type: 'list', items: ['…'] }],
    architecture: [{ type: 'steps', items: [{ title: 'Ingestion', text: '…' }] }],
    methodology: [{ type: 'code', lang: 'sql', code: 'select …', caption: '…' }],
    results: [{ type: 'findings', items: [
      { kind: 'observed', text: '…' },
      { kind: 'interpretation', text: '…' },
      { kind: 'recommendation', text: '…' },
      { kind: 'open-question', text: '…' },
    ] }],
    limitations: [{ type: 'list', items: ['…'] }],
  },
},
```

3. Build. The category page, its card count, the case-study page, the sitemap
   and the “More in …” links update automatically.

**Status rules.** `published` and `in-development` generate a page from the
case-study template; `in-development` pages carry a work-in-progress banner.
`coming-soon` shows a card with no link (never a dead link), optionally with
`related` links to pages that give context. Sections you leave out render as
“Documentation in progress”. An optional `security` section appears only when
provided.

**Blocks** available in sections: `p`, `list`, `steps` (pipeline diagram),
`facts` (label/value table), `code`, `figure`, `gallery`, `note`
(`info` | `pending`) and `findings`, which labels each result as observed,
interpretation, recommendation or open question.

## Adding experience or education

Append an object to `experiences` (gets a card and a page at
`/experience/<slug>/`) or to `education` (gets a card in the masonry grid and a
row on `/education/`; both are sorted by date, most recent first, and the card
opens the page on its course at `/education/#<id>`). Add a `description` to a
course to fill its panel on the education page. The types in
`src/content/types.ts` list every field. Leave optional fields out rather than
guessing them.

## Content rules

- Facts come from the CV (`public/cv/`) and, for ORDIVOX, from its public
  repository. Nothing is added that those sources do not support.
- Figures carry their scope and source. Unvalidated work is marked as in
  development; planned work is marked as coming soon.
- ORDIVOX keeps its own identity on its case-study page; the portfolio uses the
  palette, not the ORDIVOX wordmark.

## Internationalisation

All copy lives in `src/content/`, and `site.lang` / `site.locale` set the
document language. To add a language, mirror the content files per locale
(e.g. `src/content/pt/…`) and add locale-prefixed routes under `src/pages/[lang]/`.

## Accessibility and motion

Semantic landmarks, a skip link, visible focus, keyboard-operable menu (Escape
closes it), 48px targets, WCAG AA contrast. On the first visit of a browser
session the home page opens with a short sequence on the hero's own ribbons
(`src/components/Intro.astro`); any key, click, touch or scroll fades it out. The education explorer is a set of
vertical tabs: hover or click a course, or move with the arrow keys, Home and
End (`src/scripts/explorer.ts`); without JavaScript every course panel is shown
in turn and the list links to them. With `prefers-reduced-motion: reduce`
the intro is skipped, the name appears immediately and the ribbons render one
still frame. Without WebGL a static gradient replaces the shader.

On the home page the hero name zooms out into the header as you scroll, and the
hero's Download CV button glides up and becomes the header's Get in Touch button;
the move lasts the whole hero and ends when the About band reaches the header
(`src/scripts/dock.ts`, timing in `DESIGN_TOKENS.md` → Motion). With reduced
motion nothing moves: the header's wordmark and button fade in instead. Without
JavaScript the header shows them from the start. Inner pages always show them.

The page closes on a centred statement: the contact section fills the space
between the header and a footer of the same height, with the statement in the
middle and the contact actions below it — reached by scrolling to the end or by
the Contact link alike.

## Structure

```
src/
├── content/        site, profile, expertise, projects, experience, education, types
├── components/     Hero, RibbonField, Intro, SiteHeader, SiteFooter, SectionHeading, cards, case/CaseBlocks…
├── layouts/        BaseLayout (meta, Open Graph, JSON-LD, intro gate)
├── pages/          index, education, [category]/index, [category]/[project], experience/[slug], 404, sitemap, robots
├── scripts/        ribbons.ts (WebGL ribbons), dock.ts (scroll dock into the header), explorer.ts (education page)
├── styles/         tokens, media queries, global styles
└── assets/         images processed by Astro (WebP, responsive sizes)
public/             CV, favicon, Open Graph image
```

## Missing content

- Profile photograph (none supplied, none used).
- Approved company imagery — experience covers are procedural placeholders.
- Institution for the *AI Engineer for Data Scientists Associate Certification*
  (not stated in the CV), start dates and descriptions for education records —
  until a course has a `description`, its panel on `/education/` says
  “Course summary coming soon.”
- ORDIVOX: usage, accuracy and time-saved metrics; a vector logo (only the
  763 × 124 raster reference exists); a public demo.
- Case studies: Starbucks (data sources, method, validated findings),
  Geospatial OOH Analytics, ETL & Business Intelligence, Market Investment
  Forecasting, RAG Knowledge Retrieval, Predictive Machine Learning.
- `robots.txt` only takes effect at a domain root (user site or custom domain).
