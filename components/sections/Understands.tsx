import { BRAND_NAME } from '@/lib/brand';

const NOTICED = [
  'Mira laughed 20 times today.',
  'She took her first steps.',
  'Your dog waited by the door for you.',
  'Grandpa blew out all 70 candles.',
  'Leo napped for two hours.',
  'The parcel is on the porch.',
];

const DIGEST = [
  { src: '/media/stills/sofa.jpg', t: '10:42' },
  { src: '/media/stills/gamenight.jpg', t: '1:15' },
  { src: '/media/stills/kitchen.jpg', t: '4:08' },
  { src: '/media/stills/milo.jpg', t: '5:30' },
  { src: '/media/stills/birthday.jpg', t: '7:42' },
];

/** Dark section: what Alaro understands, from the wireframe's three stacked cards. */
export default function Understands() {
  return (
    <section data-header-theme="dark" className="section bg-black text-white">
      <div className="container-x grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <div className="flex flex-col gap-4 md:sticky md:top-24 md:self-start">
          <figure data-reveal className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-night">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/stills/kitchen.jpg" alt="A mum swinging her toddler in a bright kitchen" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute left-[5%] top-[28%] rounded-[10px] bg-black/40 px-3 py-1.5 text-[12px] font-medium backdrop-blur-md">
              ↗ Playtime · 4:08 PM
            </span>
            <span className="absolute right-[6%] top-[52%] rounded-[10px] bg-black/40 px-3 py-1.5 text-[12px] font-medium backdrop-blur-md">
              ✦ Leo and Mum
            </span>
            <span className="absolute bottom-[5%] left-[5%] inline-flex items-center gap-2 rounded-[10px] bg-white/90 px-3 py-1.5 text-[11px] font-semibold tracking-[0.06em] text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-rec" /> KITCHEN · LIVE
            </span>
          </figure>
          <a data-reveal href="#ask" className="btn btn-light h-12 w-full">
            Experience {BRAND_NAME}
          </a>
        </div>

        <div className="flex min-w-0 flex-col gap-4 md:gap-5">
          <article data-reveal className="rounded-[28px] bg-night p-8 md:p-10">
            <p className="text-[1.5rem] font-medium leading-[1.3] tracking-[-0.02em] md:text-[1.75rem]">
              {BRAND_NAME} uses visual intelligence to understand{' '}
              <span className="text-white/45">people, pets, objects and activity around your space.</span>
            </p>
          </article>

          <article data-reveal className="rounded-[28px] bg-night p-8 md:p-10">
            <h3 className="display text-[1.9rem] md:text-[2.25rem]">Your day, in 5 minutes.</h3>
            <p className="mt-2 text-white/60">See the moments that mattered while you were away.</p>
            <div className="mt-8 grid grid-cols-5 gap-2">
              {DIGEST.map((d) => (
                <div key={d.t} className="flex flex-col gap-2">
                  <div className="aspect-[3/4] overflow-hidden rounded-[10px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={d.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <span className="tnum text-center text-[11px] text-white/50">{d.t}</span>
                </div>
              ))}
            </div>
          </article>

          <article data-reveal className="overflow-hidden rounded-[28px] bg-night pt-8 md:pt-10">
            <h3 className="display px-8 text-[1.9rem] md:px-10 md:text-[2.25rem]">
              Intelligence that notices <span className="text-white/45">the little things.</span>
            </h3>
            <div className="relative mt-10 overflow-hidden pb-8 md:pb-10" aria-label="Examples of what Alaro notices">
              <div className="marquee-track flex w-max gap-2.5">
                {[...NOTICED, ...NOTICED].map((n, i) => (
                  <span
                    key={i}
                    aria-hidden={i >= NOTICED.length}
                    className="whitespace-nowrap rounded-full border border-white/15 bg-white/[.06] px-4 py-2 text-[14px] text-white/85"
                  >
                    {n}
                  </span>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-night to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-night to-transparent" />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
