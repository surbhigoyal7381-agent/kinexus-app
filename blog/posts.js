/* ==========================================================================
   Kinexus Blog — posts manifest (single source of truth for the listing page)

   TO ADD A NEW POST:
   1. Copy blog/_template.html to blog/<your-slug>.html and fill it in.
   2. Add ONE entry to the TOP of the array below (newest first).
   3. (Optional) add the post URL to sitemap.xml and blog/feed.xml.

   Field reference:
     slug       file name without .html (also the post's URL: /blog/<slug>.html)
     title      post headline (used on cards)
     excerpt    1–2 sentence summary shown on the card
     category   must match one of the CATEGORIES list below for filtering
     date       ISO date "YYYY-MM-DD" (drives ordering + "published" label)
     readMins   estimated reading time in minutes
     emoji      icon shown on the card thumbnail
     tags       array of keyword strings (used for search)
   ========================================================================== */

window.KINEXUS_CATEGORIES = [
  "Engineering & Auto",
  "Hosiery & Textiles",
  "Pharma & Wellness"
];

window.KINEXUS_POSTS = [
  {
    slug: "buyers-first-question-is-proof-not-price",
    title: "The buyer's first question isn't price anymore. It's proof.",
    excerpt: "Serious apparel buyers now open with compliance and traceability, then move to price. Proof compounds — price gets you compared, proof gets you kept.",
    category: "Hosiery & Textiles",
    date: "2026-06-26",
    readMins: 3,
    emoji: "✅",
    tags: ["textiles", "traceability", "compliance", "buyer audit", "documentation"]
  },
  {
    slug: "audit-won-or-lost-in-your-records",
    title: "Your next audit will be won or lost in your records, not your lab",
    excerpt: "Most failed pharma inspections aren't about bad medicine — they're about bad records of good medicine. Close the gap at the source.",
    category: "Pharma & Wellness",
    date: "2026-06-24",
    readMins: 4,
    emoji: "📋",
    tags: ["pharma", "data integrity", "batch records", "audit", "GMP", "compliance"]
  }
];
