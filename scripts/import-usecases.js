#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Usage: place JSON files (each a single use-case object or an array of objects)
// into ./data/usecases and run `node scripts/import-usecases.js`.

const srcDir = path.resolve(__dirname, '../data/usecases');
const outFile = path.resolve(__dirname, '../src/useCases.import.json');

if (!fs.existsSync(srcDir)) {
  console.error('Directory not found:', srcDir);
  console.error('Please download the Drive folder and place files into:', srcDir);
  process.exit(1);
}

const combined = [];
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.json'));
for (const file of files) {
  const p = path.join(srcDir, file);
  try {
    const content = fs.readFileSync(p, 'utf8');
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) combined.push(...parsed);
    else combined.push(parsed);
  } catch (err) {
    console.warn('Skipping', file, '— parse error:', err.message);
  }
}

fs.writeFileSync(outFile, JSON.stringify(combined, null, 2), 'utf8');
console.log('Wrote', outFile, 'with', combined.length, 'use cases (from', files.length, 'files)');
