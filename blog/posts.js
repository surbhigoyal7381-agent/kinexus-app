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
    slug: "uk-ceta-zero-duty-auto-components",
    title: "The UK just dropped its tariff wall on your components",
    excerpt: "On 15 July 2026 the India–UK CETA takes UK duties on engineering and auto components to zero. The saving goes to whoever can prove their operations — fast.",
    category: "Engineering & Auto",
    date: "2026-07-03",
    readMins: 4,
    emoji: "⚙️",
    tags: ["CETA", "UK", "tariffs", "auto ancillaries", "rules of origin", "export"]
  },
  {
    slug: "ludhiana-uk-zero-duty-window",
    title: "Zero duty into the UK: Ludhiana's once-in-a-generation window",
    excerpt: "From 15 July 2026, UK duties of up to 12% on Indian knitwear vanish. The differentiator shifts from price to documented, auditable reliability.",
    category: "Hosiery & Textiles",
    date: "2026-07-02",
    readMins: 4,
    emoji: "🧵",
    tags: ["CETA", "UK", "textiles", "knitwear", "Ludhiana", "buyer audit"]
  },
  {
    slug: "pharma-us-tariff-rollercoaster-baddi",
    title: "Pharma's US tariff rollercoaster — what Baddi should actually do",
    excerpt: "US duty on Indian pharma has swung from 50% to 10% in a year. Stop building strategy on a quarterly number and build the operations every market rewards.",
    category: "Pharma & Wellness",
    date: "2026-07-01",
    readMins: 4,
    emoji: "💊",
    tags: ["pharma", "tariffs", "US", "Baddi", "CETA", "compliance", "export"]
  },
  {
    slug: "quoting-exports-amid-tariff-volatility",
    title: "How do you quote exports when tariffs change every quarter?",
    excerpt: "You can't control trade policy. You can control how fast you re-price accurately when it moves — and that's an operations skill, not a trade one.",
    category: "Engineering & Auto",
    date: "2026-06-28",
    readMins: 4,
    emoji: "📈",
    tags: ["tariffs", "costing", "pricing", "export", "landed cost"]
  },
  {
    slug: "buyers-first-question-is-proof-not-price",
    title: "The buyer's first question isn't price anymore. It's proof.",
    excerpt: "Global apparel buyers now open with compliance and traceability, then move to price. Proof compounds — price gets you compared, proof gets you kept.",
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
