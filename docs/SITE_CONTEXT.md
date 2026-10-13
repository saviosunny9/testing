# Alaro website: full context

Use this file as the brief for any further changes. It describes what the site is, how every section works,
where the code and assets live, and which parts are still placeholders.

- **Live preview:** https://claude.ai/artifact/CejiCUZ2xHWhf5hfQhEbVU (private until shared)
- **Repo branch:** `saviosunny9/testing` → `claude/caveman-cli-setup-ogqlwo`
- **Brand name:** "Alaro" is a working name, set once in `lib/brand.ts` (`BRAND_NAME`).

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
- lucide-react icons, fonts from `next/font/google` (Geist, Geist Mono)

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (runs lint and typecheck)
npm run export       # static site in out/ with relative URLs (see section 9)
```

---

## 3. Design system (`app/globals.css`, `tailwind.config.ts`)

**Direction:** clean, Apple/Google-store calm, with Calendly-like colour: white page, navy text, one confident blue, and soft pastel tints for tiles.

### Colour tokens (CSS variables, also available as Tailwind colours)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#ffffff` | page |
| `--ink` | `#0b3558` | headings and body (navy) |
| `--ink-2` | `#1d4a72` | secondary dark text |
| `--muted` | `#476788` | body copy, captions |
| `--line` | `#d4e0ed` | hairlines |
| `--surface` / `--surface-2` | `#f4f7fb` / `#e6edf6` | neutral tiles |
| `--night` / `--night-2` | `#0b3558` / `#134470` | dark sections and the cards on them |
| `--blue` / `--blue-hover` | `#006bff` / `#0057d1` | primary buttons, `.hl` highlighted words, eyebrows |
| `--sky` `--lilac` `--mint` `--peach` `--sun` | `#e8f2ff` `#f0eaff` `#e2f8ef` `#ffece4` `#fff5d6` | tile backgrounds |
| `--violet` `--green` `--coral` `--gold` | `#8247f5` `#11a37f` `#ff6b4a` `#f5b400` | small accents (dots, chips, chart bars) |
| `--tint-graphite` `--tint-white` `--tint-red` | `#e3e7ec` `#eaf2ff` `#ffe3e1` | backgrounds that blend with each product colour |
| `--rec` `--live` | `#ff3b30` `#30d158` | REC dot and live states |

### Type

Geist only (Geist Mono for tabular bits), with tight tracking:
- `.display`: weight 600, `letter-spacing -0.05em`, `line-height 0.98`
- `.h-hero`: `clamp(2.75rem, 6vw, 6.25rem)`, `-0.058em`, `0.94`
- `.h-section`: `clamp(2.2rem, 4.2vw, 4rem)`
- `.h-card`: `clamp(1.4rem, 2vw, 1.75rem)`
- body: 17px, `line-height 1.42`, `letter-spacing -0.018em`
- `.lede`: large muted paragraph
- `.eyebrow`: 13px, semibold, blue, sentence case
- `.hl`: blue highlight for the second half of a headline, e.g. "Just ask. **Feel right at home.**"

### Components (CSS classes)

- **Buttons:**
  - `.btn` is the pill base, and `.btn-sm` makes it smaller
  - `.btn-dark` is blue (primary), `.btn-navy` is navy, `.btn-light` is white
  - `.btn-glass` is frosted, used over video; `.btn-outline` is a blue outline
- **Layout:** `.container-x` gives a 1200px max width with 20px gutters (40px on tablet and up); `.section` gives large vertical padding; `.tile` is a rounded surface.
- **Radii:** cards 24–32px, chips and buttons fully rounded.
- **Shadows:** soft and neutral (navy-tinted), never warm or orange.

### Motion rules

- Animate only `transform`, `opacity`, `filter` and `clip-path`.
- Eases: `power2.inOut` and `expo.out`; nothing bouncy.
- `[data-reveal]` elements fade up once on enter (`components/sections/PageEffects.tsx`).
- `[data-parallax="n"]` drifts an element by n% while it is in view.
- `prefers-reduced-motion` is respected everywhere: no pin, no Lenis, static hero, and the 3D story renders one still frame.

---

## 4. Page order (`app/page.tsx`)

| # | Section | File | Anchor |
|---|---|---|---|
| 0 | Header (fixed) | `components/Header.tsx` | |
| 1 | Hero: film to phone | `components/hero/*` | `#hero`, `#top` |
| 2 | Captured on Alaro: moments bento, Family/Business toggle | `sections/Moments.tsx` | `#moments` |
| 3 | Colour tiles (Google-store style) | `sections/ProductTiles.tsx` | `#colours` |
| 4 | How it works: pinned 3D scroll story | `sections/HowItWorks.tsx` | `#how` |
| 5 | At home: camera composited into real rooms | `sections/AtHome.tsx` | `#at-home` |
| 6 | Understands: navy cards, day digest, marquee | `sections/Understands.tsx` | |
| 7 | Ask Alaro: interactive chat demo | `sections/AskAlaro.tsx` | `#ask` |
| 8 | Your space. Your control.: feature carousel | `sections/Control.tsx` | `#control` |
| 9 | Buy: 3D viewer, feature accordion, buy box | `sections/Experience.tsx` + `ProductViewer.tsx` | `#buy` |
| 10 | Built for the way you use it: Family / Business | `sections/ChooseWay.tsx` | `#choose` |
| 11 | FAQ accordion | `sections/Faq.tsx` | `#faq` |
| 12 | Closing CTA + footer | `sections/Closing.tsx` | |

The hero is wrapped in `<div id="hero-wrap">` so page-level triggers have a stable element when the reduced-motion variant swaps in.

---

## 5. Section details

### Header (`components/Header.tsx`)

- **Layout:** logo (four slanted petals + "Alaro") on the left; nav in the centre (Products, For Home, For Business, How it works, Support); a "Buy" pill and "Cart (n)" on the right.
- **Mobile:** a two-line hamburger opens a white full-screen menu revealed with an expanding clip-path circle.
- **Text colour** comes from `lib/headerTheme.ts`:
  - white over the hero film and over any element with `data-header-theme="dark"`
  - navy everywhere else
  - it is derived from whatever sits under the header, not from enter/leave callbacks
- **Frosted bar:** past the hero, `data-solid="true"` adds a frosted bar (white, or navy over dark sections).
- **Cart count:** comes from `lib/cart.ts` (demo store incremented by "Add to Bag").

### 1. Hero (`components/hero/`)

**Layout:**
- the stage is `position: sticky` inside a 340vh track (290vh on mobile)
- bottom row (Sequel-style): eyebrow "Meet Alaro", H1 "The intelligence / behind your space." (second line at 55% white)
- right column: "Watch the film" (glass) and "Buy Alaro" (blue) buttons, plus a description

**Film:** `public/media/hero-1080.mp4` (`hero-720.mp4` on small screens or with Save-Data), muted and looping.

**Load-in intro** (`useHeroIntro` in `useHeroTimeline.ts`), after fonts are ready and the video is playing (capped at 3s / 2.5s):
1. The video fades in.
2. H1 characters fade in from blur(8px), split with SplitText.
3. The header drops in from above.
4. The buttons and description rise.

Scroll is locked until the characters finish, capped at 2.5s.

**Scroll timeline** (`useHeroTimeline`): one ScrollTrigger, `scrub: 0.8`, progress 0→1 over the track.

| Progress | What happens |
|---|---|
| 0.00–0.20 | Hero copy fades, rises and blurs out; the bottom gradient fades |
| 0.03–0.23 | `.cam-media` filter goes from `grayscale(1) contrast(1.12) brightness(.9)` to normal; the `.film-grain` overlay fades from 0.55 to 0 |
| 0.08–0.54 | `.cam-frame` clip-path shrinks from full screen to `.frame-rect` (the phone screen); the video scales to cover that rect exactly |
| 0.42–0.54 | The iPhone body (`PhoneBody.tsx`) fades in around the screen |
| 0.52+ | Minimal HUD items fade in; at 0.60 the detection box draws and its label slides up |
| 0.60–0.75 | Caption under the phone: "Live view in the Alaro app / Always there, even when you're not." |
| last 0.20 | Hold |

- **Phone screen:** `.frame-rect` is a 19.5:9 landscape iPhone screen, centred slightly above middle. JS reads its rect on every refresh, so it stays responsive.
- **Phone UI** (`CameraHUD.tsx`), deliberately minimal:
  - top left: "● LIVE · {room}" pill; the room changes per scene
  - top right: a clock pill (HH:MM, the viewer's local time)
  - bottom right: three small round controls (mic, snapshot, full screen)
  - left edge: the Dynamic Island
  - a thin white detection box with a name label (`DetectionBox.tsx`)
- **Scene map** (`scenes.ts`), times in seconds:

  | Time | Room | Who | Activity |
  |---|---|---|---|
  | 0–2.8 | Living Room | Mira | kids playing |
  | 2.8–4.8 | Family Room | Arlo | game night |
  | 4.8–7.2 | Dining Room | Grandpa | birthday |
  | 7.2–9.68 | Bedroom | Zoe | story time |
  | 9.68–13.12 | Kitchen | Leo | playing with Mum |
  | 13.12–15.28 | Living Room | Milo | pet |

  Box coordinates are percentages of the 16:9 frame. `videoClock.ts` follows the playhead with `requestVideoFrameCallback`.
- **Film player:** "Watch the film" opens a fullscreen muted player (`FilmPlayer.tsx`) with restart, play/pause, time and close.
- **Reduced motion:** a static colour poster hero, then the phone preview as its own static section.

### 2. Captured on Alaro (`Moments.tsx`)

- **Heading:** "You can't be everywhere. **But you can still be part of it.**", with a blue segmented toggle for Family / Business.
- **Family bento:**
  - Grandpa's 70th (tall)
  - "Zoe read to Mum tonight"
  - game night
  - Milo by the door
  - a sky CTA card ("See a day with Alaro")
- **Business bento:**
  - grocery 3D scene (tall)
  - navy "Today at the shop" timeline
  - sun-tinted footfall bar chart
  - café 3D scene
  - a sky CTA card

### 3. Colour tiles (`ProductTiles.tsx`)

- **Heading:** "Made to fit right in. **Or stand out.**"
- **Tiles:** three, one per colour, each on its blended tint, with a centred name, a one-liner, a navy "Buy" button and the product render rising from the bottom (lifts on hover).
- **Buy buttons:** carry `data-color`, which preselects that colour in the buy section.

### 4. How it works (`HowItWorks.tsx`, `lib/three/stage.ts`)

**Setup:**
- a 520vh section with a sticky 100svh stage
- warm wall backdrop (CSS gradients) that fades to a navy night gradient (`--night` CSS var)
- a transparent three.js canvas on top: the Chalk White camera on an oak shelf, with books (navy, blue, cream, coral), two flat books (violet, butter), a ceramic vase and a potted plant

**Scroll timeline** (`scrub: 0.6`) tweens a state object `{rot, pan, tilt, night, ir, camZ, camY, lookY}`, which is applied every frame:

| Chapter | Progress | Title | Movement |
|---|---|---|---|
| 01 | 0.0–0.2 | "Meet Alaro." | rotates in, dolly to camZ 88 |
| 02 | 0.2–0.4 | "Turns to see the whole room." | head pans −1 → +1 rad; pan gauge + "350° pan · 75° tilt" chip |
| 03 | 0.4–0.6 | "Knows who's who." | dolly in; chips "Mira · family", "Milo · pet", "Parcel · delivery" |
| 04 | 0.6–0.8 | "Sees in the dark." | lights dim to moonlight, background goes navy, faint red IR ring; night-vision thumbnail card |
| 05 | 0.8–1.0 | "Looks away when you ask." | head tilts down 0.85 rad; green "Privacy mode on" pill |

- **Chapter switching:** `section[data-active]` (0–4) swaps the chapter copy and UI with CSS transitions; a progress rail sits on the right.
- **Rendering:** it only renders while the section is on screen.
- **Layout:** desktop puts the copy on the left and the camera right of centre; mobile puts the camera at the top and the copy at the bottom.

### 5. At home (`AtHome.tsx`)

- **Heading:** "Small enough to **go anywhere.**"
- **Photos:** four real stills from the film with the 3D camera composited in, each with a pulsing blue marker on the camera and a caption.

  | File | Room | Camera placement |
  |---|---|---|
  | `bedroom.jpg` | Bedroom | Nuuk Red, on the ottoman |
  | `living.jpg` | Living room | Graphite, floor level by the plants and cat |
  | `kitchen.jpg` | Kitchen | Chalk White, on the counter |
  | `dining.jpg` | Dining room | Graphite, by the candles |

### 6. Understands (`Understands.tsx`)

- Navy section (dark header).
- **Left:** kitchen still with tags ("Playtime · 4:08 PM", "Leo and Mum", "KITCHEN · LIVE") and an "Experience Alaro" button.
- **Right:** three cards:
  - the visual-intelligence statement
  - "Your day, in 5 minutes." with five thumbnails
  - "Intelligence that notices the little things." with an infinite chip marquee

### 7. Ask Alaro (`AskAlaro.tsx`)

- Sky band; copy on the left and a chat window on the right.
- **Suggested questions:** "What happened while I was away?", "Did everyone get home?" and "Show me today's moments". Clicking one shows a typing indicator (0.9s), then an answer with 2–3 thumbnails.
- **Free text:** any typed question falls back to the first answer. It's a demo with no backend.

### 8. Your space. Your control. (`Control.tsx`)

- **Carousel:** horizontal scroll-snap with arrow buttons.
- **Cards:**
  - Look around remotely: three renders crossfading through pan angles
  - Control from the app: CSS phone mock-up
  - Talk from anywhere: kitchen still with a "Talking · 0:12" pill
  - Clear at night: night-vision still
  - Private by design: rear render

### 9. Buy (`Experience.tsx`, `ProductViewer.tsx`)

- **Left (sticky):** a 3D camera on a tint that matches the selected colour.
  - Drag to rotate (OrbitControls, no zoom), with slow auto-rotate.
  - Colour changes tween the body material.
  - A small phone mock-up overlaps the corner.
- **Right:**
  - "Everything you need, **right from your phone.**"
  - a 01–04 accordion
  - the buy box: price, EMI line, colour radios, what's in the box, "Add to Bag" (increments the header cart), delivery, returns, warranty and payment ticks, and a setup line

### 10–12. Choose your way, FAQ, Closing

- **Choose your way:** Family (kitchen still) and Business (grocery scene) cards.
- **FAQ:** six questions in an accordion, the first one open.
- **Closing CTA:** a sky → lilac → peach gradient card with all three colours.
- **Footer:** navy, with an email field that shows a "You're on the list" state.

---

## 6. Assets (`public/media/`)

| Path | What |
|---|---|
| `hero-1080.mp4`, `hero-720.mp4`, `hero-poster.jpg` | Re-encoded from the client's `alaro-short.mp4` (15.28s, 25fps). Scenes 1, 5 and 6 had 34px letterbox bars, which were cropped. |
| `stills/*.jpg` | Frames from the film, colour-graded warm (birthday, birthday-portrait, storytime, storytime-night, gamenight, kitchen, milo, sofa) |
| `product/front-{graphite,white,red}.webp` | Transparent 3D product renders, front view |
| `product/three4-white.webp`, `pan-left-white.webp`, `pan-right-white.webp`, `rear-red.webp` | Other angles |
| `life/bedroom.jpg`, `living.jpg`, `kitchen.jpg`, `dining.jpg` | Film stills with the rendered camera composited in |
| `life/shop-grocery.jpg`, `life/shop-cafe.jpg` | 3D-rendered shop scenes for the business story |

**Where the imagery comes from:**
- **No stock photos are used.** Network access to stock and reference sites was blocked, and the Pinterest board was used only as art direction (warm golden light, candid families, kids and pets).
- **Real photography to add later:** lifestyle shots of the product, and real shops and grocery stores you have the rights to.

**Re-rendering product shots** (`tools/camera-render/`, see its README):
- `render.html`: offline studio renders, with parameters for colour, view, pan, tilt, camera and light
- `shop.html`: the shop scenes
- `composite.py`: places a render into a photo
- `lib/three/alaroCamera.ts`: the real-time model used by the site (same shape as the offline renders)

---

## 7. Key files

```
app/layout.tsx            fonts, metadata, intro-hide script, Header, Lenis
app/page.tsx              section order
app/globals.css           tokens, components, hero/phone/HUD/grain, How-it-works chapter CSS
components/Header.tsx     header, logo, mobile menu, cart count
components/SmoothScroll.tsx
components/hero/          Hero, HeroCopy, PhoneBody, CameraHUD, DetectionBox, PreviewCopy,
                          FilmPlayer, scenes.ts, videoClock.ts, useHeroTimeline.ts
components/sections/      one file per section + PageEffects (reveals, parallax, header state)
lib/brand.ts              BRAND_NAME, nav, hero/preview copy, PRICE
lib/headerTheme.ts        header colour logic; lib/cart.ts bag count; lib/lenis.ts scroll lock
lib/three/alaroCamera.ts  procedural camera model + studio environment
lib/three/stage.ts        WebGL stage, contact shadow, shelf scene
scripts/relativize-export.mjs   makes the static export run from any sub-path
tools/camera-render/      offline render tooling
docs/HERO_CONTEXT.md      the original hero brief (partly superseded by this file)
```

---

## 8. Placeholders and open items

- **Business facts:** price `₹7,499` and the EMI line (`lib/brand.ts`, `Experience.tsx`), specs ("2K", "350° pan · 75° tilt"), delivery, returns and warranty terms, and all FAQ answers.
- **Names:** Mira, Arlo, Zoe, Leo, Milo and Grandpa, used in captions and the HUD.
- **Business imagery:** illustrated 3D scenes, to swap for real photography.
- **Demo-only features:** Ask Alaro answers, the cart (a counter only, no checkout), the footer email form, and nav links that point to on-page anchors.
- **Not yet verified:** real H.264 playback in Safari/Chrome on device, Lighthouse scores, and 60fps on mid-range phones with two WebGL canvases. Testing so far used headless Chromium only.

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
