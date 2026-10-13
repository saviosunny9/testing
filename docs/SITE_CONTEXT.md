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

**Direction (riotters-style pass, Oct 2026):** quiet and technical, modelled on the client's screenshots of drone.riotters.com. The live site could not be fetched from this environment, so the screenshots are the reference. The rules:
- light, large, tightly tracked type, and **no bold anywhere** (max weight 500)
- two-tone headlines: ink, then grey
- mono uppercase labels (`▪ 01 · DESIGN`, `[ PAN ]`)
- hairline grids and dividers, square-ish corners (3px)
- a cool off-white ground with slate ink
- forest green stays the brand dark; fresh green is a small non-text accent
- **text is only slate, white or grey**; colour comes from the film, photography and product finishes

### Colour tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#fafafa` | page |
| `--paper` / `--paper-2` | `#f1f2f2` / `#e6e8e9` | cool off-white surfaces, tiles, menu button |
| `--ink` / `--charcoal` | `#1f2d33` | slate text, primary buttons |
| `--ink-2` | `#3d4a50` | secondary dark text |
| `--muted` | `#7d868a` | body copy, labels |
| `--muted-2` | `#a3aaad` | `.hl` second-line grey, inactive word-tabs |
| `--faint` | `#cfd4d6` | start colour of scroll-read words |
| `--line` | `#d9dddf` | hairlines |
| `--black` | `#111a1e` | footer |
| `--forest` / `--forest-2` | `#172d25` / `#213c31` | brand dark sections (Privacy, Understands) |
| `--fresh` | `#54c878` | non-text accents only: focus ring, room markers, cart badge |
| `--tint-graphite` / `--tint-white` / `--tint-red` | `#eceeef` / `#f3f4f4` / `#f2efee` | grounds behind each product finish |

### Type: Switzer (light) + Geist Mono

- **Fonts:**
  - Switzer 300, 400, 400 italic and 500, self-hosted in `app/fonts/switzer/` through `next/font/local` (600/700 removed)
  - Geist Mono 400 (`--font-mono`), via `next/font/google`, for labels
- **Licence:** Switzer is © Indian Type Foundry, ITF Free Font License; see `app/fonts/switzer/LICENSE.md`.

| Class | Size | Weight / tracking / leading |
|---|---|---|
| `.display` | (modifier) | 300 / -0.045em / 1 |
| `.h-hero` | `clamp(2.75rem, 5.6vw, 6rem)` | 300 / -0.05em / 1 |
| `.h-mega` | `clamp(5rem, 15vw, 15rem)` | 300 / -0.06em (footer wordmark) |
| `.h-section` | `clamp(2.5rem, 4.8vw, 5rem)` | 300 |
| `.h-card` | `clamp(1.5rem, 2.2vw, 2.1rem)` | 300 / -0.035em |
| `.h-small` | 19px | 400 / -0.02em |
| `.body-lg` | `clamp(1.25rem, 1.9vw, 1.9rem)` | 300 / -0.03em / 1.3 (big paragraphs) |
| `.stat` | `clamp(2.6rem, 4.6vw, 4.5rem)` | 300 / -0.05em (figures) |
| `.label` / `.eyebrow` | 11px mono | uppercase, +0.14em, grey; `.label-sq` adds ▪, `.label-br` wraps in [ ] |

- **Emphasis:** `.hl` greys the second half of a headline. Inside `.on-dark` it becomes 50% white.
- **Dark sections:** add `on-dark` so labels, `.hl`, hairlines and links switch to white or grey.

### Components

- **Header:**
  - left: logo ▪ "Smart home camera"
  - centre: a live local clock ("UTC 11:18 am")
  - right: bag (n) and a grey `menu` button
  - the menu is a full-screen overlay with numbered display links
- **Buttons:**
  - 3px radius, weight 400
  - `.btn-dark` (slate), `.btn-light`, `.btn-glass`, `.btn-quiet` (paper-2), `.btn-outline`
- **Word-tabs (`.word-tab`):** huge light words; the active one is ink with a 2px underline that draws in. Used for For family / For business.
- **Stat row (`.stat-row`):** three hairline columns, a `[ LABEL ]` and a big light figure with a small grey unit.
- **Numbered hairline lists:** `01` mono number, title, grey detail and a thin icon at the right. Used in Privacy, the app points and the FAQ.
- **Scroll-read text (`[data-read]`):** words darken from `--faint` to the paragraph's colour as it rises (SplitText + scrub in `PageEffects`). Off for reduced motion.
- **Wordmarks:** the giant `.hero-word` "alaro" sits behind the hero's end composition; an `.h-mega` "alaro" at 8% white closes the footer.
- **Radii:** 3px on cards, tiles and images. Phone and app-UI radii stay realistic. Shadows are neutral.

### Motion rules

- Animate only transform, opacity, filter and clip-path.
- `[data-reveal]` fades up once on enter; `[data-parallax]` drifts an element while in view.
- `prefers-reduced-motion`:
  - static hero composition
  - the camera journey shown as stacked stills
  - no Lenis
- The hero intro never locks scrolling.

---

## 4. Page order (`app/page.tsx`)

| # | Section | File | Anchor | Surface |
|---|---|---|---|---|
| 0 | Header (fixed) | `components/Header.tsx` | | white text over film / dark, ink elsewhere |
| 1 | Hero: film closes into the Alaro camera's glass, moments around it | `components/hero/*` | `#hero`, `#top` | film, then paper |
| 2–4 | Camera journey: one pinned section; copy changes on scroll while the camera (rendered frames) stays on the right | `sections/CameraJourney.tsx` | `#design` | paper, white, forest |
| 5 | Captured on Alaro: moments bento, For family / For business word-tabs | `sections/Moments.tsx` | `#moments` | white |
| 6 | App showcase: realistic tilted phone | `sections/AppShowcase.tsx` | `#app` | white |
| 7 | Colour tiles | `sections/ProductTiles.tsx` | `#colours` | white with neutral tiles |
| 7b | Placement: "Stand it up. Or mount it." two photos (table, wall mount) with `[ 01 ]` hairline captions | `sections/Placement.tsx` | `#placement` | white |
| 8 | At home: the camera in five real rooms (living room, reading corner, playroom, kitchen, bedroom) | `sections/AtHome.tsx` | `#at-home` | white |
| 8b | Evening band: wide lamp-lit living-room photo, mono label, the camera tagged `[ ALARO ]` | `sections/Evening.tsx` | | white |
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

**Opening:** a film in an 8px white frame (`.cam-frame`, inset by `--hero-gap`; the white `.hero-canvas` behind it fades out as the film closes into the camera), grainy and black and white, with the bottom-row copy (eyebrow, H1 "The intelligence / behind your space." with the second line at 55% white, Watch the film / Buy Alaro, description) and an intro character reveal.

**Scroll timeline** (`useHeroTimeline.ts`): one ScrollTrigger over a 360vh track (300vh on mobile).

| Progress | What happens |
|---|---|
| 0–0.18 | Copy and gradient fade out |
| 0.03–0.23 | Grain fades; the film turns to colour |
| 0.06–0.52 | **Aperture:** one value drives an `ellipse()` clip on `.cam-frame`, from covering the stage down to the camera's glass face (`.cam-target`), and the film's own cover-fit to the visible part of that ellipse, so it never letterboxes. Meanwhile the camera render (`HeroCamera.tsx`, `media/hero/alaro-camera*.webp`) settles from 1.25× to 1× around its face. |
| 0.16–0.6 | Six moment tiles (`MomentTiles.tsx`), each a short looping clip from the film (`media/moments/*.webm|mp4`, poster `.jpg`), settle from a pull toward the centre at 1.18×. They sit in two zones either side of the camera + caption column (`--cw`), so they can never touch it or the caption. Clips load on first play and run only while progress > 0.12 and the hero is on screen. On phones and portrait tablets four tiles tuck behind the camera's edges within its height. Reduced motion shows the posters. |
| 0.4–0.62 | The film plays inside the glass under a highlight and rim shade (`.cam-glass`) |
| 0.62–0.74 | The film shrinks into the glass and fades; the render's real glass and lens remain. Then the status light comes on (`.hero-cam-dot`, green). |
| 0.66 | Caption under the camera: "Alaro smart camera / Every moment, kept." |

- **Camera geometry:** `CAMERA` in `HeroCamera.tsx` holds the render's face ellipse, status dot and body box as fractions of the image. CSS (`.hero-cam`, `--ch` image height, `--ph`/`--pw` body size) centres the body at 44% of the stage. Re-render with `tools/camera-render` (`shoot.js` writes the matching `.json`) and update both if the model changes.
- **Reduced motion:** a static poster hero, then the camera and collage composition as a normal section.
- **Film player:** "Watch the film" opens `FilmPlayer.tsx` (unchanged).

### Camera journey (`CameraJourney.tsx`, `public/media/camera/f00–f32.webp`)

**How it works:** one pinned section (`#design`, 300svh). The camera sits in the right column; the copy in the left column changes as you scroll. Each frame is a render of the hero camera, so the same object carries from the hero into this section.

- **Frames:** 33 renders from `tools/camera-render/sequence.js`, cropped to one shared box (1119 × 1300). f00–f22 pan the head from −61° to +49° in 5° steps; f09 is the hero's own view (−16°); f23–f32 tip the head from 7.5° to 75°.
- **Scroll mapping** (`frameAt`):
  - 0–⅓ Design: pan turns right (f09 → f22)
  - ⅓–⅔ Pan and tilt: sweeps left across the room (f22 → f00)
  - ⅔–1 Privacy: back to centre, then tips down (f00 → f09 → f23–f32)
- **Panels** cross-fade in one grid cell, so the section never changes height. The background moves from paper to white to forest (`on-dark`), and the header switches to light type over the forest panel.
- **Arrival:** the camera fades in from 30% of the viewport width to the left as the section comes up, which reads as it coming across from the hero. This is a hand-off, not a shared-element morph.
- **Preloading:** all 33 frames load once the section is within 150% of a screen.

| Panel | Copy |
|---|---|
| 01 Design | "Designed to disappear into your home." + 14 cm / 7.4 cm / 3 finishes |
| 02 Pan and tilt | "Turns to see the whole room." + 350° / 75° / 2K HDR |
| 03 Privacy | "Private by design." + on-device recognition, end-to-end encryption, privacy mode |

**Mobile and reduced motion:** a stacked version (each panel with a still frame) shows below 768px or when reduced motion is on. The previous three.js journey (`ProductJourney.tsx`, `lib/three/*`) was removed; `lib/three` is still used by `ProductViewer`.

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
| `stills/*.jpg` | warm-graded frames from the film |
| `audio/hero-music.mp3`, `audio/hero-voice.mp3` | the hero's sound: an original ambient loop (F maj9 – E m7 – D m9 – C add9 at ~63 bpm, exactly the film's 15.28 s) and a voiceover story timed to the film's scenes (Piper "en_US-joe-medium", CC0 voice). Built by `tools/audio/build_audio.py`. **Placeholder voice: swap in a professional recording for launch.** |
| `moments/*` | 2–3 s loops cut from the film for the hero tiles (webm VP9 + mp4 H.264 + poster), ~1.3 MB total |
| `product/front-*.webp`, `three4-white`, `pan-left-white`, `pan-right-white`, `rear-red` | transparent renders of the model |
| `life/*.jpg` | lifestyle photos with the camera composited in. `lounge`, `evening`, `playroom`, `kitchen-family` and `companion` come from the client's reference photography via `tools/camera-render/lifestyle.py`, which also removes other brands' products (a robot vacuum and dock, a speaker, a sunscreen stick, a spray bottle's label, a pet-food bag and frame). `table` and `wall` replace another brand's camera in two product photos (the wall mount is rendered with `mount=wall`). `bedroom` is a film composite; `shop-*` are 3D scenes. **Check usage rights for the client photos before launch.** |
| `app/fonts/switzer/*` | Switzer web fonts + licence note |

**Why the model is our own (first-draft brief, §4):**
- The brief asked for a licensed online model matching Alaro's form.
- From the build environment, Sketchfab and the reference sites were unreachable (blocked by network policy), so no third-party model could be searched, compared or licence-checked.
- Following the brief's fallback, the existing procedural model was upgraded instead (materials, lens, shadows) and is used consistently across the hero renders, the camera journey frames and the buy viewer.
- **If a licensed GLB is sourced later**, it can replace `createAlaroCamera()` in `lib/three/stage.ts`, then the journey frames need re-rendering (`tools/camera-render/sequence.js`).

**Imagery:** no stock photography is used; network access to stock sites was blocked. Real lifestyle and shop photography is still wanted.

---

## 7. Key files

```
app/layout.tsx            Switzer (next/font/local), metadata, intro-hide script, Header, Lenis
app/page.tsx              section order
app/globals.css           tokens, type scale, buttons, hero camera/grain, moment tiles, device
app/fonts/switzer/        font files + LICENSE.md
components/hero/          Hero, HeroCopy, HeroCamera (+ CameraGlass), MomentTiles, PreviewCopy, FilmPlayer,
                          useHeroTimeline.ts
components/sections/      CameraJourney, AppShowcase, ProductTiles, Moments, AtHome, Understands, AskAlaro,
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
- **Names:** Mira, Arlo, Zoe, Leo, Milo and Grandpa are used in captions.
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


## Sound (hero)

- **Toggle:** the header's music icon (`components/SoundToggle.tsx`): four bars that move while sound is on. Off by default; browsers only allow audio to start from a click.
- **Engine:** `lib/heroSound.ts`, Web Audio. The music loops sample-exactly on the film length; the voice plays once.
- **Sync:** turning sound on restarts the film, so the story begins at its first scene. The music ducks to 50% while the voice speaks.
- **Off and away:**
  - turning sound off fades out in 0.45 s
  - the audio pauses while the tab is hidden
  - a story cut off part-way starts again next time; once it has finished, only the music plays
- **Voiceover script** (film time → line):
  - 0.5 "Home is made of little moments."
  - 3.0 "Game nights that run late."
  - 5.1 "Wishes, made over candles."
  - 7.6 "Stories before bed."
  - 10.1 "And first flights, across the kitchen."
  - 13.3 "Alaro keeps them close." (spelled "Alahro" for the voice: uh-LAH-roh)
  - 15.6 "Even when you're away."
