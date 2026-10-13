# Camera renders

`render.html` is a three.js model of the Alaro camera (pan/tilt head with a domed black glass face, cylindrical base,
rear arm and hinge, speaker grille, USB-C port, "alaro." logo) lit by a procedural studio environment.
`shoot.js` loads it in headless Chromium and saves the canvas as a transparent PNG.

```bash
cd tools/camera-render
npm install
npm run serve &                     # serves this folder on :4000
node shoot.js out.png "color=white&view=front&w=2000&h=1500"
```

Query parameters: `color` (graphite | white | red), `view` (front | three4 | rear | detail | macro | top),
`bg=dark` (black studio for close-ups), `pan` and `tilt` in degrees, `w`/`h` in pixels. If Playwright's own
browser isn't installed, set `executablePath` in `shoot.js` to a local Chromium.

The site uses trimmed WebP versions of these renders in `public/media/product/`.

## Scenes and lifestyle composites

- `shop.html` renders the grocery and café scenes used for business. It imports the site's model from
  `lib/three/alaroCamera.ts`, compiled first:
  `npx tsc ../../lib/three/alaroCamera.ts --ignoreConfig --outDir build --module esnext --target es2020 --moduleResolution bundler --skipLibCheck --lib es2020,dom`
  then `PAGE=shop.html node shoot.js out.png "scene=grocery"` (or `scene=cafe`).
- `composite.py` places a transparent render into a film still (anchor point, height, blur, warmth, exposure).
  The `view=custom&cam=x,y,z&target=x,y,z&keyx=..&keyy=..` parameters of `render.html` match each photo's angle and light.
- `lifestyle.py` builds the client-photo scenes in `public/media/life/` (`lounge`, `evening`, `playroom`,
  `kitchen-family`, `companion`): it inpaints or crops out other brands' products, repaints a printed label as plain
  bottle, and composites a render per scene (`r10.png` … `r14.png`, shot with `view=custom` to match each photo's
  angle and light). Needs `opencv-python-headless`.
  `python3 lifestyle.py <photo dir> <render dir> <out dir> [scene ...]`
- The hero camera (`public/media/hero/alaro-camera.webp`) is
  `node shoot.js cam.png "color=white&view=custom&cam=-6,12,62&target=0,7.2,0&fov=22&pan=-16&tilt=0&keyx=-12&keyy=26&keyz=22&soft=16&w=2340&h=2600"`,
  trimmed to its alpha bounds. `shoot.js` also writes `cam.json`: where the glass face, lens and status dot land on the
  canvas, which `components/hero/HeroCamera.tsx` uses (as fractions of the trimmed image). Other params added:
  `keyz` (key light depth), `soft` (shadow softness), `mount=wall` (wall shelf + shadow-catching wall, `wallshadow`).
