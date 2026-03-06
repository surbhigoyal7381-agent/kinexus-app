#!/usr/bin/env node
/*
 * Fetch Google Docs from a Drive folder and convert them to JSON use-case files.
 * Usage:
 *   1. Create a Google service account and download the credentials JSON.
 *   2. Share the Drive folder with the service account email (viewer).
 *   3. Set env var: GOOGLE_APPLICATION_CREDENTIALS=path/to/creds.json
 *   4. Run: node scripts/fetch-drive-usecases.js <DRIVE_FOLDER_ID>
 *
 * The script exports each Google Doc as plain text, attempts to parse fields like
 * Title / Industry / Icon / Gap / Pain / Solution / Metrics and writes one JSON
 * file per doc to `data/usecases/`. The parser is heuristic; review outputs.
 */

const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');

async function main() {
  const folderId = process.argv[2];
  if (!folderId) {
    console.error('Usage: node scripts/fetch-drive-usecases.js <DRIVE_FOLDER_ID>');
    process.exit(1);
  }

  const outDir = path.resolve(__dirname, '../data/usecases');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Auth using Application Default Credentials (service account JSON via env)
  const auth = new google.auth.GoogleAuth({ scopes: ['https://www.googleapis.com/auth/drive.readonly'] });
  const client = await auth.getClient();
  const drive = google.drive({ version: 'v3', auth: client });

  // List files in folder
  const files = [];
  let pageToken = null;
  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType)',
      pageToken
    });
    (res.data.files || []).forEach(f => files.push(f));
    pageToken = res.data.nextPageToken;
  } while (pageToken);

  console.log('Found', files.length, 'files in folder');

  for (const f of files) {
    try {
      if (f.mimeType === 'application/vnd.google-apps.document') {
        const exportRes = await drive.files.export({ fileId: f.id, mimeType: 'text/plain' }, { responseType: 'stream' });
        let text = '';
        await new Promise((resolve, reject) => {
          exportRes.data.on('data', chunk => text += chunk.toString('utf8'));
          exportRes.data.on('end', resolve);
          exportRes.data.on('error', reject);
        });

        const parsed = parseDocText(text);
        // ensure an id
        const safeId = (parsed.id || parsed.title || f.name || 'uc').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const outPath = path.join(outDir, `${safeId}.json`);
        fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2), 'utf8');
        console.log('Wrote', outPath);
      } else {
        console.log('Skipping non-doc file:', f.name, f.mimeType);
      }
    } catch (err) {
      console.warn('Failed to process', f.name, err.message);
    }
  }

  // Optionally run import script if present
  const importer = path.resolve(__dirname, './import-usecases.js');
  if (fs.existsSync(importer)) {
    console.log('Running import script to combine JSONs...');
    try { require(importer); } catch (e) { console.warn('import script failed:', e.message); }
  }
}

function parseDocText(text) {
  // Heuristic parser for simple 'Key: Value' formatted docs.
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter((l, i, arr) => !(l === '' && (i === 0 || i === arr.length - 1)));
  const result = { metrics: [] };

  // Extract Key: Value lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const kv = line.match(/^([A-Za-z ]{2,30}):\s*(.+)$/);
    if (kv) {
      const key = kv[1].trim().toLowerCase();
      const val = kv[2].trim();
      switch (key) {
        case 'title': result.title = val; break;
        case 'industry': result.industry = val; break;
        case 'icon': result.icon = val; break;
        case 'gap': result.gap = val; break;
        case 'pain': result.pain = val; break;
        case 'solution': result.solution = val; break;
        case 'metrics': {
          // metrics may be CSV on same line
          result.metrics = val.split(/[;,]\s*/).map(s => s.trim()).filter(Boolean);
          break;
        }
        case 'id': result.id = val; break;
        default: result[key] = val; break;
      }
      continue;
    }

    // detect bullet list metrics after a 'Metrics' header on previous line
    if (/^metrics\s*[:]?$/i.test(lines[i - 1] || '')) {
      if (/^[-*\u2022]\s+/.test(line)) result.metrics.push(line.replace(/^[-*\u2022]\s+/, '').trim());
      else if (/^\d+[.)]\s+/.test(line)) result.metrics.push(line.replace(/^\d+[.)]\s+/, '').trim());
    }
  }

  // Fallbacks: if title missing, use first non-empty line
  if (!result.title && lines.length) result.title = lines[0];
  if (!result.industry) result.industry = 'Healthcare'; // default if unknown
  result.metrics = result.metrics || [];
  return result;
}

main().catch(err => { console.error(err); process.exit(1); });
