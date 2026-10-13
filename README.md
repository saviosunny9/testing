# Alaro: smart home camera site

Marketing site for **Alaro** (working brand name, set in `lib/brand.ts`). The hero is a full-bleed film that,
on scroll, shrinks into a framed live camera preview with a security-camera HUD. The full brief is
[`docs/HERO_CONTEXT.md`](docs/HERO_CONTEXT.md).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also runs lint + typecheck)
```

Stack: Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 · GSAP 3 (ScrollTrigger, SplitText) · Lenis · lucide-react.

## Where things live

| Path | What |
|---|---|
| `lib/brand.ts` | `BRAND_NAME`, nav links, all hero/preview/toast copy, alternative headlines |
| `components/hero/Hero.tsx` | Pinned stage markup; reduced-motion static variant |
| `components/hero/useHeroTimeline.ts` | All GSAP: the scroll timeline (§5.4) and the load-in intro (§4.3) |
| `components/hero/scenes.ts` | Scene map + detection-box coordinates (percent of frame) |
| `components/hero/videoClock.ts` | Follows the video playhead (`requestVideoFrameCallback`) and emits scene changes |
| `components/hero/CameraHUD.tsx`, `DetectionBox.tsx` | Live-feed overlay: REC/LIVE, camera label, timestamp, controls, activity timeline, AI box |
| `components/hero/SonarRings.tsx`, `NotificationToasts.tsx`, `PreviewCopy.tsx` | End-state pieces around the frame |
| `components/sections/Sections.tsx` | The rest of the page (§8) |
| `lib/headerTheme.ts` | Header text colour, derived from what is under the header |
| `app/globals.css` | Colour tokens, `.frame-rect` (the final 16:9 rectangle), HUD and ring styles |

## How the shrink works

`.frame-rect` (CSS) defines the final rectangle; the HUD, rings, toasts and preview copy all share it.
On every ScrollTrigger refresh JS reads that rect and:

- animates `.cam-frame`'s `clip-path: inset(... round 28px)` from full screen to the rect, and
- scales/translates the video (sized as a 16:9 "cover" box) so that at the end it fills the rect exactly.
  That is what makes the detection-box percentages line up 1:1 with the footage.

Only `transform`, `opacity`, `filter` and `clip-path` are animated. Scrolling back up reverses everything.

## Media

`public/media/hero-{1080,720}.mp4` and `hero-poster.jpg` were encoded from the original `alaro-short.mp4`.
Scenes 1, 5 and 6 of the source carried 34px letterbox bars; those scenes were cropped and rescaled so
every frame is full-bleed. `public/media/stills/` holds frames used by the lower sections.
`docs/reference/video-scenes.jpg` and `detection-boxes.jpg` are regenerated from the final video.
The brand moodboard referenced in the brief (`docs/reference/moodboard.webp`) was not provided.

Placeholder content to replace before launch: price (£89), testimonial names/quotes, footer links.
