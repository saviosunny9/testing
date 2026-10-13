# Alaro Website Redesign — First Draft Context for Claude

## Purpose

Use this document as the implementation brief for the **first redesign draft** of the existing Alaro website. Apply the changes below across the site, while preserving working content and interactions that are not explicitly asked to change.

The original `SITE_CONTEXT.md` is the source of truth for the current app structure, product description, component/file locations, build commands, assets, and known placeholders. Read it before making changes. This brief supplements it; it does not replace the original project context.

## Product and brand context

Alaro is an indoor smart-home camera with a pan/tilt head. It recognises people, pets and objects on-device, helps users understand meaningful moments, and supports an “Ask Alaro” experience. Its audience includes families and, secondarily, small business owners.

The brand should feel **warm, human, premium, cinematic, product-led, and trustworthy**. Avoid surveillance-heavy language or threatening security imagery. Show the product as a considered object that belongs naturally in a home.

## 1. Overall visual direction

Move away from the current blue-heavy, colourful interface toward a restrained, editorial visual system inspired by the supplied moodboard and the references below.

- Main surfaces: warm off-white, white, charcoal, and black.
- Brand accents: dark forest green and a fresher green, used sparingly.
- Typography: text must use only neutral black, white, or grey tones. **Do not colour individual words, headings, body copy, eyebrows, or other text green/blue.**
- Keep colour in photography, video, the product itself, and occasional small non-text UI accents—not as decoration across every section.
- Reduce the use of pastel colour tiles, gradients, and brightly coloured UI surfaces. Use neutral surfaces and strong imagery to create contrast and depth.
- Maintain generous whitespace, clear hierarchy, confident typography, deliberate alignment, and premium product presentation.
- Avoid adding visual effects just for decoration. Motion and 3D should support the product story.

Provisional colour direction only (refine after the next references):
- Deep forest green: approximately `#172D25`
- Fresh green: approximately `#54C878`
- Warm off-white: approximately `#F5F5F2`
- Charcoal: approximately `#222321`
- White and neutral greys as supporting tones

These are starting samples from the direction, not approved final brand tokens. Keep the Alaro camera’s existing Graphite, Chalk White, and Nuuk Red product finishes intact unless a later instruction changes them.

## 2. Typography — replace Geist with Switzer

Reference: https://drone.riotters.com/

- Replace the current Geist / Geist Mono typography setup with **Switzer** throughout the site.
- Use a legitimate, locally hosted or otherwise properly licensed Switzer font source. Do not rely on an unstable third-party font URL. If needed, add font files to the project and configure them through the existing Next.js font setup.
- Study the reference’s typographic treatment: headline weight, scale, line height, letter spacing, body-text proportions, and hierarchy. Use it as art direction rather than copying its exact content or layouts.
- Headlines should feel bold and deliberate, with tight but readable line height. Body text should remain comfortable to read and visibly subordinate to headlines.
- Define a consistent responsive type scale and use it across every section; avoid individually improvised typography values.
- Remove the existing blue `.hl` headline treatment and any other coloured text treatments. Highlight emphasis through weight, size, line breaks, or contrast—not colour.
- Check all breakpoints so large headlines wrap intentionally and do not collide with media or controls.

## 3. Hero — cinematic video-to-phone scroll interaction

Reference: https://joinspread.app/

The current hero already has a film-to-phone scroll transformation. Rework and improve it to achieve the reference’s immersive, editorial quality rather than layering a second competing animation on top of the existing one.

Desired experience:
1. Open with a large, cinematic, edge-to-edge or near-full-screen Alaro film.
2. As the visitor scrolls, keep the transformation tied smoothly to scroll progress. The main video should scale down and become a smaller, clearly framed focal element.
3. Reveal supporting photographs and/or short video moments around the shrinking focal video. These can enter at different positions and scales to create a considered collage/editorial layout.
4. Keep the motion continuous: the video, supporting moments, text, and phone frame should feel like parts of one choreographed sequence—not unrelated elements popping in.
5. Preserve a clear focal hierarchy and avoid excessive clutter. Supporting media should reinforce Alaro’s real use cases: family moments, children, pets, and everyday home life.
6. End on a stable composition that clearly demonstrates the Alaro mobile experience and leads naturally into the following section.

Implementation notes:
- Inspect the current `components/hero/` system and its GSAP/ScrollTrigger timeline before editing. Reuse or refactor it; do not create duplicate ScrollTriggers or competing Lenis/GSAP integrations.
- Preserve the current film player and its controls unless a concrete conflict requires a change.
- Use the existing media where appropriate, but improve crop, timing, composition, and transition quality.
- Keep animation performant. Prefer transform, opacity, clip-path, and other compositor-friendly properties. Avoid layout thrashing and excessive per-frame DOM measurements.
- Keep the sequence responsive and test desktop, tablet, and mobile.
- Respect `prefers-reduced-motion`: provide a clean static composition and a usable phone/media preview without pinned scroll storytelling.
- Do not lock scrolling while the hero intro plays. The page must remain usable if fonts or video load slowly.

## 4. Realistic 3D product model and product continuity

Reference: https://drone.riotters.com/

The current procedural Alaro model and the current `How it works` 3D shelf story do not meet the desired visual quality. Replace the current model approach with a more photorealistic product presentation and make the product feel continuous through roughly three page sections.

### Model research and selection
- Search for an existing 3D model online that closely matches the Alaro camera’s actual form: cylindrical base, rotating cap, short hinged rear arm, cylindrical head, domed black-glass face, centred lens, side speaker grille, and rear USB-C port.
- Do not use a random security-camera model that materially misrepresents the product. Similarity to Alaro’s silhouette and key details matters.
- Check licence, usage permissions, attribution requirements, file format, texture availability, and whether commercial website use is allowed before adopting a model. Do not assume a model is free to use just because it can be downloaded.
- Prefer a web-ready GLB/glTF asset with suitable PBR materials and a manageable file size. Optimise textures and geometry where necessary.
- If no sufficiently similar and legally usable model is found, do not silently substitute an inaccurate model. Use the best permitted fallback: improve the existing model/materials or create a higher-quality product render/model pipeline, and document the limitation.

### Desired presentation
- Aim for believable materials: matte body finish, carefully controlled reflections on the black glass face, realistic lens details, soft contact shadows, studio-quality lighting, and accurate proportions.
- Avoid a plastic-looking finish, excessive gloss, cartoonish lighting, or unnecessary environmental props.
- The camera should remain visually recognisable as the same product across the page.
- Build a scroll-linked product journey across approximately three sections, inspired by the drone reference. The camera may change position, scale, rotation, or viewing angle as the content changes, but movement must feel intentional and not distract from reading.
- Keep copy and product composition balanced at every stage. Avoid covering important text or allowing the model to jump, flicker, or reinitialise between sections.
- Reuse the existing Three.js lazy-loading approach where appropriate. Avoid loading a heavy 3D asset during the initial critical render if it can be loaded shortly before it is needed.
- Provide a poster/render fallback if WebGL is unavailable or the asset fails to load.
- On mobile and reduced-motion settings, use a simplified and reliable experience that does not require long pinned scroll sections.

## 5. Remove the existing “How it works” 3D scene

- Remove the current `HowItWorks.tsx` pinned shelf scene and its associated chapter progression, props, progress rail, lighting/night-vision transition, and privacy-mode camera animation. The current interaction is to be removed entirely.
- Do not preserve this section simply with a new coat of paint.
- Reuse or repurpose the page space for the new product-led scroll journey described above, distributed across around three sections. Avoid creating a large empty gap where the old section was.
- Remove obsolete imports, triggers, styles, and scene setup that are no longer used, but do not delete shared utilities or assets until confirming that no other section depends on them.
- Update the navigation label/anchor and any references to “How it works” only where necessary to keep navigation accurate. Do not leave dead anchors or broken links.

## 6. A realistic mobile-device showcase section

Use the supplied screenshot as visual inspiration: a real-looking phone photographed at an angle, with an immersive image/video filling the display.

- Add or adapt a section that presents Alaro’s mobile experience inside a realistic phone frame/device mock-up.
- Show relevant content on the screen: a live camera view, a family/pet moment, or a meaningful moment captured by Alaro. The media should be crisp and properly cropped to the screen.
- The phone should have convincing proportions, perspective, edge treatment, glass reflections, and a natural shadow. Avoid a flat rectangular screenshot with a generic border.
- The device can be tilted or compositionally offset for visual interest, but keep the screen content legible and the presentation premium.
- Use the section to explain the value of the app experience, not just to show a phone as decoration.
- If this section can be integrated into the new hero ending or the new three-section product journey without making the page repetitive, prefer a coherent integrated story. Otherwise, make it a distinct section.
- Do not invent functional app controls that do not exist. Any visual UI shown inside the phone should be credible and consistent with the actual product experience.

## 7. “Made to fit right in. Or stand out.” product-colour tiles

Current section: `components/sections/ProductTiles.tsx`.

- Correct the visibly inconsistent product-render sizes across Graphite, Chalk White, and Nuuk Red.
- All three products should occupy a consistent visual bounding box and sit on the same baseline, with balanced whitespace and comparable perceived scale.
- Preserve each model’s real aspect ratio and proportions. Do not stretch or distort the renders to force identical width and height.
- Account for transparent padding inside the source images: size and align according to the visible product bounds, not only the image canvas dimensions.
- Keep camera placement, scale, and hover-lift distance consistent across all three tiles.
- Rework the tile backgrounds to fit the restrained neutral visual system. Avoid the current set of strongly coloured pastel tiles. Subtle neutral backgrounds are preferred; green should be used selectively.
- Keep the three product colours and their names/descriptions clear. Maintain the existing behaviour where selecting a colour can preselect that variant in the buy section.
- Ensure the layout remains balanced on smaller screens, including stacked or horizontally scrollable layouts if needed.

## 8. Site-wide colour and component audit

Apply the new direction consistently across the entire site, not just the hero.

Audit and update:
- `app/globals.css` colour tokens and component classes
- `tailwind.config.ts` theme colours
- `components/Header.tsx` and header theme logic
- buttons, links, active states, chips, tags, cards, accordions, carousel controls, form states, and footer
- every section with blue headings, blue eyebrow text, colourful pastel surfaces, or decorative gradients
- focus, hover, selected, loading, error, and disabled states

Rules:
- Text remains black, white, or grey, including text inside buttons and labels.
- Use forest green/fresh green only for restrained non-text accents, selected indicators, or small UI details where it improves clarity.
- Ensure contrast and keyboard focus remain accessible. Do not remove useful interaction feedback just to make the design minimal.
- Keep dark and light section transitions intentional; avoid alternating colours without a clear narrative reason.
- Retain product colours as product colours. The brand palette change must not recolour the physical camera variants.

## 9. Existing content and functionality to preserve

Unless a later instruction explicitly changes them, retain the purpose and working behaviour of these existing areas while bringing their visuals into the new system:
- Captured moments / Family and Business toggle
- At-home room photography
- Alaro understanding and daily digest content
- Ask Alaro interactive demo
- Your space. Your control. feature carousel
- Buy section, colour selection, feature accordion, and cart counter demo
- Family / Business choice section
- FAQ accordion
- Closing CTA and footer

These sections can be visually redesigned for the new direction, but do not remove them just to simplify the page. Keep existing content, anchors, and interactions functional unless they are explicitly superseded by this brief.

## 10. Performance, accessibility, and responsive behaviour

- Preserve the current Next.js, React, TypeScript, Tailwind, GSAP, Lenis, and Three.js architecture unless a specific change is necessary.
- Avoid duplicate animation systems and redundant scroll listeners.
- Lazy-load 3D and non-critical media; provide useful poster/fallback states.
- Respect `prefers-reduced-motion` throughout the page, including the new hero and product journey.
- Make all interactive controls keyboard accessible with visible focus states and appropriate labels.
- Do not make important content available only through hover.
- Ensure scroll pinning does not trap the visitor or create large blank spaces on mobile.
- Keep media aspect ratios correct and avoid layout shifts while assets load.
- Test at desktop, tablet, and mobile widths.
- Run the existing build/typecheck and fix regressions introduced by the changes.

## 11. Implementation workflow for this first draft

1. Read `SITE_CONTEXT.md` and inspect the existing code before editing.
2. Map each requirement to the existing components and identify shared dependencies.
3. Implement the global visual-system and Switzer typography changes first.
4. Rework the hero scroll sequence using the existing hero infrastructure where possible.
5. Remove the old `HowItWorks` 3D shelf experience and replace its role with the new product-led story across roughly three sections.
6. Research the 3D model and licensing before integrating it. If the model cannot be verified, use a clearly documented fallback rather than an unlicensed asset.
7. Add/adapt the realistic mobile showcase and fix the product-colour tile sizing.
8. Audit the remaining sections for coloured text and excessive colour surfaces.
9. Verify responsive layouts, reduced-motion behaviour, navigation anchors, and existing interactions.
10. Run `npm run build`. Also test the static export if the project’s delivery still depends on `npm run export`.

## 12. Acceptance criteria

The first draft is ready for review when:
- The site uses Switzer consistently and typography feels closer to the supplied drone reference.
- No headings, body copy, eyebrows, or highlighted words use blue/green text; typography is black, white, or grey.
- The brand palette feels restrained, with dark green and fresh green used selectively against neutral surfaces.
- The hero transforms from a large video into a smaller focal video with supporting media revealed around it, tied smoothly to scroll progress.
- The current poor-quality `How it works` 3D scene and its chapter interaction are gone.
- A realistic product model or documented best-available fallback is used, with a coherent scroll-linked product story spanning approximately three sections.
- A realistic mobile-device showcase displays relevant Alaro content.
- The three product colour variants have consistent perceived size, baseline, spacing, and proportions.
- Existing unrelated sections and demo interactions still work.
- Mobile, keyboard, reduced-motion, build, and export behaviour have been checked.

## References supplied for this first draft

- Hero scroll interaction: https://joinspread.app/
- Typography and scroll-linked 3D product storytelling: https://drone.riotters.com/
- Branding moodboard: user-supplied image showing a dark-green/green, photography-led, varied editorial grid.
- Mobile showcase: user-supplied screenshot of a hand-held phone with immersive video content.
- Product-colour tile sizing: user-supplied screenshot of Alaro Graphite, Chalk White, and Nuuk Red product tiles.

## Scope note

This is the **first-draft change brief**, based only on the first batch of references and instructions. More references and changes may follow. Do not treat these provisional colour values or the exact final page order as permanently locked until the user confirms the full reference-gathering phase is complete.
