import { Play } from 'lucide-react';
import { forwardRef } from 'react';
import { COPY } from '@/lib/brand';

type Props = { onWatchFilm: () => void; className?: string };

/** Bottom content row over the film: headline left, actions + description right. */
const HeroCopy = forwardRef<HTMLDivElement, Props>(function HeroCopy({ onWatchFilm, className = '' }, ref) {
  const { eyebrow, headline, description, watchFilm, buy } = COPY.hero;
  return (
    <div
      ref={ref}
      className={`hero-copy pointer-events-none flex items-end text-white max-md:justify-center max-md:px-5 max-md:pb-[6vh] md:px-10 md:pb-[8vh] lg:px-16 ${className}`}
    >
      <div className="flex w-full flex-col items-center gap-8 max-md:text-center md:flex-row md:items-end md:justify-between md:gap-12">
        <div className="flex flex-col gap-4 max-md:items-center">
          <span className="hero-reveal intro-hide text-[13px] font-medium tracking-[0.02em] text-white/70">{eyebrow}</span>
          <h1 className="hero-h1 display h-hero intro-hide">
            <span className="block">{headline.lead}</span>
            <span className="block text-white/55">{headline.trail}</span>
          </h1>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-6 max-md:flex-col-reverse md:items-start">
          <div className="hero-reveal intro-hide pointer-events-auto flex gap-3">
            <button type="button" onClick={onWatchFilm} className="btn btn-glass">
              <Play size={13} strokeWidth={0} className="fill-white" /> {watchFilm}
            </button>
            <a href="#buy" className="btn btn-light">
              {buy}
            </a>
          </div>
          <p className="hero-reveal intro-hide max-w-[330px] text-[15px] leading-[1.5] text-white/85 md:text-[16px]">{description}</p>
        </div>
      </div>
    </div>
  );
});

export default HeroCopy;
