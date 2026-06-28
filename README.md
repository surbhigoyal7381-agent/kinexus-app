# Kinexus-app

Static website for Kinexus Systems — the Digital Export Engine.

Quick start

- Open `index.html` in a browser to view the site locally.

Deploy

- Pushing to `main` triggers `.github/workflows/deploy.yml`, which publishes the
  site to MilesWeb hosting (`kinexus.co.in`) over FTP. It can also be run
  manually via the workflow_dispatch trigger.

Files of interest

- `index.html` — homepage (self-contained, inline CSS/JS)
- `blog.html` — Insights page (self-contained, articles rendered client-side)
- `assets/` — images and the export-readiness playbook PDF
- `assets/Archive/` — previous market-positioning site (kept for reference, not deployed)
- `sitemap.xml`, `robots.txt`, `CNAME` — SEO and domain config

Repository: https://github.com/surbhigoyal7381-agent/kinexus-app

—
Generated README
