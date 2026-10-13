import type { CSSProperties } from 'react';

type Tile = {
  /** clip name in /media/moments (.webm, .mp4 and a .jpg poster) */
  clip: string;
  alt: string;
  caption?: string;
  /** desktop position and width, % of the tile's zone (left or right of the phone) */
  x: number;
  y: number;
  w: number;
  ar: string;
  /** compact (phone / portrait tablet) overrides, % of the zone; `hide` drops the tile */
  m?: { x: number; y: number; w: number } | 'hide';
};

/**
 * Two zones flank the phone and caption column and never enter it, so no tile can reach the text.
 * Positions are tuned so tiles in a zone don't overlap each other at any zone height ≥ 1.35× its width.
 */
export const MOMENTS: { left: Tile[]; right: Tile[] } = {
  left: [
    { clip: 'storytime', alt: 'A toddler reading to her mum on the bed', caption: 'Story time · 8:15 PM', x: 0, y: 0, w: 64, ar: '4 / 3', m: { x: -18, y: 0, w: 70 } },
    { clip: 'milo', alt: 'A ginger cat on a wooden floor', x: 70, y: 30, w: 28, ar: '1 / 1', m: 'hide' },
    { clip: 'birthday', alt: 'Grandpa leaning in to blow out birthday candles', caption: 'Grandpa’s 70th', x: 18, y: 52, w: 46, ar: '3 / 4', m: { x: -10, y: 60, w: 54 } },
  ],
  right: [
    { clip: 'sofa', alt: 'A girl laughing on the sofa', x: 6, y: 0, w: 44, ar: '3 / 4', m: { x: 50, y: 4, w: 56 } },
    { clip: 'gamenight', alt: 'A dad and son playing a stacking game', caption: 'Game night', x: 56, y: 14, w: 42, ar: '1 / 1', m: 'hide' },
    { clip: 'kitchen', alt: 'A mum lifting her toddler in the kitchen', caption: 'First flight · 4:08 PM', x: 14, y: 56, w: 76, ar: '4 / 3', m: { x: 48, y: 66, w: 62 } },
  ],
};

function TileView({ t, video }: { t: Tile; video: boolean }) {
  const style = {
    '--x': `${t.x}%`,
    '--y': `${t.y}%`,
    '--w': `${t.w}%`,
    '--ar': t.ar,
    ...(t.m && t.m !== 'hide' ? { '--mx': `${t.m.x}%`, '--my': `${t.m.y}%`, '--mw': `${t.m.w}%` } : {}),
  } as CSSProperties;
  const base = `/media/moments/${t.clip}`;
  return (
    <figure className="moment-tile" style={style} data-mobile={t.m === 'hide' ? 'hide' : undefined}>
      {video ? (
        // Loaded and played only while the tiles are on screen (see useHeroTimeline).
        <video className="moment-video" muted loop playsInline preload="none" poster={`${base}.jpg`} aria-hidden>
          <source src={`${base}.webm`} type="video/webm" />
          <source src={`${base}.mp4`} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`${base}.jpg`} alt="" loading="eager" decoding="async" />
      )}
      {t.caption && (
        <figcaption className="absolute bottom-2.5 left-2.5 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md max-md:hidden">
          {t.caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Captured moments, each a short looping clip, that gather around the phone as the film shrinks. */
export default function MomentTiles({ className = '', video = true }: { className?: string; video?: boolean }) {
  return (
    <div className={`moment-zones pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      {(['left', 'right'] as const).map((side) => (
        <div key={side} className={`moment-zone moment-zone-${side}`}>
          {MOMENTS[side].map((t) => (
            <TileView key={t.clip} t={t} video={video} />
          ))}
        </div>
      ))}
    </div>
  );
}
