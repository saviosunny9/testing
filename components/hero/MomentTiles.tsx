import type { CSSProperties } from 'react';

type Tile = {
  src: string;
  alt: string;
  caption?: string;
  /** desktop position and width, % of the stage */
  x: number;
  y: number;
  w: number;
  ar: string;
  /** mobile overrides; `hide` drops the tile on small screens */
  m?: { x: number; y: number; w: number } | 'hide';
  pos?: string;
};

export const MOMENTS: Tile[] = [
  { src: '/media/stills/storytime.jpg', alt: 'A toddler reading to her mum on the bed', caption: 'Story time · 8:15 PM', x: 5, y: 13, w: 23, ar: '4 / 3', m: { x: -8, y: 11, w: 34 } },
  { src: '/media/stills/milo.jpg', alt: 'A ginger cat on a wooden floor', x: 29.5, y: 33, w: 9, ar: '1 / 1', m: 'hide', pos: '62% 50%' },
  { src: '/media/stills/birthday-portrait.jpg', alt: 'Grandpa leaning in to blow out birthday candles', caption: 'Grandpa’s 70th', x: 12, y: 49, w: 15, ar: '3 / 4', m: { x: -5, y: 60, w: 27 } },
  { src: '/media/stills/sofa.jpg', alt: 'A girl laughing on the sofa', x: 62.5, y: 11, w: 14.5, ar: '3 / 4', m: { x: 77, y: 13, w: 28 }, pos: '58% 40%' },
  { src: '/media/stills/gamenight.jpg', alt: 'A dad and son playing a stacking game', caption: 'Game night', x: 79.5, y: 28, w: 16, ar: '1 / 1', m: 'hide', pos: '62% 50%' },
  { src: '/media/stills/kitchen.jpg', alt: 'A mum lifting her toddler in the kitchen', caption: 'First flight · 4:08 PM', x: 64.5, y: 55, w: 21, ar: '4 / 3', m: { x: 76, y: 61, w: 30 } },
];

/** Captured moments that gather around the phone as the film shrinks. */
export default function MomentTiles({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      {MOMENTS.map((t) => {
        const style = {
          '--x': `${t.x}%`,
          '--y': `${t.y}%`,
          '--w': `${t.w}%`,
          '--ar': t.ar,
          ...(t.m && t.m !== 'hide' ? { '--mx': `${t.m.x}%`, '--my': `${t.m.y}%`, '--mw': `${t.m.w}%` } : {}),
        } as CSSProperties;
        return (
          <figure key={t.src} className="moment-tile" style={style} data-mobile={t.m === 'hide' ? 'hide' : undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.src} alt="" loading="eager" decoding="async" style={t.pos ? { objectPosition: t.pos } : undefined} />
            {t.caption && (
              <figcaption className="absolute bottom-2.5 left-2.5 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md max-md:hidden">
                {t.caption}
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}
