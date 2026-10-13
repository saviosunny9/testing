# Alaro: smart camera site

Product site for **Alaro** (working brand name, set in `lib/brand.ts`), laid out from the Alaro wireframe with an
Apple-style white system. The hero is a black-and-white film that turns to colour as you scroll and shrinks into a
landscape iPhone showing a clean live view of the Alaro app. The original hero brief is
[`docs/HERO_CONTEXT.md`](docs/HERO_CONTEXT.md).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also runs lint + typecheck)
```

Stack: Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 · GSAP 3 (ScrollTrigger, SplitText) · Lenis · lucide-react.
Type: Archivo (expanded, display) · Geist (text) · Geist Mono.

## Page

1. **Hero**: film in black and white → colour, shrinks into an iPhone with a Fitness+-style live-view panel
2. **Moments**: "You can't be everywhere", Family / Business bento
3. **Intelligence**: the camera on a grey band
4. **Understands**: dark cards: visual intelligence, day digest, "little things" marquee
5. **Ask Alaro**: working chat demo with suggested questions
6. **Your space. Your control.**: feature carousel (pan/tilt, app, talk, night vision, privacy)
7. **Experience + buy**: feature list, colour picker (Graphite, Chalk White, Nuuk Red), add to bag
8. **Built for the way you use it**: Family / Business
9. **Built with care**: dark stepper over close-up renders
10. **FAQ**, **closing CTA**, **footer**

## Where things live

| Path | What |
|---|---|
| `lib/brand.ts` | `BRAND_NAME`, nav, hero copy, placeholder price |
| `components/hero/Hero.tsx` | Pinned stage; reduced-motion static variant |
| `components/hero/useHeroTimeline.ts` | All hero GSAP: scroll timeline and load-in intro |
| `components/hero/CameraHUD.tsx` | Live-view panel, status ring, Dynamic Island (sized with container units) |
| `components/hero/PhoneBody.tsx` | iPhone frame around the screen rect |
| `components/hero/scenes.ts` | Scene map: room, person, activity and detection box per scene |
| `components/sections/*` | Everything below the hero |
| `app/globals.css` | Tokens, `.frame-rect` (the phone screen), header states |
| `tools/camera-render/` | three.js model used to render the product images |

## How the shrink works

`.frame-rect` (CSS) is the phone's 19.5:9 screen. On every ScrollTrigger refresh JS reads that rect and animates
`.cam-frame`'s `clip-path` from full screen to it, while scaling the cover-sized 16:9 video so it covers the screen
exactly. The film's `grayscale()` filter is scrubbed from 1 to 0 over the same stretch. Only `transform`, `opacity`,
`filter` and `clip-path` are animated, and everything reverses on scroll up.

## Media

- `public/media/hero-*.mp4`, `hero-poster.jpg`: encoded from `alaro-short.mp4`; scenes 1, 5 and 6 had letterbox bars
  that were cropped.
- `public/media/stills/`: frames from the film, colour-graded warm to match the photo direction.
- `public/media/product/`: 3D renders of the camera (see `tools/camera-render/`).

Placeholders to replace before launch: price and EMI, specs (2K, 350° pan), delivery and warranty terms, FAQ answers.

## Static export

`npm run export` writes a self-contained static copy to `out/` with relative asset URLs and fonts
inlined (`scripts/relativize-export.mjs`), so it can be hosted from any sub-path. Serve `out/` with any static file
server.
