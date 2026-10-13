// Post-processes `STATIC_EXPORT=1 next build` output (out/) so the site runs from any sub-path:
// - the placeholder asset prefix and /media/ paths become relative URLs
// - next/font files are inlined into the CSS as data URIs, and their preload links dropped
// - literal U+FFFD characters in JS are written as \ufffd escapes
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = process.argv[2] ?? 'out';
const PREFIX = '/__asset_prefix__/';

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const files = walk(OUT);
let fontCount = 0;

for (const file of files) {
  if (!/\.(html|js|css)$/.test(file)) continue;
  let src = readFileSync(file, 'utf8');
  const before = src;

  if (file.endsWith('.css')) {
    src = src.replace(/url\(\/__asset_prefix__\/(_next\/static\/media\/[^)]+\.woff2)\)/g, (_, rel) => {
      fontCount++;
      return `url(data:font/woff2;base64,${readFileSync(join(OUT, rel)).toString('base64')})`;
    });
  }
  if (file.endsWith('.html')) {
    src = src.replace(/<link[^>]*\.woff2[^>]*>/g, '');
  }
  // Literal U+FFFD (in Next's polyfills) becomes its escape; some hosts reject the raw character.
  if (file.endsWith('.js')) src = src.replaceAll('\uFFFD', '\\ufffd');
  src = src.split(PREFIX).join('./').replaceAll('/__asset_prefix__', '.').replaceAll('"/media/', '"./media/').replaceAll('url(/media/', 'url(./media/');

  if (src !== before) writeFileSync(file, src);
}

// The fonts now live inside the CSS.
for (const file of files) if (file.endsWith('.woff2')) rmSync(file);

const leftovers = walk(OUT).filter((f) => /\.(html|js|css)$/.test(f) && readFileSync(f, 'utf8').includes('__asset_prefix__'));
if (leftovers.length) {
  console.error('Unrewritten asset prefix in:', leftovers);
  process.exit(1);
}
console.log(`Relativized ${OUT}/ (${fontCount} font faces inlined).`);
