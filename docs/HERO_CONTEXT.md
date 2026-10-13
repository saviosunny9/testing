# Hero Section Context — Smart Home Camera Site

> **For Claude Code.** This file is the brief for building the website hero and its scroll interaction.
> Read all of it before writing code. Build exactly what is described here. Where something is not
> specified, choose the simplest option that fits the brand rules in §3.

---

## 0. TL;DR

Build a full-bleed **video hero** that copies the layout of [sequel.co](https://www.sequel.co/) (details in §4).
When the user scrolls, the hero is **pinned**. The full-screen video **shrinks into a framed live camera
preview**: a rounded 16:9 "live feed" card with a security-camera HUD (REC/LIVE badge, camera name,
running timestamp, viewfinder corners, AI detection boxes, controls). Warm sonar rings radiate behind it
and notification toasts pop in. After the camera preview is fully formed, the pin releases and the page
continues into normal sections.

The product is a **smart home security camera** that captures everyday moments and helps families keep an
eye on **kids, pets, and grandparents**. The tone is warm and human, not surveillance or CCTV.

---

## 1. Assets in this repo

| Path | What | Notes |
|---|---|---|
| `public/media/hero-1080.mp4` | Hero video, 1920×1080, 25fps, 15.2s, H.264, no audio, ~5 MB | Letterbox bars already cropped out. `faststart` enabled. Desktop source. |
| `public/media/hero-720.mp4` | Same video at 1280×720, ~2.4 MB | Use for viewports < 768px wide or on `saveData`. |
| `public/media/hero-poster.jpg` | Poster frame (t = 1.4s) | Use as `poster` and as the reduced-motion fallback. |
| `docs/reference/moodboard.webp` | Brand moodboard | Source of the palette, type feel, and imagery direction. |
| `docs/reference/video-scenes.jpg` | One frame per scene of the video | Quick visual index of the 6 scenes. |
| `docs/reference/detection-boxes.jpg` | Each scene with its §6.4 detection box drawn | Shows where the AI boxes should land. |

The original upload was `alaro-short.mp4`. **"Alaro" is used as the working brand name** throughout this
doc. Put it in one constant (`BRAND_NAME`) so it can be swapped.

### 1.1 Video scene map (measured with ffmpeg scene detection)

| # | Time (s) | Scene | HUD camera label | Detection label |
|---|---|---|---|---|
| 1 | 0.00 – 2.80 | Two girls laughing on a sofa with a plush toy | `Living Room · Cam 01` | `Kids · Playing` |
| 2 | 2.80 – 4.80 | Dad and son playing Jenga | `Family Room · Cam 02` | `Child · Game night` |
| 3 | 4.80 – 7.20 | Family birthday dinner, grandpa blowing out candles | `Dining · Cam 03` | `Grandpa · Moment saved` |
| 4 | 7.20 – 9.68 | Toddler reading a book with mum on the bed | `Bedroom · Cam 04` | `Child · Story time` |
| 5 | 9.68 – 13.12 | Mum lifting a toddler in a bright kitchen | `Kitchen · Cam 05` | `Child · Motion` |
| 6 | 13.12 – 15.25 | Ginger cat sitting on a wooden floor by plants | `Living Room · Cam 01` | `Pet · Milo` |

The video loops. Scene 6 has a dark, out-of-focus foreground on the left, so keep HUD text on the
right side readable there by using the frosted chips (§6.2).

---

## 2. Tech stack (default)

- **Next.js 14+ (App Router) + TypeScript + Tailwind CSS v3/v4**
- **GSAP 3.12+** with `ScrollTrigger` and `SplitText` (all GSAP plugins are free now). Install with `npm i gsap`.
- **Lenis** (`lenis`) for smooth scrolling, wired to ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` and run `lenis.raf` from `gsap.ticker`).
- **lucide-react** for icons. Use `strokeWidth={1.5}` to match the line icons on the moodboard.
- Fonts come from `next/font/google` (see §3.2).

If the repo already uses a different framework, keep the same structure and the same GSAP timeline. The
interaction must not depend on React.

### Suggested file structure

```
app/
  layout.tsx            // fonts, <Header/>, Lenis provider
  page.tsx              // <Hero/> then the sections in §8
components/
  Header.tsx
  hero/
    Hero.tsx            // pinned stage + timeline
    HeroCopy.tsx        // headline, CTAs, description (sequel layout)
    CameraHUD.tsx       // overlay rendered inside the final frame rect
    DetectionBox.tsx    // AI bounding box synced to video time
    SonarRings.tsx      // warm concentric rings behind the frame
    NotificationToasts.tsx
    useHeroTimeline.ts  // all GSAP / ScrollTrigger code
    scenes.ts           // scene map from §1.1 + box coords from §6.4
lib/brand.ts            // BRAND_NAME, copy strings
```

---

## 3. Brand rules (from the moodboard)

The moodboard uses warm, natural-light family imagery, a cream background, deep forest green, a bright
leaf green, warm ember/orange glows (the sonar rings around the phone and door lock), peach and salmon
product colours, rounded geometric sans type, and simple line icons. Layouts are clean, with lots of air.

### 3.1 Colour tokens

```css
:root {
  --cream:      #F6F1EA;  /* page background */
  --sand:       #EDE4D8;  /* surfaces, cards */
  --linen:      #FBF8F3;  /* raised cards */
  --ink:        #17130F;  /* primary text (warm black, never #000) */
  --ink-muted:  #5E564C;  /* secondary text */
  --line:       #E3D9CC;  /* hairlines, borders */

  --forest:     #0F3B28;  /* brand dark: footer, dark sections, solid buttons on light bg */
  --leaf:       #4CC764;  /* brand accent: LIVE, detection boxes, success, key CTAs */
  --leaf-soft:  #DDF3E1;

  --ember:      #F07A2E;  /* warm accent: sonar rings, highlights */
  --apricot:    #F8B26A;
  --peach:      #F6A88E;  /* product colour, soft fills */

  --rec:        #FF4A3D;  /* ONLY for the REC dot */
  --hud-glass:  rgba(23, 19, 15, 0.38);   /* frosted HUD chips over video */
  --warm-shade: rgba(28, 18, 10, 0.78);   /* hero bottom gradient end (warm, not pure black) */
}
```

Rules:
- The page background is `--cream`, never pure white. Dark sections use `--forest` or `--ink`.
- Use `--leaf` sparingly: the live/detection language and one primary CTA per view.
- `--ember` and `--apricot` are for glow and radial gradients, almost never for flat fills behind text.

### 3.2 Typography

| Role | Font (Google) | Settings |
|---|---|---|
| Display + UI | **Plus Jakarta Sans** (500, 600, 700) | Headlines weight 500–600, `letter-spacing: -0.04em`, `line-height: 1` |
| Italic accent word | **Instrument Serif** *Italic* | One word per headline, like Sequel's "*legacy,*" |
| HUD / timestamps | **JetBrains Mono** (400, 500) | `font-variant-numeric: tabular-nums`, uppercase, `letter-spacing: 0.06em` |

- Hero H1: `font-size: clamp(3rem, 5vw, 6.5rem)`.
- Section H2: `clamp(2.25rem, 3.6vw, 4.25rem)`.
- Body: 17–18px, `line-height: 1.5`.

### 3.3 Imagery and motion feel

- Imagery is warm and golden, with natural window light, real lived-in homes, candid moments, and diverse
  families, grandparents, toddlers, and pets. Never use cold blue "security" stock, hoodie burglars, or grainy CCTV.
- Motion is soft and confident. Use `power2.inOut` or `expo.out` eases. Nothing bouncy. HUD elements
  "power on" with a short fade and blur.
- Corners: cards `24px`, buttons fully rounded (pill), HUD chips pill-shaped.
- Glass: `backdrop-filter: blur(20px) saturate(140%)`, `border: 1px solid rgba(255,255,255,.2)`,
  `background: rgba(200,200,200,.10)`. This is the same recipe Sequel uses.

---

## 4. Hero layout: match sequel.co

This is the reference structure, taken from the live sequel.co markup and CSS. Replicate the layout and
intro motion, and swap in our content.

### 4.1 Header (fixed, overlays the video)
- `position: fixed; inset: 0 0 auto 0; z-index: 60`. Padding is `24px` (mobile) and `40px` (≥1024px).
- A soft top gradient sits behind it: `h-32 bg-gradient-to-b from-black/40 to-transparent`, `pointer-events: none`.
- Three columns, each `flex: 1`:
  - **Left:** wordmark `alaro` in lowercase, Plus Jakarta Sans 700, white. Use a rounded, friendly wordmark like "nimly" on the moodboard.
  - **Center** (≥1024px only): links `How it works`, `Features`, `Plans`, `Stories` in `text-white/90`, which turn white on hover, with `gap: 2rem`.
  - **Right** (≥1024px): a solid pill button `Shop the camera →`. It has a white background and `--ink` text and is medium size.
- **Mobile:** a two-line hamburger (20×2px lines, 5px gap) that morphs into an ×. It opens a full-screen
  `--forest` overlay revealed with `clip-path: circle(0% → 150% at 50% 50%)`. The overlay has large links (`text-4xl`, weight 300) and social icons at the bottom.
- **Scroll behaviour:** once the camera-preview phase starts (progress > 0.25, see §5), the header text changes from
  white to `--ink`, because the stage background becomes cream. Tween the `color` / CSS var over 0.3s.

### 4.2 Hero stage
- `height: 100svh`, the video is full-bleed with `object-fit: cover`, and the stage background is `#000` until the video plays.
- Use the poster as a CSS background on the stage and hide it once the video fires `playing` (like Sequel's `.section1PosterHidden`).
- A bottom gradient is pinned to the bottom of the stage: `height: 50vh; background: linear-gradient(to bottom, transparent, var(--warm-shade))`.
- **Content row** sits at the bottom of the stage: `display:flex; align-items:flex-end; padding: 5rem; padding-bottom: 7vh`.
  - **Left (flex-grow):** H1, left-aligned, white.
    > Every moment, *watched over.*

    "watched over." is set in Instrument Serif Italic with `margin-left: .25em`. Other options to put in `lib/brand.ts`:
    *"Home, held close."*, *"See them, even when you're away."*, *"The little moments, kept."*
  - **Right column:** `align-items:flex-start; gap: 1.75rem`, holding:
    1. A **button row** (`gap: 1rem`):
       - A glass pill `▶ Watch the film` (small). It opens a fullscreen player with sound off (the video has no audio) and controls `restart / play-pause / time / close` in a glass pill bar, as Sequel does.
       - A solid pill `Get Alaro →` with a `--leaf` background and `--ink` text.
    2. A **description**, `max-width: 320px`, `rgba(255,255,255,.94)`, 17px:
       > A smart home camera that captures the little moments and quietly keeps an eye on the ones you love: kids, pets, and grandparents.
- **Mobile (<768px):** stack the content and center it, with `padding: 3vh`. The gradient is `70vh` and fades to a fully opaque `--warm-shade`.
  The right column uses `flex-direction: column-reverse`, so the description shows above the buttons, and everything is center-aligned.

### 4.3 Intro animation on load (not scroll-driven; copy of Sequel's)
Run this once, after `document.fonts.ready` (with a 3s timeout) and after the video's first `playing` event:
1. The video goes from opacity `0 → 1` over 1.2s.
2. The H1 is split with `SplitText` into words and chars. The chars go from `opacity:0, filter: blur(8px)` to `opacity:1, blur(0)` with `stagger: 0.02`, `duration: 0.9`, `ease: power2.out`.
3. The header goes from `opacity:0, y:-16vh` to `opacity:1, y:0` over 1.2s with `power2.inOut`. It overlaps the step 2 tween by 0.5s.
4. The button row and description go from `opacity:0, y:8vh` to `opacity:1, y:0` over 1.0s with `power2.inOut`, `stagger: 0.08`.
5. Lock scroll (`lenis.stop()`) until step 2 finishes, then call `lenis.start()`. Cap the lock at 2.5s.

---

## 5. The scroll interaction: "full screen → camera preview"

### 5.1 Concept
On scroll, the cinematic full-bleed film turns into what a parent sees in the Alaro app: the same footage,
now framed as a **live feed** with a HUD. The story is: *the moments you just watched are what Alaro
captures for you.*

### 5.2 Structure

```html
<section id="hero" class="relative h-[350vh]">          <!-- scroll track -->
  <div class="hero-stage sticky top-0 h-[100svh] overflow-hidden bg-[--cream]">
    <SonarRings/>                                         <!-- z-0, behind the frame -->
    <div class="frame-target" aria-hidden />             <!-- invisible, CSS-positioned final rect -->
    <div class="cam-frame absolute inset-0 z-10">         <!-- gets clip-path -->
      <video class="cam-video absolute inset-0 h-full w-full object-cover" .../>
      <div class="hero-gradient"/>                        <!-- bottom warm gradient -->
    </div>
    <CameraHUD class="absolute z-20" />                  <!-- positioned exactly over .frame-target -->
    <HeroCopy class="absolute inset-0 z-30" />           <!-- sequel layout, §4.2 -->
    <PreviewCopy class="z-30" />                          <!-- end-state headline + toasts -->
  </div>
</section>
```

Use **`position: sticky`** for the pin. If you use ScrollTrigger `pin`, set `pinSpacing` correctly and
test it with Lenis. The scroll track is `350vh` (`300vh` on mobile). One ScrollTrigger drives a single
master timeline with `scrub: 0.8`, `start: 'top top'`, `end: 'bottom bottom'`, and `invalidateOnRefresh: true`.

### 5.3 Final frame rectangle (`.frame-target`)
This is defined in CSS so it stays responsive. JS **reads its rect** on refresh and builds the clip-path from it.

```css
.frame-target {
  position: absolute;
  left: 50%; top: 50%;
  width: min(68vw, 1120px);
  aspect-ratio: 16 / 9;
  transform: translate(-50%, -46%);   /* sit slightly above center to leave room for the caption */
  border-radius: 28px;
  visibility: hidden;
}
@media (max-width: 767px) {
  .frame-target { width: calc(100vw - 32px); transform: translate(-50%, -60%); border-radius: 20px; }
}
```

`CameraHUD` uses the same CSS (or copies the rect values) so that it sits exactly on the final frame.

### 5.4 Timeline (progress `p` from 0 to 1 over the scroll track)

| p | What happens | Properties |
|---|---|---|
| 0.00 – 0.22 | **Hero copy leaves.** The H1, buttons, and description fade, rise, and blur out. The bottom gradient fades out. | `HeroCopy`: `opacity 1→0, y 0→-6vh, filter blur(0→6px)`. `.hero-gradient`: `opacity 1→0` |
| 0.10 – 0.55 | **Frame shrinks.** `.cam-frame` clip-path goes from full screen to the `.frame-target` rect with rounded corners. Inside, the video scales `1.12 → 1.0` for a "zoom out to the lens" feel. The cream stage shows around it. | `clipPath: inset(0px 0px 0px 0px round 0px)` → `inset(${t}px ${r}px ${b}px ${l}px round 28px)`. `.cam-video`: `scale 1.12→1` |
| 0.25 | The header changes to dark text. | toggle `data-theme="light"` on the header |
| 0.40 – 0.60 | **Sonar rings appear** behind the frame and expand. | `SonarRings`: `opacity 0→1, scale .6→1` (they then pulse on a loop, see §6.5) |
| 0.48 – 0.68 | **HUD powers on.** Corner brackets draw in (scale from the corners), then the top chips, bottom timestamp, and controls fade in with a staggered blur. Add one 120ms "flicker": the frame's brightness goes `1 → 1.25 → 1`. | `CameraHUD` children: `opacity 0→1, filter blur(4px→0)`, `stagger .05` |
| 0.60 – 0.70 | The **detection box** draws (its border animates in) and the label chip slides up. | see §6.4 |
| 0.62 – 0.85 | **Preview copy and toasts arrive.** The section heading fades up below the frame (desktop: left-aligned under the frame; mobile: below it). Three notification toasts pop in, staggered, around the frame edges. | `opacity 0→1, y 24px→0`, `stagger .08`, toasts `scale .92→1` |
| 0.85 – 1.00 | **Hold.** Everything stays on screen so the end state can be read. Then the sticky releases and the next section scrolls over. | — |

Build the clip-path values with function-based values so they recompute on resize:

```ts
const target = () => {
  const s = stage.getBoundingClientRect();
  const f = frameTarget.getBoundingClientRect();
  return `inset(${f.top - s.top}px ${s.right - f.right}px ${s.bottom - f.bottom}px ${f.left - s.left}px round 28px)`;
};

gsap.set(camFrame, { clipPath: 'inset(0px 0px 0px 0px round 0px)' });

const tl = gsap.timeline({
  defaults: { ease: 'none' },
  scrollTrigger: {
    trigger: '#hero', start: 'top top', end: 'bottom bottom',
    scrub: 0.8, invalidateOnRefresh: true,
    onUpdate: (self) => header.dataset.theme = self.progress > 0.25 ? 'light' : 'dark',
  },
});

tl.to(heroCopy,     { opacity: 0, yPercent: -6, filter: 'blur(6px)', duration: 0.22 }, 0)
  .to(heroGradient, { opacity: 0, duration: 0.2 }, 0)
  .to(camFrame,     { clipPath: target, duration: 0.45, ease: 'power2.inOut' }, 0.10)
  .fromTo(camVideo, { scale: 1.12 }, { scale: 1, duration: 0.45, ease: 'power2.inOut' }, 0.10)
  .fromTo(rings,    { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.2 }, 0.40)
  .fromTo(hudItems, { opacity: 0, filter: 'blur(4px)' }, { opacity: 1, filter: 'blur(0px)', stagger: 0.02, duration: 0.12 }, 0.48)
  .fromTo(detection, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.60)
  .fromTo(previewCopy, { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.03, duration: 0.15 }, 0.62)
  .fromTo(toasts,   { opacity: 0, y: 16, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.12 }, 0.66)
  .to({}, { duration: 0.15 });   // hold, so total duration ≈ 1
```

The whole thing must be **fully reversible**: scrolling back up turns the preview back into the cinematic hero.

### 5.5 Rules
- The video **keeps playing and looping** through every phase. It is the "live feed". Never swap it for another element.
- Animate only `transform`, `opacity`, `filter`, and `clip-path`. Set `will-change` on `.cam-frame` and `.cam-video` while the trigger is active.
- Don't animate `width`/`height`/`top`/`left` of the video, because it causes layout thrash.
- Pause the video when `#hero` is fully out of view (IntersectionObserver), and resume it when it comes back.

---

## 6. Camera preview HUD (end state)

The goal is a believable live camera app preview that still looks premium and warm, not like a CCTV monitor.
All HUD text is white with `text-shadow: 0 1px 2px rgba(0,0,0,.35)`. Chips use `--hud-glass` and blur.

### 6.1 Layout inside the frame (inset 18px; 12px on mobile)

```
┌────────────────────────────────────────────────────────────────┐
│ ⌜ ● REC  LIVE  │ Living Room · Cam 01           ᯤ  ▮▮▮ 82%  HD ⌝│
│                                                                │
│                    ┌───────────────┐                           │
│                    │               │  ← detection box (leaf)   │
│                    │               │                           │
│                    └─[ Kids · Playing ]                        │
│                                                                │
│ ⌞ TUE 13 OCT 2026 · 18:42:07         🎙  📷  ⏺  ⛶            ⌟│
│ ▁▁▁▁▁●▁▁▁▁▁▁▁●▁▁▁▁▁▁●▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ │  ← activity timeline
└────────────────────────────────────────────────────────────────┘
```

### 6.2 Elements
- **Viewfinder corners:** four L-brackets, 22px arms, 2px stroke, white at 85% opacity, `border-radius` 2px on the stroke ends.
- **Top-left chip:** a pulsing **REC dot** (`--rec`, 8px, `opacity 1↔0.35` every 1.2s), then `REC`, a `LIVE` pill (`--leaf` background, `--ink` text, 10px mono), a divider, and the **camera label**. The label changes per scene (§1.1) with a 200ms crossfade.
- **Top-right chip:** Wi-Fi icon, battery `82%`, and `HD`. Use mono, 11px.
- **Bottom-left:** a **live timestamp** that shows the user's real local date and time (`EEE dd MMM yyyy · HH:mm:ss`) and updates every second. Use mono, tabular numbers.
- **Bottom-right:** four 40px glass circle buttons: `Mic` (talk back), `Camera` (snapshot), `Circle` (record), and `Maximize`. Hovering one scales it to 1.06. They are decorative but focusable, with `aria-label`s.
- **Activity timeline:** a 3px bar along the bottom edge with a white playhead tied to `video.currentTime / duration`. It has event dots at each scene start, coloured by type: person = `--leaf`, pet = `--peach`, motion = `--apricot`.
- **Grain:** a 3–4% opacity SVG noise overlay on the frame, plus a soft inner vignette (`box-shadow: inset 0 0 120px rgba(0,0,0,.25)`).
- **Frame shadow:** in the end state the frame casts `0 40px 80px -20px rgba(80,40,10,.35)`, a warm shadow on cream.
- **Mobile:** hide the top-right chip and the mic/record buttons. Keep REC/LIVE, the label, the timestamp, and the detection box.

### 6.3 Detection box behaviour
- One box per scene, positioned in **percent of the frame**. Since the video uses `object-fit: cover` with the same 16:9 aspect at the end, the percentages map 1:1.
- Style: `border: 2px solid var(--leaf)`, `border-radius: 14px`, with corner ticks only (it's fine to use a dashed SVG `stroke-dasharray` draw-in) and a `--leaf` glow (`0 0 0 4px rgba(76,199,100,.18)`).
- The label chip is attached to the bottom-left of the box: a `--leaf` background, `--ink` text, 11px mono, e.g. `KIDS · PLAYING`.
- On a scene change (detected with `timeupdate` / `requestVideoFrameCallback` against the §1.1 times), tween the box to the new coords over 450ms (`power2.inOut`) and crossfade the label.
- Add an idle drift of ±0.6% (a slow yoyo) so it feels like it's tracking, not frozen.
- Scene 3 also shows a small `★ Moment saved` toast that slides in from the box edge.

### 6.4 Detection box coordinates (percent of frame; verified against the real frames; see `docs/reference/detection-boxes.jpg`)

```ts
export const SCENES = [
  { start: 0.00,  end: 2.80,  cam: 'Living Room · Cam 01', label: 'Kids · Playing',        type: 'person', box: { x: 30, y: 8,  w: 52, h: 84 } },
  { start: 2.80,  end: 4.80,  cam: 'Family Room · Cam 02', label: 'Child · Game night',    type: 'person', box: { x: 40, y: 42, w: 22, h: 46 } },
  { start: 4.80,  end: 7.20,  cam: 'Dining · Cam 03',      label: 'Grandpa · Moment saved', type: 'person', box: { x: 54, y: 27, w: 42, h: 68 } },
  { start: 7.20,  end: 9.68,  cam: 'Bedroom · Cam 04',     label: 'Child · Story time',    type: 'person', box: { x: 33, y: 20, w: 29, h: 72 } },
  { start: 9.68,  end: 13.12, cam: 'Kitchen · Cam 05',     label: 'Child · Motion',        type: 'motion', box: { x: 30, y: 6,  w: 50, h: 88 } },
  { start: 13.12, end: 15.26, cam: 'Living Room · Cam 01', label: 'Pet · Milo',            type: 'pet',    box: { x: 49, y: 35, w: 24, h: 43 } },
];
```

### 6.5 Sonar rings (from the moodboard's orange glow around the phone and door lock)
- Use 4–5 concentric rounded rectangles that follow the frame's shape (not circles, so they match the 16:9 frame), each larger than the last.
  Stroke them `1.5px rgba(240,122,46,.35)` and fill the area behind them with a radial gradient
  `radial-gradient(60% 60% at 50% 50%, rgba(248,178,106,.45), rgba(240,122,46,.12) 45%, transparent 70%)`.
- After they appear, loop a slow pulse: each ring goes `scale 1 → 1.06, opacity .35 → 0` over 3.2s, staggered by 0.6s, infinitely.
  This conveys "always watching, always on" in warm light.
- On mobile, use 3 rings and a smaller glow.

### 6.6 Preview copy and toasts (end state, outside the frame)
- **Heading** (below the frame, left-aligned to the frame's left edge on desktop, centered on mobile), in `--ink`:
  > Always there, *even when you're not.*

  Subtext in `--ink-muted`, max-width 440px:
  > Live HD view, smart alerts for the people and pets you love, and moments saved automatically. All from one app.
- **Three notification toasts**, styled like iOS notifications: `--linen` background, 16px radius, a soft warm shadow, a 32px app icon tile (a `--forest` square with the leaf-green "a" mark), a bold title, a muted line, and a time. Position them around the frame's edges (desktop), slightly overlapping it:
  1. Top-right, outside: **Grandma's home** · "Front door · arrived safely" · now
  2. Left middle, outside: **Milo is up to something** · "Pet detected in Living Room" · 2m ago
  3. Bottom-right: **Bedtime ✓** · "Kids' room is quiet · Night vision on" · 9:14 PM
- On mobile, show only toast 1, placed below the subtext.

---

## 7. Accessibility, performance, and fallbacks

- **Video markup:**
  ```html
  <video class="cam-video" autoplay muted loop playsinline preload="metadata" poster="/media/hero-poster.jpg" aria-hidden="true">
    <source src="/media/hero-720.mp4"  type="video/mp4" media="(max-width: 767px)">
    <source src="/media/hero-1080.mp4" type="video/mp4">
  </video>
  ```
  (`<source media>` is supported again in current browsers. Also choose the source in JS as a fallback, and honour `navigator.connection.saveData`.)
- **`prefers-reduced-motion: reduce`:**
  - No pin, no scrub, no Lenis, and no SplitText animation.
  - Show the hero as a static poster with the copy visible and a "Play film" button.
  - Render the camera-preview state as a normal static section directly below, with the HUD and rings visible, the rings not pulsing, and a static timestamp.
- The H1 is a real `<h1>`. The HUD is `aria-hidden="true"` except for the control buttons. The toasts are decorative (`aria-hidden`), and their content is repeated in visible copy elsewhere.
- Keep body text contrast ≥ 4.5:1. Over video, the bottom gradient must keep the description legible on the brightest scene (scene 5, the bright kitchen).
- Lighthouse targets: LCP < 2.5s on 4G (the LCP element is the poster, so preload it with `<link rel="preload" as="image">`), CLS ≈ 0, and no long tasks during scroll.
- Call `ScrollTrigger.refresh()` after fonts load and after the video's `loadedmetadata`. Clean up all triggers, tickers, intervals, and observers on unmount (`gsap.context().revert()`).
- Test at 1440×900, 1920×1080, 1280×720, 1024×768 (iPad landscape), 390×844 (iPhone), and 360×740. Also test Safari, where clip-path with `round` works but needs the `-webkit-` prefix fallback for `backdrop-filter`.

---

## 8. Rest of the page (clean layouts, for context; build after the hero)

Keep every section on a 12-column grid with a 1280px max container, `px-6 md:px-10`, and generous
vertical rhythm (`py-24 md:py-36`). Alternate between cream, sand, and one forest-green section.

1. **Statement:** a big centered line, `--ink` on cream, with one italic serif word: "Made for the people, pets, and places you *love*."
2. **Who it watches over:** three tall image cards (aspect 3/4, 24px radius, a glass badge top-left, title and line at the bottom): **Kids** · **Pets** · **Grandparents**. Use warm photography.
3. **Features:** a two-column split. On the left is a sticky phone mockup showing the app (warm orange rings behind it, like the moodboard). On the right is a list of four features with line icons (Lucide 1.5px): *Smart detection*, *Two-way talk*, *Night vision*, *Moments, auto-saved*.
4. **Icon grid:** a 3×3 grid of line icons on `--linen`, echoing the moodboard (temperature, motion, light, home, person, and so on): "Works with your smart home."
5. **Product:** a packshot on `--sand` with a big product name and a `--leaf` dot, like the moodboard's "Touch Pro" box. Price and a `Get Alaro →` CTA.
6. **Testimonials:** two cards from families (portrait, quote, name, "Mum of two · Bristol").
7. **Privacy:** a `--forest` background with white text and `--leaf` accents: on-device processing, encrypted, you own your footage.
8. **Closing CTA:** a billboard-style banner like the moodboard's "Smart living, your way.": a warm photo, a forest-green type panel, and a leaf-green CTA.
9. **Footer:** `--forest`, a large `alaro` wordmark, link columns, and a newsletter field.

---

## 9. Acceptance checklist

- [ ] On load, the hero matches Sequel's layout: fixed three-column header, full-bleed video, bottom-left H1 with an italic serif word, a right column with glass and solid pill buttons above a short description, and a bottom warm gradient.
- [ ] The intro animation plays: chars blur in, the header drops in, and the buttons and description rise.
- [ ] Scrolling pins the hero. The video **visibly shrinks into a rounded 16:9 frame** on a cream background, and the video keeps playing the whole time.
- [ ] The HUD powers on over the frame: REC/LIVE, camera label (changes per scene), real running timestamp, corner brackets, controls, activity timeline with playhead.
- [ ] The detection box tracks the subject in each of the 6 scenes, and its label changes in sync with the video.
- [ ] Warm sonar rings pulse behind the frame. The preview heading and three toasts appear.
- [ ] Scrolling back up reverses everything smoothly. Resizing mid-scroll keeps the frame aligned with `.frame-target`.
- [ ] Mobile works (300vh track, full-width frame, reduced HUD, 1 toast), as does reduced motion (static fallback).
- [ ] No layout shift, 60fps scroll on a mid-range laptop, and the video pauses offscreen.
