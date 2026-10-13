import { ArrowRight, Play } from 'lucide-react';
import { forwardRef } from 'react';
import { COPY } from '@/lib/brand';

type Props = {
  onWatchFilm: () => void;
  className?: string;
};

/** Sequel-style bottom content row (§4.2): H1 left, CTAs + description right. */
const HeroCopy = forwardRef<HTMLDivElement, Props>(function HeroCopy({ onWatchFilm, className = '' }, ref) {
  const { headline, description, watchFilm, primaryCta } = COPY.hero;
  return (
    <div
      ref={ref}
      className={`hero-copy pointer-events-none flex items-end text-white max-md:justify-center max-md:p-[3vh] max-md:pb-[5vh] md:p-10 md:pb-[7vh] lg:p-20 lg:pb-[7vh] ${className}`}
    >
      <div className="flex w-full flex-col items-center gap-7 max-md:text-center md:flex-row md:items-end md:gap-10">
        <h1 className="hero-h1 display h1-hero intro-hide flex-grow text-balance [text-shadow:0_2px_24px_rgba(28,18,10,.25)]">
          {headline.lead}
          <span className="accent-serif ml-[0.25em] inline-block">{headline.accent}</span>
        </h1>

        <div className="flex shrink-0 flex-col items-center gap-7 max-md:flex-col-reverse md:items-start">
          <div className="hero-reveal intro-hide pointer-events-auto flex gap-4">
            <button type="button" onClick={onWatchFilm} className="glass pill pill-sm focus-ring text-white">
              <Play size={14} strokeWidth={1.5} className="fill-white" /> {watchFilm}
            </button>
            <a href="#product" className="pill pill-sm focus-ring bg-leaf text-ink hover:bg-[#5bd472]">
              {primaryCta} <ArrowRight size={16} strokeWidth={1.5} />
            </a>
          </div>
          <p className="hero-reveal intro-hide max-w-[320px] text-[17px] leading-normal text-white/[.94]">{description}</p>
        </div>
      </div>
    </div>
  );
});

export default HeroCopy;
