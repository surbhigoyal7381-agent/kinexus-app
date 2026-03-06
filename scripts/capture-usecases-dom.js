const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  try {
    const outDir = path.resolve(__dirname, '../tmp');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);

    const url = 'http://localhost:3000';
    console.log('Opening', url);
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Clear localStorage overrides so code-seeded use cases are visible
    await page.evaluate(() => {
      try {
        localStorage.removeItem('kinexus_useCases');
        localStorage.removeItem('kinexus_industries');
      } catch (e) {
        // ignore
      }
    });
    // Reload to ensure app picks up the cleared localStorage
    await page.reload({ waitUntil: 'networkidle2' });

    // Click the 'Use Cases' button in the navbar (if present)
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => /use cases/i.test(b.innerText));
      if (btn) btn.click();
    });

    // Wait for the Use Cases heading to appear
    await page.waitForFunction(() => {
      const h = document.querySelector('h1');
      return h && /library of/i.test(h.innerText);
    }, { timeout: 10000 });

    // Allow a short render delay
    await new Promise((res) => setTimeout(res, 500));

    // Attempt to select the use-cases grid container
    const html = await page.evaluate(() => {
      const grid = document.querySelector('.max-w-7xl.mx-auto.px-6.grid');
      if (grid) return grid.outerHTML;
      // fallback: return main content
      const main = document.querySelector('main') || document.body;
      return main.outerHTML;
    });

    const outFile = path.resolve(outDir, 'usecases-snapshot.html');
    fs.writeFileSync(outFile, html, 'utf8');
    console.log('Saved snapshot to', outFile);

    // Also take a full-page screenshot for quick preview
    try {
      const imgOut = path.resolve(outDir, 'usecases-snapshot.png');
      await page.screenshot({ path: imgOut, fullPage: true });
      console.log('Saved screenshot to', imgOut);
    } catch (sErr) {
      console.warn('Screenshot failed:', sErr && sErr.message);
    }

    console.log(html);
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Error capturing DOM:', err);
    process.exit(2);
  }
})();
