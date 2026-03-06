const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.resolve(__dirname, '..', 'public', 'assets');
const ids = ['manufacturing','logistics','pharma','real-estate','retail','banking','insurance','energy','healthcare','hospitality','education'];
const widths = [480,800,1200,1600];

async function checkFile(filePath) {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile() || stat.size === 0) return { exists: true, size: stat.size, valid: false, error: 'empty file' };
    try {
      const meta = await sharp(filePath).metadata();
      return { exists: true, size: stat.size, valid: true, info: meta };
    } catch (e) {
      return { exists: true, size: stat.size, valid: false, error: e.message };
    }
  } catch (e) {
    return { exists: false };
  }
}

(async () => {
  console.log('Checking hero assets in', ASSETS_DIR);
  for (const id of ids) {
    const base = `hero-${id}.jpg`;
    const status = {};
    status.variants = {};
    for (const w of widths) {
      const name = `hero-${id}-${w}.jpg`;
      const p = path.join(ASSETS_DIR, name);
      status.variants[name] = await checkFile(p);
    }
    const basePath = path.join(ASSETS_DIR, base);
    status.base = await checkFile(basePath);
    console.log('\n' + id + ':');
    for (const [name, st] of Object.entries(status.variants)) {
      if (st.exists) console.log(`  ${name}: exists, size=${st.size}, valid=${st.valid}${st.valid ? '' : `, err=${st.error}`}`);
      else console.log(`  ${name}: MISSING`);
    }
    if (status.base.exists) console.log(`  ${base}: exists, size=${status.base.size}, valid=${status.base.valid}${status.base.valid ? '' : `, err=${status.base.error}`}`);
    else console.log(`  ${base}: MISSING`);
  }
})();
