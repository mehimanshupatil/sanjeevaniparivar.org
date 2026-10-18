#!/usr/bin/env node
// Renders every Publicity page in dist/ to images. Run after `astro build`.
//
//   node scripts/render-publicity.mjs            → all pages
//   node scripts/render-publicity.mjs 2026       → only paths containing "2026"
//   node scripts/render-publicity.mjs --strict   → exit 1 on any warning (CI)
//
// For dist/publicity/<year>/<programme>/<format>/index.html it writes, next to that folder:
//   <format>.png (1×, for WhatsApp), <format>@2x.png (print), <format>.pdf
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize, relative, dirname, basename } from 'node:path';
import { chromium } from 'playwright';

const DIST = new URL('../dist/', import.meta.url).pathname;
const PUBLICITY = join(DIST, 'publicity');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf', '.woff2': 'font/woff2',
};

/** Minimal static server for dist/ so pages load with their real absolute URLs. */
function serve() {
  const server = createServer(async (req, res) => {
    let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (path.endsWith('/')) path += 'index.html';
    try {
      const body = await readFile(join(DIST, path));
      res.writeHead(200, { 'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

/** dist/publicity/<year>/<programme>/<format>/index.html */
async function publicityPages() {
  const entries = await readdir(PUBLICITY, { recursive: true });
  return entries
    .filter((p) => p.endsWith('index.html') && p.split('/').length === 4 && !p.startsWith('assets'))
    .map((p) => '/publicity/' + dirname(p) + '/');
}

async function render(browser, origin, route) {
  const outDir = join(DIST, dirname(route));
  const name = basename(route);
  const problems = [];

  const page = await browser.newPage();
  await page.goto(origin + route, { waitUntil: 'load' });
  await page.waitForSelector('html[data-publicity-ready]'); // fonts loaded + long titles fitted (src/publicity/fit.ts)
  const size = await page.locator('#frame').evaluate((el) => ({ width: el.offsetWidth, height: el.offsetHeight }));
  await page.close();

  for (const [suffix, scale] of [['', 1], ['@2x', 2]]) {
    const p = await browser.newPage({ viewport: size, deviceScaleFactor: scale });
    await p.goto(origin + route, { waitUntil: 'load' });
    await p.waitForSelector('html[data-publicity-ready]');
    if (scale === 1) {
      const over = await p.evaluate(() => {
        const el = document.getElementById('content');
        return el.scrollHeight - el.clientHeight;
      });
      if (over > 1) problems.push(`content is ${over}px taller than the frame, shorten some text`);
      const broken = await p.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src));
      broken.forEach((src) => problems.push(`image failed to load: ${src}`));
      // Fonts come from Google Fonts: a failed load would silently fall back to another font.
      const faces = await p.evaluate(() =>
        [...document.fonts].map((f) => ({ family: f.family.replace(/["']/g, ''), status: f.status })));
      // The page lists the families it uses (PublicityLayout.astro, including a theme's own font).
      const families = await p.evaluate(() => document.querySelector('meta[name="publicity-fonts"]')?.content.split(',') ?? []);
      for (const family of families) {
        if (!faces.some((f) => f.family === family && f.status === 'loaded')) {
          problems.push(`font "${family}" did not load from Google Fonts — the image would use a fallback font`);
        }
      }
      faces.filter((f) => f.status === 'error')
        .forEach((f) => problems.push(`a "${f.family}" font file failed to load`));
      await p.pdf({
        path: join(outDir, `${name}.pdf`),
        width: `${size.width}px`, height: `${size.height}px`, printBackground: true, pageRanges: '1',
      });
    }
    await p.locator('#frame').screenshot({ path: join(outDir, `${name}${suffix}.png`) });
    await p.close();
  }

  console.log(`✔ ${route} → ${relative(process.cwd(), outDir)}/${name}{.png,@2x.png,.pdf}`);
  problems.forEach((msg) => console.warn(`  ⚠ ${msg}`));
  return problems.length;
}

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const filters = args.filter((a) => !a.startsWith('--'));

if (!existsSync(PUBLICITY)) {
  console.error('✖ dist/publicity not found — run `pnpm build` first');
  process.exit(1);
}

const server = await serve();
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
let problems = 0;
try {
  const routes = (await publicityPages()).filter((r) => filters.every((f) => r.includes(f)));
  if (!routes.length) console.log('No pages matched.');
  for (const route of routes) problems += await render(browser, origin, route);
} catch (err) {
  console.error(`✖ ${err.message}`);
  problems++;
  process.exitCode = 1;
} finally {
  await browser.close();
  server.close();
}
if (strict && problems) process.exitCode = 1;
