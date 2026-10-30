// Resizes an event's photos for the website and prints the `photos:` lines for its edition YAML.
//
//   pnpm photos <folder or photos…> <year>/<programme>
//   pnpm photos ~/Downloads/grahak-peth 2026/grahak-peth
//
// Each photo is turned upright (camera rotation), shrunk to at most 1600 px on its longest side,
// saved as JPEG (about 200–400 KB) in public/assets/events/<year>/<programme>/, and stripped of
// its metadata, including the GPS location phones store. Keep the full-size originals in Google
// Drive/Photos (link them with `album:`), not in the repository: git keeps every file forever.
// Existing files are skipped; add --force to redo them. iPhone HEIC photos are converted with
// macOS's built-in `sips` first (elsewhere, export them as JPEG).
import { readdir, mkdir, stat, mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, basename, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const MAX = 1600;
const QUALITY = 80;
const IMAGE = /\.(jpe?g|png|webp|avif|tiff?|heic|heif)$/i;

const args = process.argv.slice(2);
const force = args.includes('--force');
const rest = args.filter((a) => a !== '--force');
const target = rest.pop();
if (!rest.length || !/^\d{4}\/[a-z0-9-]+$/.test(target ?? '')) {
  console.error('Usage: pnpm photos <folder or photos…> <year>/<programme>   e.g. pnpm photos ~/Downloads/grahak-peth 2026/grahak-peth');
  process.exit(1);
}
const [year, programme] = target.split('/');
if (!existsSync(`src/content/editions/${year}/${programme}.yaml`)) {
  console.warn(`Note: src/content/editions/${year}/${programme}.yaml doesn't exist (check the name).`);
}

/** Every photo in the given folders and files, in name order */
async function inputs(paths) {
  const files = [];
  for (const p of paths.map((x) => resolve(x))) {
    if ((await stat(p)).isDirectory()) {
      const names = (await readdir(p)).filter((n) => IMAGE.test(n)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      files.push(...names.map((n) => join(p, n)));
    } else if (IMAGE.test(p)) files.push(p);
  }
  return files;
}

/** "IMG 2041 (1).HEIC" → "img-2041-1.jpg" */
const outName = (file) => `${basename(file, extname(file)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'photo'}.jpg`;

const files = await inputs(rest);
if (!files.length) { console.error('No photos found (jpg, png, webp, avif, tiff, heic).'); process.exit(1); }

const outDir = `public/assets/events/${year}/${programme}`;
await mkdir(outDir, { recursive: true });
const tmp = await mkdtemp(join(tmpdir(), 'photos-'));
let before = 0, after = 0;
const written = [];
try {
  for (const file of files) {
    const name = outName(file);
    const out = join(outDir, name);
    if (existsSync(out) && !force) { console.log(`skip  ${name} (exists; --force to redo)`); written.push(name); continue; }
    let source = file;
    if (/\.hei[cf]$/i.test(file)) {
      if (process.platform !== 'darwin') { console.warn(`skip  ${basename(file)}: HEIC — export it as JPEG first`); continue; }
      source = join(tmp, `${basename(file)}.jpg`);
      execFileSync('sips', ['-s', 'format', 'jpeg', file, '--out', source], { stdio: 'ignore' });
    }
    // rotate(): apply the camera's orientation; metadata isn't copied unless asked, so GPS etc. are dropped
    const info = await sharp(source).rotate().resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true }).toFile(out);
    const size = (await stat(file)).size;
    before += size; after += info.size;
    console.log(`ok    ${name}  ${info.width}×${info.height}  ${(size / 1e6).toFixed(1)} MB → ${Math.round(info.size / 1e3)} KB`);
    written.push(name);
  }
} finally {
  await rm(tmp, { recursive: true, force: true });
}

if (after) console.log(`\n${(before / 1e6).toFixed(1)} MB → ${(after / 1e6).toFixed(1)} MB in ${outDir}/`);
console.log(`\nAdd to src/content/editions/${year}/${programme}.yaml (captions optional; drop the photos you don't want):\n`);
console.log('photos:');
for (const name of written) console.log(`  - src: /assets/events/${year}/${programme}/${name}\n    # caption: …`);
