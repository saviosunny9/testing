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
Type: Geist · Geist Mono. 3D: three.js, loaded on demand.

## Page

1. **Hero**: grainy black-and-white film that clears and turns to colour as it shrinks into an iPhone with a minimal live view
2. **Captured on Alaro**: moments bento, with a Family / Business toggle (business uses 3D shop scenes)
3. **Colours**: Graphite, Chalk White and Nuuk Red tiles on backgrounds tinted to match each product
4. **How it works**: pinned, scroll-driven 3D story on an oak shelf: meet, pan, recognise, night vision, privacy
5. **At home**: the camera composited into real rooms from the film, with markers
6. **Understands**: navy cards: visual intelligence, day digest, "little things" marquee
7. **Ask Alaro**: working chat demo
8. **Your space. Your control.**: feature carousel
9. **Buy**: drag-to-rotate 3D camera with colour picker, feature list, add to bag
10. **Built for the way you use it**, **FAQ**, **closing CTA**, **footer**

Palette: white, navy ink `#0B3558`, blue `#006BFF`, soft sky / lilac / mint / peach / sun tints. Type: Geist with tight tracking.

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
| `lib/three/` | Real-time camera model (`alaroCamera.ts`) and shared stage, shelf scene, contact shadow (`stage.ts`) |
| `tools/camera-render/` | Offline renders: product shots, shop scenes, lifestyle composites |

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
