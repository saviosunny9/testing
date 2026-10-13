# Alaro website: full context

Use this file as the brief for any further changes. It describes what the site is, how every section works,
where the code and assets live, and which parts are still placeholders.

- **Live preview:** https://claude.ai/artifact/CejiCUZ2xHWhf5hfQhEbVU (private until shared)
- **Repo branch:** `saviosunny9/testing` → `claude/caveman-cli-setup-ogqlwo`
- **Brand name:** "Alaro" is a working name, set once in `lib/brand.ts` (`BRAND_NAME`).
- **Latest brief applied:** `ALARO_FIRST_DRAFT_CONTEXT.md` (first redesign draft). This file reflects the site after it.

---

## 1. Product and audience

Alaro is an indoor smart home camera with a pan/tilt head (the head swivels and tips up and down). It recognises people, pets and objects on the device itself, so alerts read like "Mira's home"
instead of "motion detected". You can ask it what happened ("Ask Alaro"), and it saves the moments worth keeping.

- **Audience:** families keeping an eye on kids, pets and grandparents, plus small business owners (shops, cafés) as a second audience.
- **Tone:** warm, human, never surveillance-y. No CCTV language and no "intruder" imagery.
- **Product colours:** **Graphite** `#3a3b3e`, **Chalk White** `#eeedea`, **Nuuk Red** `#b8232b`.
- **Product shape** (matching the client's reference renders):
  - a cylindrical base with a rotating cap and an "alaro." logo
  - a short rear arm with a hinge
  - a cylindrical head with a domed black glass face, a centred lens and a speaker grille on the left side
  - a USB-C port at the back of the base

---

## 2. Stack and commands

- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3
- GSAP 3.15 with ScrollTrigger and SplitText (all GSAP plugins are free)
- Lenis for smooth scrolling, wired to ScrollTrigger in `components/SmoothScroll.tsx`
- three.js 0.170 for real-time 3D, loaded on demand with `import()`, so it is not in the first page load
- lucide-react icons; Switzer via `next/font/local`

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (runs lint and typecheck)
npm run export       # static site in out/ with relative URLs (see section 9)
```

---

## 3. Design system (`app/globals.css`, `tailwind.config.ts`)

**Direction (first-draft brief, Oct 2026):** restrained and editorial. Surfaces are warm off-white, white, charcoal and black. Forest green is the brand dark, and fresh green is a small non-text accent. **Text is only black, white or grey**, so no coloured words, headings, eyebrows or labels. Colour comes from the film, the photography and the product finishes.

### Colour tokens (provisional, from the moodboard)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#ffffff` | page |
| `--paper` / `--paper-2` | `#f5f5f2` / `#ebebe6` | warm off-white surfaces, tiles, accordions |
| `--ink` | `#161715` | text |
| `--ink-2` | `#3a3b38` | secondary dark text |
| `--muted` | `#6b6d68` | body copy, eyebrows |
| `--muted-2` | `#9a9c96` | `.hl` second-line emphasis (grey) |
| `--line` | `#deded8` | hairlines |
| `--charcoal` / `--black` | `#222321` / `#0d0e0d` | primary buttons, footer |
| `--forest` / `--forest-2` | `#172d25` / `#213c31` | brand dark sections and cards (Privacy, Understands, shop timeline card) |
| `--fresh` | `#54c878` | non-text accents only: focus ring, room markers, cart badge, selected dots |
| `--tint-graphite` / `--tint-white` / `--tint-red` | `#ebecea` / `#f5f5f2` / `#f1edea` | neutral grounds behind each product finish |

Tailwind keeps the aliases `surface`, `surface-2`, `night` and `night-2`, mapped onto paper and forest, so older class names stay neutral.

### Type: Switzer

- **Font files:** self-hosted in `app/fonts/switzer/` (weights 400, 400 italic, 500, 600, 700) through `next/font/local`.
- **Licence:** Switzer is © Indian Type Foundry, used under the ITF Free Font License (Fontshare). Details are in `app/fonts/switzer/LICENSE.md`.
- **Scale:** one scale used everywhere, with no one-off sizes.

| Class | Size | Weight / tracking / leading |
|---|---|---|
| `.h-hero` | `clamp(3rem, 7.2vw, 7.75rem)` | 600 / -0.05em / 0.9 |
| `.h-section` | `clamp(2.4rem, 5vw, 4.75rem)` | 600 / -0.04em / 0.96 |
| `.h-card` | `clamp(1.45rem, 2.1vw, 1.9rem)` | 600 / -0.032em / 1.04 |
| `.h-small` | 19px | 600 / -0.02em |
| body | 17px | 400 / -0.01em / 1.5 |
| `.lede` | `clamp(1.0625rem, 1.3vw, 1.3125rem)` | grey |
| `.eyebrow` | 12px | 500, uppercase, +0.08em, grey |

- **Emphasis:** `.hl` greys the second half of a headline ("Designed to disappear **into your home.**"). Inside `.on-dark` it becomes 50% white.
- **Dark sections:** add `on-dark` so eyebrows, ledes, `.hl` and links switch to white or grey.

### Components

- **Buttons:**
  - `.btn-dark` (charcoal, primary; `.btn-navy` is an alias)
  - `.btn-light` (white, used over the film and dark sections)
  - `.btn-glass` (frosted, over video) and `.btn-outline`
  - all have a green focus ring
- **Selected states:** the Family/Business toggle and Ask chips use charcoal fill with white text; the colour swatch uses an ink ring.
- **Radii:** 22–32px on cards, pills for buttons. Shadows are neutral.

### Motion rules

- Animate only transform, opacity, filter and clip-path.
- `[data-reveal]` fades up once on enter; `[data-parallax]` drifts an element while in view.
- `prefers-reduced-motion`:
  - static hero composition
  - journey shown as still renders
  - no Lenis
- The hero intro never locks scrolling.

---

## 4. Page order (`app/page.tsx`)

| # | Section | File | Anchor | Surface |
|---|---|---|---|---|
| 0 | Header (fixed) | `components/Header.tsx` | | white text over film / dark, ink elsewhere |
| 1 | Hero: film → phone with moments around it | `components/hero/*` | `#hero`, `#top` | film, then paper |
| 2–4 | Product journey (one 3D canvas across three sections) | `sections/ProductJourney.tsx` | `#design`, `#see`, `#private` | paper, white, forest |
| 5 | Captured on Alaro: moments bento, Family/Business toggle | `sections/Moments.tsx` | `#moments` | white |
| 6 | App showcase: realistic tilted phone | `sections/AppShowcase.tsx` | `#app` | white |
| 7 | Colour tiles | `sections/ProductTiles.tsx` | `#colours` | white with neutral tiles |
| 8 | At home: camera composited into real rooms | `sections/AtHome.tsx` | `#at-home` | white |
| 9 | Understands | `sections/Understands.tsx` | | forest |
| 10 | Ask Alaro | `sections/AskAlaro.tsx` | `#ask` | paper card |
| 11 | Your space. Your control. | `sections/Control.tsx` | `#control` | white, paper cards |
| 12 | Buy: 3D viewer + buy box | `sections/Experience.tsx`, `ProductViewer.tsx` | `#buy` | white |
| 13 | Family / Business | `sections/ChooseWay.tsx` | `#choose` | white |
| 14 | FAQ | `sections/Faq.tsx` | `#faq` | white |
| 15 | Closing CTA + footer | `sections/Closing.tsx` | | paper card, black footer |

Nav: Products (`#buy`), For Home (`#moments`), For Business (`#choose`), Design (`#design`), Support (`#faq`).

---

## 5. Section details

### Hero (`components/hero/`)

**Opening:** a full-bleed film, grainy and black and white, with the bottom-row copy (eyebrow, H1 "The intelligence / behind your space." with the second line at 55% white, Watch the film / Buy Alaro, description) and an intro character reveal.

**Scroll timeline** (`useHeroTimeline.ts`): one ScrollTrigger over a 360vh track (300vh on mobile).

| Progress | What happens |
|---|---|
| 0–0.18 | Copy and gradient fade out |
| 0.03–0.23 | Grain fades; the film turns to colour |
| 0.06–0.52 | `.cam-frame` clip-path shrinks to `.frame-rect`, a **portrait 9:19.5 phone screen** at the centre; the video scales to cover it |
| 0.16–0.6 | Six moment tiles (`MomentTiles.tsx`), hidden under the film, settle from a pull toward the centre at 1.18× into a balanced collage; on mobile four tiles sit at the edges |
| 0.44 | The iPhone body (`PhoneBody.tsx`) fades in |
| 0.5 | Minimal HUD (`CameraHUD.tsx`): Dynamic Island, "● LIVE · {room}" pill, clock, and the app's three controls (talk, snapshot, record) |
| 0.56 | Caption: "The Alaro app / Every moment, right in your pocket." |

- **Reduced motion:** a static poster hero, then the same phone and collage composition as a normal section.
- **Film player:** "Watch the film" opens `FilmPlayer.tsx` (unchanged).

### Product journey (`ProductJourney.tsx`, `lib/three/*`)

**How it works:**
- One sticky WebGL canvas (`.journey-stage` → `.journey-sticky`) sits behind three sections.
- Each section is 200svh on desktop, with its copy column sticky for the first 100svh, so copy and camera take turns.
- The canvas is contained by the journey wrapper and never overlaps neighbouring sections.

**The three sections:**

| Section | Background | Copy | Camera |
|---|---|---|---|
| **Design** (`#design`) | paper | left: "Designed to disappear into your home." + 14 cm / 7.4 cm / 3 finishes | right, turning slowly to show its form |
| **Pan and tilt** (`#see`) | white | right: "Turns to see the whole room." + 350° / 75° / 2K HDR | glides left (scale dips to 0.8 while travelling), then pans its head left and right |
| **Privacy** (`#private`) | forest | left: "Private by design." + on-device recognition, encryption, privacy mode | glides right; the head tips down (privacy mode) |

**Loading and fallbacks:**
- three.js loads when the journey is within about one screen of the viewport.
- On mobile, with reduced motion, or if WebGL or the module fails, `data-fallback="true"` hides the canvas and shows still renders in each section.

**3D model:** the procedural `lib/three/alaroCamera.ts` (see section 6 for why a downloaded model wasn't used). It has:
- a soft-touch matte shell (speckle roughness and bump map)
- a domed black glass face with controlled studio reflections
- a detailed lens (barrel, aperture, coated ring)
- a speaker grille, rear arm and hinge, and a USB-C port
- a Switzer "alaro." logo
- a soft contact shadow plus a VSM shadow on an invisible floor

### App showcase (`AppShowcase.tsx`)

- **Phone:** a CSS 3D phone (perspective, rotateY/X/Z) with a titanium gradient edge, black bezel, Dynamic Island, glass glare and a soft blurred floor shadow. It straightens slightly on hover.
- **Screen:** a credible "Home" view of the app:
  - status bar
  - home header ("3 cameras · everyone's in")
  - live clip, using `hero-720.mp4`, loaded and played only while on screen
  - "Today's moments" list with three entries
- **Copy:** "Your home, at a glance." with three value points: live in a second, alerts that name names, moments kept for you.

### Colour tiles (`ProductTiles.tsx`)

- **Consistent sizing:** all three use the same `front-{graphite,white,red}.webp` renders, which share one canvas and framing. Each sits in an identical box (88% width, shared bottom baseline). The box is shifted so the **visible product** is centred; the product spans x 30–737 of 1355, and the rest is shadow.
- **Backgrounds:** neutral tints, with a charcoal "Buy" button carrying `data-color`.
- **Mobile:** tiles scroll horizontally with snap.

### Other sections (visuals updated, behaviour unchanged)

- **Moments:** paper CTA cards; the business timeline card is forest; the footfall bars are neutral with the busiest hour in forest.
- **At home:** markers are fresh green.
- **Understands:** forest with forest-2 cards.
- **Ask Alaro:** paper card, charcoal chips and send button, forest avatar.
- **Control:** paper cards, with one forest card.
- **Buy:** the 3D viewer sits on neutral tints; delivery ticks are forest.
- **Closing CTA:** paper card. **Footer:** black.

---

## 6. Assets and the 3D model

| Path | What |
|---|---|
| `hero-1080.mp4`, `hero-720.mp4`, `hero-poster.jpg` | the client film, re-encoded (letterbox cropped) |
| `stills/*.jpg` | warm-graded frames from the film (also used as hero moment tiles) |
| `product/front-*.webp`, `three4-white`, `pan-left-white`, `pan-right-white`, `rear-red` | transparent renders of the model |
| `life/*.jpg` | the camera composited into rooms from the film; 3D shop scenes |
| `app/fonts/switzer/*` | Switzer web fonts + licence note |

**Why the model is our own (first-draft brief, §4):**
- The brief asked for a licensed online model matching Alaro's form.
- From the build environment, Sketchfab and the reference sites were unreachable (blocked by network policy), so no third-party model could be searched, compared or licence-checked.
- Following the brief's fallback, the existing procedural model was upgraded instead (materials, lens, shadows) and is used consistently across the hero renders, the journey and the buy viewer.
- **If a licensed GLB is sourced later**, it can replace `createAlaroCamera()` in `lib/three/stage.ts`. The journey only needs `group`, `pan` (head yaw) and `tilt` (head pitch) handles.

**Imagery:** no stock photography is used; network access to stock sites was blocked. Real lifestyle and shop photography is still wanted.

---

## 7. Key files

```
app/layout.tsx            Switzer (next/font/local), metadata, intro-hide script, Header, Lenis
app/page.tsx              section order
app/globals.css           tokens, type scale, buttons, hero/phone/HUD/grain, moment tiles, journey, device
app/fonts/switzer/        font files + LICENSE.md
components/hero/          Hero, HeroCopy, MomentTiles, PhoneBody, CameraHUD, PreviewCopy, FilmPlayer,
                          scenes.ts, videoClock.ts, useHeroTimeline.ts
components/sections/      ProductJourney, AppShowcase, ProductTiles, Moments, AtHome, Understands, AskAlaro,
                          Control, Experience + ProductViewer, ChooseWay, Faq, Closing, PageEffects
lib/three/alaroCamera.ts  procedural camera model + studio environment
lib/three/stage.ts        WebGL stage + contact shadow
lib/brand.ts              BRAND_NAME, nav, copy, PRICE
lib/headerTheme.ts, lib/cart.ts, lib/lenis.ts, lib/gsap.ts
tools/camera-render/      offline renders, shop scenes, compositing
```

Removed in this draft: the "How it works" shelf scene (`HowItWorks.tsx`, `shelfScene`, the chapter CSS, the IR ring) and `DetectionBox.tsx`.

---

## 8. Placeholders and open items

- **Business facts:** price ₹7,499 and EMI, specs (14 cm / 7.4 cm, 2K HDR, 350° / 75°), delivery, returns, warranty and FAQ answers.
- **Brand colours:** the values above are provisional, pending the client's next references.
- **Names:** Mira, Arlo, Zoe, Leo, Milo and Grandpa are used in captions and the HUD.
- **3D model:** a licensed GLB still needs sourcing (see §6). Real shop and lifestyle photography is also outstanding.
- **Demo-only features:** Ask Alaro, the cart counter and the footer email form.
- **Not yet verified:** real-device Safari/Chrome H.264 playback, Lighthouse scores, and frame rate on mid-range phones. Tests so far used headless Chromium at 1440, 1024, 390 and 360px.

---

## 9. Static export and hosting

`npm run export`:
1. builds with `output: 'export'` and a placeholder asset prefix
2. `scripts/relativize-export.mjs` rewrites asset and media URLs to relative paths, inlines the fonts into the CSS and escapes literal U+FFFD characters

The result in `out/` can be hosted from any sub-path. Open it through a local server, because video and module loading don't work from `file://`:

```bash
cd out && python3 -m http.server 8080   # then open http://localhost:8080
```

The live preview is that export wrapped in a full-screen iframe page on claude.ai.
