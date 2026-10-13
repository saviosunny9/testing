import { BRAND_NAME } from '@/lib/brand';

/** Full-bleed product moment: the camera, large, on a quiet grey ground. */
export default function Intelligence() {
  return (
    <section id="intelligence" className="overflow-hidden bg-surface">
      <div className="container-x grid items-center gap-10 py-24 md:grid-cols-12 md:gap-8 md:py-32">
        <div className="md:col-span-6">
          <p data-reveal className="eyebrow">
            Meet {BRAND_NAME}
          </p>
          <h2 data-reveal className="display h-section mt-4 text-ink">
            The intelligence <span className="text-[#86868b]">behind every moment.</span>
          </h2>
          <p data-reveal className="lede mt-6 max-w-[36ch]">
            A 2K camera with on-device intelligence that knows the difference between your daughter, your dog and a delivery,
            so it only tells you what matters.
          </p>
          <dl data-reveal className="mt-10 grid max-w-[420px] grid-cols-3 gap-6 border-t border-line pt-6">
            {[
              ['2K', 'HDR video'],
              ['350°', 'pan, 75° tilt'],
              ['On‑device', 'recognition'],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="display text-[1.4rem] text-ink">{v}</dt>
                <dd className="mt-1 text-[13px] leading-snug text-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative md:col-span-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-parallax="-8"
            src="/media/product/three4-graphite.webp"
            width={1077}
            height={1321}
            alt={`${BRAND_NAME} camera in Graphite, three-quarter view`}
            loading="lazy"
            className="mx-auto h-auto w-[78%] max-w-[480px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}
