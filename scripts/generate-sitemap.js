const fs = require('fs');
const path = require('path');

const industries = [
  'manufacturing','logistics','pharma','real-estate','retail','banking','insurance','energy','healthcare','hospitality','education'
];

const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
const urls = [
  '/',
  '/about',
  '/services',
  '/use-cases',
  '/contact',
  ...industries.map(id => `/industry?id=${id}`)
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url>\n    <loc>${baseUrl}${u}</loc>\n  </url>`).join('\n')}\n</urlset>`;

const outDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap);
console.log('sitemap.xml written to public/');
