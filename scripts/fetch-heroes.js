const https = require('https');
const fs = require('fs');
const path = require('path');

const targets = {
  manufacturing: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1600&q=60',
  logistics: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1600&q=60',
  pharma: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=1600&q=60',
  'real-estate': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=60',
  retail: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=1600&q=60',
  energy: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1600&q=60',
  hospitality: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=1600&q=60',
  education: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=60'
};

const outDir = path.join(__dirname, '..', 'public', 'assets');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const download = (url, dst) => new Promise((res, rej) => {
  const file = fs.createWriteStream(dst);
  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      file.close();
      fs.unlink(dst, () => {});
      rej(new Error(`HTTP ${response.statusCode}`));
      return;
    }
    response.pipe(file);
    file.on('finish', () => file.close(res));
  }).on('error', (err) => {
    fs.unlink(dst, () => {});
    rej(err);
  });
});

(async () => {
  for (const [id, url] of Object.entries(targets)) {
    // force jpeg output from Unsplash to avoid WebP/unsupported formats
    const dst = path.join(outDir, `hero-${id}.jpg`);
    const fetchUrl = url + '&fm=jpg';
    try {
      console.log('Downloading', id);
      await download(fetchUrl, dst);
      console.log('Saved', dst);
    } catch (err) {
      console.error('Failed', id, err.message);
    }
  }
  console.log('Done.');
})();
