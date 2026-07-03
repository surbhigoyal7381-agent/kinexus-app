# How to add a new blog post

The blog is a set of static HTML pages — no build step, no database. Everything
is driven by one manifest file. Adding a post takes about five minutes.

## The layout

```
/blog.html              ← the listing page (auto-renders cards from posts.js)
/blog/blog.css          ← shared styles for the whole blog (edit once, restyle all)
/blog/posts.js          ← THE MANIFEST: one entry per post. Single source of truth.
/blog/post.js           ← shared script: auto prev/next + related on every post
/blog/_template.html    ← copy this to create a new post
/blog/<slug>.html       ← one file per post
/blog/feed.xml          ← RSS feed
```

## Steps to publish a new post

### 1. Create the post page
Copy `_template.html` to `blog/<your-slug>.html`.

- **slug** = the URL, lowercase with hyphens, e.g. `gst-changes-for-exporters`.
  The file becomes `https://www.kinexus.co.in/blog/gst-changes-for-exporters.html`.
- Open the new file and replace every `{{PLACEHOLDER}}` (search for `{{`).
- Write the article inside `<div class="post-body"> … </div>`. Use `<p>` for
  paragraphs, `<h2>` for section headings, and the `.callout` box for a
  "what to do about it" list. Keep `data-slug` on `<body>` equal to the slug.

### 2. Add ONE entry to `posts.js`
Put it at the **top** of the `KINEXUS_POSTS` array (newest first):

```js
{
  slug: "gst-changes-for-exporters",
  title: "What the new GST slabs mean for exporters",
  excerpt: "One or two sentences shown on the listing card.",
  category: "Engineering & Auto",   // must match a value in KINEXUS_CATEGORIES
  date: "2026-08-12",               // YYYY-MM-DD, drives ordering
  readMins: 4,
  emoji: "🧾",
  tags: ["GST", "exports", "compliance"]
},
```

That's what makes the card appear on `/blog.html`, and it auto-wires the
prev/next links and "related" cards on the post pages. **No other file needs
editing for the post to be live and linked.**

Need a new category? Add it to `KINEXUS_CATEGORIES` at the top of `posts.js`
(it becomes a filter button automatically).

### 3. (Recommended) Tell search engines
These two are optional — the post works without them — but they help SEO:

- **`/sitemap.xml`** — add a `<url>` block for the post (copy an existing blog one).
- **`/blog/feed.xml`** — add an `<item>` at the top (copy an existing one) and
  update `<lastBuildDate>`.

## What you get automatically per post
- Unique `<title>`, meta description, canonical URL
- Open Graph + Twitter cards (nice link previews when shared)
- JSON-LD `BlogPosting` + `BreadcrumbList` structured data (rich results)
- Google Analytics tag
- Prev/next navigation and 3 related posts (same category)
- Responsive layout, WhatsApp button, consistent nav/footer

## Tips
- **Title length:** aim ~50–60 characters for the `<title>` and ~150–160 for the
  meta description — that's what search engines display without truncating.
- **Dates:** use real publish dates; ordering everywhere is by `date`.
- **Restyling:** change `blog/blog.css` once and every post updates.
- **Preview locally:** open `blog.html` in a browser. (Card rendering needs the
  site served from the domain root because paths are root-relative, e.g.
  `/blog/...`. On the live MilesWeb host this is automatic.)
