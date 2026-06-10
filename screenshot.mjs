import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const OUT  = join(ROOT, 'temporary screenshots');

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

// Auto-increment screenshot number
const existing = existsSync(OUT)
  ? readdirSync(OUT).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'))
      .map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0'))
      .filter(n => !isNaN(n))
  : [];
const next = existing.length ? Math.max(...existing) + 1 : 1;

const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';
const out   = join(OUT, `screenshot-${next}${label}.png`);

// Use system Chrome / Chromium via puppeteer if available, else AppleScript Safari
try {
  const script = `
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('${url}', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: '${out}', fullPage: true });
  await browser.close();
  console.log('Saved:', '${out}');
})().catch(e => { console.error(e); process.exit(1); });
`;
  execSync(`node -e "${script.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, {
    cwd: ROOT, stdio: 'inherit', timeout: 60000
  });
} catch {
  // Fallback: use Node.js + http to at least verify it's up
  console.error('Puppeteer not available. Install with: npm install puppeteer');
  console.error('Page URL:', url);
  process.exit(1);
}
