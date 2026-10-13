import { ArrowRight } from 'lucide-react';
import { BRAND_NAME } from '@/lib/brand';

/* All three renders share one camera framing and canvas (1355 × 1258), so the same box,
   width and baseline give every finish the same perceived size. The visible product spans
   x 30–737 of the canvas (the rest is its soft shadow), so the box is shifted to centre the
   product itself, not the canvas. */
const PRODUCT_CENTRE = 383.5 / 1355;
const TILES = [
  { id: 'graphite', name: 'Graphite', line: 'Quiet on a dark shelf.', bg: 'var(--tint-graphite)' },
  { id: 'white', name: 'Chalk White', line: 'Light, bright, barely there.', bg: 'var(--tint-white)' },
  { id: 'red', name: 'Nuuk Red', line: 'A little joy on the bookcase.', bg: 'var(--tint-red)' },
] as const;

/** The three finishes, each on a quiet neutral ground. */
export default function ProductTiles() {
  return (
    <section id="colours" className="section bg-white">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p data-reveal className="eyebrow">
              Three finishes, one {BRAND_NAME}
            </p>
            <h2 data-reveal className="display h-section mt-4">
              Made to fit right in. <span className="hl">Or stand out.</span>
            </h2>
          </div>
          <p data-reveal className="lede md:col-span-4 md:col-start-9">
            The same camera in three finishes. Pick the one that suits the room.
          </p>
        </div>

        <div className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:mx-0 md:mt-16 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {TILES.map((t) => (
            <article
              key={t.id}
              data-reveal
              className="group relative flex aspect-[4/5] w-[80vw] max-w-[420px] shrink-0 snap-center flex-col overflow-hidden rounded-[3px] p-7 md:w-auto md:max-w-none"
              style={{ background: t.bg }}
            >
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <h3 className="h-card display">{t.name}</h3>
                  <p className="mt-2 text-[15px] text-muted">{t.line}</p>
                </div>
                <a href="#buy" data-color={t.id} className="btn btn-dark btn-sm shrink-0" aria-label={`Buy ${BRAND_NAME} in ${t.name}`}>
                  Buy <ArrowRight size={14} strokeWidth={1.8} />
                </a>
              </div>
              {/* fixed box + shared baseline for all three finishes */}
              <div
                className="absolute bottom-[5%] left-1/2 aspect-[1355/1258] w-[88%]"
                style={{ transform: `translateX(-${PRODUCT_CENTRE * 100}%)` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/media/product/front-${t.id}.webp`}
                  alt={`${BRAND_NAME} camera in ${t.name}`}
                  width={1355}
                  height={1258}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:-translate-y-2.5"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
