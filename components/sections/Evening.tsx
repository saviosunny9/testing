import { BRAND_NAME } from '@/lib/brand';

/** Where the camera sits in the photo, as % of the image (also its object-position, so it stays in frame). */
const CAMERA = { x: 85.5, y: 82 };
/** The tag starts just off the camera's right side. */
const TAG = { x: 87.6, y: 80 };

/** A quiet, wide photograph of an evening at home, with the camera tagged where it sits. */
export default function Evening() {
  return (
    <section aria-label="An evening at home" className="bg-white pb-24 md:pb-32">
      <div className="container-x">
        <figure data-reveal className="relative overflow-hidden rounded-[3px] bg-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/life/companion.jpg"
            width={1160}
            height={505}
            loading="lazy"
            alt={`A woman laughing with her golden retriever in a lamp-lit living room, an ${BRAND_NAME} camera on the side table`}
            className="block aspect-[4/3] w-full object-cover sm:aspect-[16/9] md:aspect-[1160/505]"
            style={{ objectPosition: `${CAMERA.x - 14}% 50%` }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" aria-hidden />
          <figcaption className="absolute inset-0 flex flex-col justify-between p-6 text-white md:p-10">
            <p className="label label-sq !text-white/75">Living room · 9:42 PM</p>
            <p className="body-lg max-w-[18ch] md:max-w-[22ch]">
              Made to sit in the background of your life, <span className="text-white/55">not the centre of it.</span>
            </p>
          </figcaption>
          {/* tag on the camera itself */}
          <span className="pointer-events-none absolute hidden md:block" style={{ left: `${TAG.x}%`, top: `${TAG.y}%` }} aria-hidden>
            <span className="absolute -top-[2px] left-0 h-1 w-1 bg-white" />
            <span className="absolute left-2 top-0 h-px w-6 bg-white/60" />
            <span className="label absolute left-10 top-0 -translate-y-1/2 whitespace-nowrap !text-white/85">[ {BRAND_NAME} ]</span>
          </span>
        </figure>
      </div>
    </section>
  );
}
