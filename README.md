# Alaro: smart camera site

Product site for **Alaro** (working brand name, set in `lib/brand.ts`). The hero is a grainy black-and-white film
that turns to colour as you scroll and shrinks into a portrait iPhone, with captured moments gathering around it. The original hero brief is
[`docs/HERO_CONTEXT.md`](docs/HERO_CONTEXT.md).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also runs lint + typecheck)
```

Stack: Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 · GSAP 3 (ScrollTrigger, SplitText) · Lenis · lucide-react.
Type: Switzer (self-hosted, ITF Free Font License). 3D: three.js, loaded on demand.

## Page

The full, current description of every section, the design system (Switzer, neutral palette with forest/fresh
green accents), assets and placeholders is in [`docs/SITE_CONTEXT.md`](docs/SITE_CONTEXT.md). The latest change
brief is [`docs/ALARO_FIRST_DRAFT_CONTEXT.md`](docs/ALARO_FIRST_DRAFT_CONTEXT.md).

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
