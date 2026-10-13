import { BRAND_NAME } from '@/lib/brand';

const SHOTS = [
  {
    src: '/media/life/table.jpg',
    w: 1600,
    h: 900,
    n: '01',
    title: 'On a table',
    note: 'Stands steady on its own base. Turn it to face the room.',
    alt: `A white ${BRAND_NAME} camera on a sunlit wooden table, a living room softly out of focus behind it`,
    pos: '56% 50%',
    span: 'md:col-span-7',
  },
  {
    src: '/media/life/wall.jpg',
    w: 736,
    h: 1308,
    n: '02',
    title: 'On the wall',
    note: 'The mount in the box puts it up and out of reach.',
    alt: `A white ${BRAND_NAME} camera on its wall mount, on a sunlit plaster wall beside plants`,
    pos: '50% 46%',
    span: 'md:col-span-5',
  },
];

/** Two ways to place the camera, shown in natural light. */
export default function Placement() {
  return (
    <section id="placement" className="section bg-white pt-0">
      <div className="container-x">
        <div className="grid gap-6 border-t border-line pt-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p data-reveal className="eyebrow">
              Placement
            </p>
            <h2 data-reveal className="display h-section mt-5 max-w-[14ch] text-ink">
              Stand it up. <span className="hl">Or mount it.</span>
            </h2>
          </div>
          <p data-read className="body-lg max-w-[24ch] text-ink md:col-span-5 md:justify-self-end">
            Wherever it sits, it looks like it belongs there.
          </p>
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-12">
          {SHOTS.map((s) => (
            <figure key={s.src} data-reveal className={s.span}>
              <div className="relative overflow-hidden rounded-[3px] bg-paper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  width={s.w}
                  height={s.h}
                  loading="lazy"
                  alt={s.alt}
                  className="block aspect-[4/5] w-full object-cover md:aspect-auto md:h-[min(78svh,760px)]"
                  style={{ objectPosition: s.pos }}
                />
              </div>
              <figcaption className="mt-4 grid grid-cols-[auto_1fr] gap-x-5 border-t border-line pt-4">
                <span className="label whitespace-nowrap pt-1">[ {s.n} ]</span>
                <span>
                  <span className="block text-[17px] tracking-[-0.02em] text-ink">{s.title}</span>
                  <span className="mt-1 block text-[14px] text-muted">{s.note}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
