'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { registerFilm } from '@/lib/heroSound';
import { useReducedMotion } from '@/lib/useReducedMotion';
import CameraHUD from './CameraHUD';
import FilmPlayer from './FilmPlayer';
import HeroCopy from './HeroCopy';
import MomentTiles from './MomentTiles';
import PhoneBody from './PhoneBody';
import PreviewCopy from './PreviewCopy';
import { useHeroIntro, useHeroTimeline } from './useHeroTimeline';
import { VideoClock } from './videoClock';

const POSTER = '/media/hero-poster.jpg';
const SRC_1080 = '/media/hero-1080.mp4';
const SRC_720 = '/media/hero-720.mp4';

type NetworkInformation = { saveData?: boolean };

function prefersSmallVideo() {
  const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return window.innerWidth < 768 || !!conn?.saveData;
}

function useFilmSrc() {
  const [src, setSrc] = useState(SRC_1080);
  useEffect(() => {
    if (prefersSmallVideo()) setSrc(SRC_720);
  }, []);
  return src;
}

export default function Hero() {
  const reduced = useReducedMotion();
  const [filmOpen, setFilmOpen] = useState(false);
  const openFilm = useCallback(() => setFilmOpen(true), []);
  const closeFilm = useCallback(() => setFilmOpen(false), []);
  const filmSrc = useFilmSrc();

  // Switching variants after hydration changes the page height; re-measure every trigger.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [reduced]);

  return (
    <>
      {reduced ? <StaticHero onWatchFilm={openFilm} /> : <AnimatedHero onWatchFilm={openFilm} />}
      <FilmPlayer open={filmOpen} onClose={closeFilm} src={filmSrc} />
    </>
  );
}

/* -------------------------------------------------------------------------- */

function AnimatedHero({ onWatchFilm }: { onWatchFilm: () => void }) {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frameTarget = useRef<HTMLDivElement>(null);
  const camFrame = useRef<HTMLDivElement>(null);
  const camVideo = useRef<HTMLVideoElement>(null);
  const clock = useMemo(() => new VideoClock(), []);
  const [posterHidden, setPosterHidden] = useState(false);

  useHeroTimeline({ track, stage, frameTarget, camFrame, camVideo }, true);
  useHeroIntro({ stage, camVideo }, true);

  useEffect(() => {
    const v = camVideo.current!;
    // React doesn't reliably reflect `muted` as an attribute; autoplay needs it.
    v.muted = true;
    // JS fallback for <source media> and Save-Data.
    if (prefersSmallVideo() && !v.currentSrc.includes('720')) {
      v.src = SRC_720;
      v.load();
    }
    void v.play().catch(() => {});
    const onPlaying = () => setPosterHidden(true);
    v.addEventListener('playing', onPlaying);
    if (!v.paused && v.readyState >= 3) setPosterHidden(true);
    clock.attach(v);
    registerFilm(v);
    return () => {
      v.removeEventListener('playing', onPlaying);
      clock.detach();
      registerFilm(null);
    };
  }, [clock]);

  return (
    <section id="hero" ref={track} className="hero-track" aria-label="Introduction">
      <div ref={stage} className="hero-stage" id="top">
        <div ref={frameTarget} className="frame-rect frame-target" aria-hidden />
        <span className="hero-word arm-hidden z-[1]" aria-hidden>
          alaro
        </span>
        <MomentTiles className="arm-hidden z-[2]" />
        <PhoneBody className="arm-hidden z-[5]" />

        <div ref={camFrame} className="cam-frame">
          <div className={`cam-media ${posterHidden ? 'poster-hidden' : ''}`} style={{ backgroundImage: `url(${POSTER})` }}>
            <video
              ref={camVideo}
              className="cam-video intro-hide"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={POSTER}
              aria-hidden="true"
            >
              <source src={SRC_720} type="video/mp4" media="(max-width: 767px)" />
              <source src={SRC_1080} type="video/mp4" />
            </video>
          </div>
          <div className="film-grain" aria-hidden />
          <div className="hero-gradient" />
        </div>

        <CameraHUD clock={clock} className="arm-hidden z-20" />
        <HeroCopy onWatchFilm={onWatchFilm} className="absolute inset-0 z-30" />
        <PreviewCopy className="arm-hidden z-30" />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/** prefers-reduced-motion: static colour hero, then the phone preview as its own section. */
function StaticHero({ onWatchFilm }: { onWatchFilm: () => void }) {
  const clock = useMemo(() => new VideoClock(), []);
  return (
    <>
      <section id="hero" data-header-theme="dark" className="relative h-[100svh] overflow-hidden bg-black" aria-label="Introduction">
        <span id="top" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={POSTER} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-gradient" />
        <HeroCopy onWatchFilm={onWatchFilm} className="absolute inset-0" />
      </section>

      <section className="hero-geo relative h-[100svh] min-h-[700px] overflow-hidden bg-paper" aria-label="The Alaro app">
        <span className="hero-word" aria-hidden>
          alaro
        </span>
        <MomentTiles video={false} />
        <PhoneBody />
        <div className="frame-rect z-10 overflow-hidden bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={POSTER} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <CameraHUD clock={clock} live={false} className="z-20" />
        <PreviewCopy className="z-30" />
      </section>
    </>
  );
}
