import { BRAND_NAME } from '@/lib/brand';

const TILES = [
  { id: 'graphite', name: 'Graphite', line: 'Quiet on a dark shelf.', bg: 'var(--tint-graphite)' },
  { id: 'white', name: 'Chalk White', line: 'Light, bright, barely there.', bg: 'var(--tint-white)' },
  { id: 'red', name: 'Nuuk Red', line: 'A little joy on the bookcase.', bg: 'var(--tint-red)' },
] as const;

/** Product colours on backgrounds tinted to match, in the style of a store lineup. */
export default function ProductTiles() {
  return (
    <section id="colours" className="section bg-white">
      <div className="container-x">
        <div className="flex flex-col items-center text-center">
          <p data-reveal className="eyebrow">
            Three colours, one {BRAND_NAME}
          </p>
          <h2 data-reveal className="display h-section mt-3 max-w-[16ch] text-ink">
            Made to fit right in. <span className="hl">Or stand out.</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
          {TILES.map((t, i) => (
            <article
              key={t.id}
              data-reveal
              className="group relative flex aspect-[4/5] flex-col items-center overflow-hidden rounded-[28px] px-6 pt-10 text-center md:aspect-[3/4]"
              style={{ background: t.bg }}
            >
              <h3 className="display text-[clamp(1.9rem,2.6vw,2.6rem)] text-ink">
                {BRAND_NAME}
                <br />
                {t.name}
              </h3>
              <p className="mt-3 text-[16px] text-ink-2">{t.line}</p>
              <a href="#buy" data-color={t.id} className="btn btn-navy btn-sm mt-6">
                Buy
              </a>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/media/product/${i === 1 ? 'three4-white' : `front-${t.id}`}.webp`}
                alt={`${BRAND_NAME} camera in ${t.name}`}
                width={1355}
                height={1258}
                loading="lazy"
                className="absolute bottom-[-4%] left-1/2 h-auto w-[74%] max-w-none -translate-x-1/2 object-contain transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:-translate-y-3 group-hover:scale-[1.03]"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
