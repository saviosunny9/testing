import { ArrowUpRight } from 'lucide-react';
import { BRAND_NAME } from '@/lib/brand';

/** Two paths: family and business. */
export default function ChooseWay() {
  return (
    <section id="choose" className="section bg-white pt-0">
      <div className="container-x">
        <div className="text-center">
          <p data-reveal className="eyebrow">
            Choose your way
          </p>
          <h2 data-reveal className="display h-section mt-4 text-ink">
            Built for the way you use it.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2">
          <a data-reveal href="#moments" className="group focus-ring relative block aspect-[4/3] overflow-hidden rounded-[3px] bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/stills/kitchen.jpg"
              alt="A mum lifting her toddler in a sunny kitchen"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/55 to-transparent p-7 pt-24 text-white">
              <div>
                <h3 className="display text-[1.9rem]">For Family</h3>
                <p className="mt-1 max-w-[30ch] text-[15px] text-white/85">The people and everyday moments you never want to miss.</p>
              </div>
              <ArrowUpRight size={22} strokeWidth={1.6} className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </a>
          <a data-reveal href="#moments" className="group focus-ring relative block aspect-[4/3] overflow-hidden rounded-[3px] bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/life/shop-grocery.jpg"
              alt={`An ${BRAND_NAME} camera on a grocery store counter`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/55 to-transparent p-7 pt-24 text-white">
              <div>
                <h3 className="display text-[1.9rem]">For Business</h3>
                <p className="mt-1 max-w-[30ch] text-[15px] text-white/85">Stay connected to the place you’ve built.</p>
              </div>
              <ArrowUpRight size={22} strokeWidth={1.6} className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
