import { forwardRef } from 'react';

const RINGS = [
  { gap: 30, mobile: true },
  { gap: 70, mobile: true },
  { gap: 118, mobile: true },
  { gap: 174, mobile: false },
  { gap: 238, mobile: false },
];

/**
 * Warm concentric rounded rectangles behind the camera frame (§6.5).
 * The outer element shares `.frame-rect`; the hero timeline animates `.sonar-inner`
 * and loops a pulse over `.sonar-ring`.
 */
const SonarRings = forwardRef<HTMLDivElement, { className?: string }>(function SonarRings({ className = '' }, ref) {
  return (
    <div className={`frame-rect pointer-events-none ${className}`} aria-hidden>
      <div ref={ref} className="sonar-inner absolute inset-0">
        <div className="sonar-glow" />
        {RINGS.map((r) => (
          <span
            key={r.gap}
            className={`sonar-ring ${r.mobile ? '' : 'desktop-only'}`}
            style={{ inset: -r.gap, borderRadius: 28 + r.gap }}
          />
        ))}
      </div>
    </div>
  );
});

export default SonarRings;
