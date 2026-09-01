# Kinexus-app

Static website for **Kinexus Systems** — custom digital solutions and agentic AI
workflows for businesses that have outgrown spreadsheets. Kinexus Systems is an
AllAboutHR company, and this repository also carries the group's two sibling
pages.

## The house

The site follows *The House Brand Board* (v1.0, 24 August 2026). One house,
three streams, each with its own lead colour:

| Stream | Page | Lead colour | Type voice |
| --- | --- | --- | --- |
| AllAboutHR — strategic HR consulting | `allabouthr.html` | the gradient | heavy caps |
| Alvora — HR technology | `alvora.html`, `alvora-hire.html` | plum `#933686` | heavy caps + lighter teal product word |
| Kinexus Systems — operations excellence | `index.html` | teal `#0174A0` | light, wide-tracked caps |

Two rules from the brand board are load-bearing and must not be broken:

1. **Body copy is Ink (`#2B2130`).** Plum and teal pass AA but fail AAA, so they
   are for headings, links and accents — never paragraphs.
2. **Never set plum on teal, or teal on plum.** The pair is 1.29:1, effectively
   invisible. The house gradient never sits behind text either, because the
   contrast changes across it and one end always fails.

Reversed panels use plum-dark `#6E2564` (white on it is 9.94:1); white on plum
`#933686` is 3.1:1 and fails.

## Quick start

- Open `index.html` in a browser, or run `python3 -m http.server` from the repo
  root and visit `http://localhost:8000/`.

## Files of interest

- `index.html` — Kinexus homepage: the two services (custom digital solutions,
  agentic AI workflows), proof, and the house
- `allabouthr.html` — the AllAboutHR Growth Loop: five stages, seventeen
  programmes, and the pain statements that open each of them
- `alvora.html` — the Alvora platform line: Alvora HRMS, Hire, Gig, Learning
- `alvora-hire.html` — the Alvora Hire product page
- `portfolio.html`, `blog.html`, `blog/` — portfolio and Insights
- `engineering.html`, `textiles.html`, `wellness.html`, `people.html` — earlier
  industry pages, kept and re-skinned but no longer in the primary navigation
- `assets/brand.css` — design tokens and shared components for the three house
  pages. Streams are switched with `data-stream="kinexus|alvora|allabouthr"` on
  `<body>`
- `assets/fonts.css` + `assets/fonts/` — Poppins, Source Sans 3 and IBM Plex
  Mono, self-hosted so pages never wait on a third party. All three are SIL
  Open Font License
- `assets/site.js` — sticky nav, mobile menu, scroll reveal, lead form
- `assets/*-mark.png`, `assets/*-logo-*.png` — the three marks plus reversed
  (white) versions for dark grounds
- `archive/`, `assets/Archive/` — previous market-positioning sites (kept for
  reference, not deployed)
- `sitemap.xml`, `robots.txt`, `CNAME` — SEO and domain config

## Pain statements and the WhatsApp call to action

No fees, plans or packages are published anywhere on the site. In their place
every page carries the audience's own sentences, each one a link to
`wa.me/919876701788` with that sentence already URL-encoded into the message —
so a visitor who recognises their week arrives in the chat with the problem
statement written for them and nothing to fill in. Every section closes with a
green "none of these — here's ours" button that opens an open-ended message.

Two implementations, same idea: `.pain` cards from `assets/brand.css` on the
three house pages and on `alvora-hire.html`, and the existing "Reality" cards
on the industry pages, which became anchors carrying the same links.

To add one, copy an existing `.pain` anchor and encode the new sentence into
the `text=` parameter — the visible text and the message must stay identical,
or the person appears to say something they never read.

## Logos

The marks in `assets/` are extracted from the approved brand board artwork,
which is raster — good for web at the sizes used here. Vector originals are in
progress and should replace these for print, signage and embroidery. The Alvora
Hire lockup is composed from the Alvora mark plus the product word set in
Poppins; `assets/alvora-hrms-logo.png` is the stacked Alvora HRMS lockup as
supplied.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which publishes the
site to MilesWeb hosting (`kinexus.co.in`) over FTP. It can also be run manually
via the `workflow_dispatch` trigger.

Repository: https://github.com/surbhigoyal7381-agent/kinexus-app
