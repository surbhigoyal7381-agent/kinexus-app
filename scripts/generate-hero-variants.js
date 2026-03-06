const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.resolve(__dirname, '..', 'public', 'assets');
const widths = [480, 800, 1200, 1600];

async function processFile(file) {
  const basename = path.basename(file);
  // only process base hero files like hero-<id>.jpg
  if (!/^hero-[^-]+\.jpg$/i.test(basename)) return;
  const id = basename.replace(/^hero-(.+)\.jpg$/i, '$1');
  const input = path.join(ASSETS_DIR, basename);
  for (const w of widths) {
    const outName = `hero-${id}-${w}.jpg`;
    const outPath = path.join(ASSETS_DIR, outName);
    if (fs.existsSync(outPath)) {
      console.log(`Exists ${outName}`);
      continue;
    }
    try {
      await sharp(input).resize({ width: w }).jpeg({ quality: 80 }).toFile(outPath);
      console.log(`Saved ${outName}`);
    } catch (err) {
      console.error(`Failed ${outName}:`, err.message);
    }
  }
}

async function main() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error('Assets directory not found:', ASSETS_DIR);
    process.exit(1);
  }
  const files = fs.readdirSync(ASSETS_DIR).filter(f => f.toLowerCase().endsWith('.jpg'));
  for (const f of files) {
    await processFile(f);
  }
  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
