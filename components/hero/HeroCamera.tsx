import { forwardRef, type CSSProperties } from 'react';

/**
 * The hero's end state: a rendered Alaro camera in the middle of the stage. The film shrinks into its glass face
 * (`.cam-target` traces that ellipse) and dissolves there.
 *
 * Geometry comes from the render (tools/camera-render, `hero` shot): fractions of the image, so the CSS and the
 * timeline stay in step with the picture at any size.
 */
export const CAMERA = {
  src: '/media/hero/alaro-camera.webp',
  srcSm: '/media/hero/alaro-camera-sm.webp',
  w: 1446,
  h: 1680,
  face: { cx: 0.3427, cy: 0.3143, rx: 0.303, ry: 0.2656 },
  dot: { x: 0.3371, y: 0.1024 },
  product: { cx: 0.361, top: 0.0399, bottom: 0.969 },
};

const pct = (n: number) => `${(n * 100).toFixed(2)}%`;

type Props = { className?: string; still?: boolean };

const HeroCamera = forwardRef<HTMLDivElement, Props>(function HeroCamera({ className = '', still = false }, targetRef) {
  const { face, dot } = CAMERA;
  return (
    <div className={`hero-cam ${className}`} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hero-cam-img"
        src={CAMERA.src}
        srcSet={`${CAMERA.srcSm} 720w, ${CAMERA.src} 1439w`}
        sizes="(max-width: 767px) 60vw, 620px"
        width={CAMERA.w}
        height={CAMERA.h}
        alt=""
        decoding="async"
        style={{ transformOrigin: `${pct(face.cx)} ${pct(face.cy)}` } as CSSProperties}
      />
      <div
        ref={targetRef}
        className="cam-target"
        style={{ left: pct(face.cx - face.rx), top: pct(face.cy - face.ry), width: pct(face.rx * 2), height: pct(face.ry * 2) }}
      />
      <span className={`hero-cam-dot ${still ? 'is-on' : ''}`} style={{ left: pct(dot.x), top: pct(dot.y) }} />
    </div>
  );
});

export default HeroCamera;

/** Highlight and rim shading over the film while it sits inside the glass face, so it reads as behind glass. */
export function CameraGlass({ className = '' }: { className?: string }) {
  const { face } = CAMERA;
  return (
    <div className={`hero-cam ${className}`} aria-hidden>
      <div
        className="cam-glass"
        style={{ left: pct(face.cx - face.rx), top: pct(face.cy - face.ry), width: pct(face.rx * 2), height: pct(face.ry * 2) }}
      />
    </div>
  );
}
