// usage: node shoot.js out.png "query" [bgcolor]
const { chromium } = require('playwright');
(async () => {
  const [out, q] = process.argv.slice(2);
  const p = new URLSearchParams(q); const w = +(p.get('w') || 1600), h = +(p.get('h') || 1200);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on('pageerror', (e) => console.log('pageerror', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.log('console', m.text()); });
  await page.goto('http://127.0.0.1:4000/' + (process.env.PAGE || 'render.html') + '?' + q);
  await page.waitForFunction(() => window.__done === true, null, { timeout: 180000 });
  await page.locator('canvas').screenshot({ path: out, omitBackground: true });
  await browser.close();
})();
