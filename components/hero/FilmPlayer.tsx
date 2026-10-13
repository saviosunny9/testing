'use client';

import { Pause, Play, RotateCcw, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from '@/lib/gsap';
import { lockScroll, unlockScroll } from '@/lib/lenis';

const fmt = (s: number) => {
  const t = Math.max(0, Math.floor(s || 0));
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
};

/** Fullscreen "Watch the film" player (§4.2). The film has no audio, so it's muted. */
export default function FilmPlayer({ open, onClose, src }: { open: boolean; onClose: () => void; src: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!open) return;
    const root = rootRef.current!;
    const video = videoRef.current!;
    const opener = document.activeElement as HTMLElement | null;
    lockScroll();
    video.currentTime = 0;
    void video.play().catch(() => setPlaying(false));
    gsap.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' });
    gsap.fromTo(video, { scale: 0.96 }, { scale: 1, duration: 0.6, ease: 'expo.out' });
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        if (video.paused) void video.play();
        else video.pause();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      video.pause();
      unlockScroll();
      opener?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const toggle = () => {
    const v = videoRef.current!;
    if (v.paused) void v.play();
    else v.pause();
  };

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Film"
      className="fixed inset-0 z-[80] grid place-items-center bg-[#0b0806] opacity-0"
      data-lenis-prevent
    >
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        src={src}
        muted
        playsInline
        loop
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
      <div className="glass absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full p-1.5 text-white">
        <button
          type="button"
          className="focus-ring grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
          aria-label="Restart"
          onClick={() => {
            const v = videoRef.current!;
            v.currentTime = 0;
            void v.play();
          }}
        >
          <RotateCcw size={18} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          className="focus-ring grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
          aria-label={playing ? 'Pause' : 'Play'}
          onClick={toggle}
        >
          {playing ? <Pause size={18} strokeWidth={1.5} /> : <Play size={18} strokeWidth={1.5} />}
        </button>
        <span className="mono px-3 text-[12px]" aria-live="off">
          {fmt(time)} / {fmt(duration)}
        </span>
        <button
          ref={closeRef}
          type="button"
          className="focus-ring grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
          aria-label="Close film"
          onClick={onClose}
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      </div>
    </div>,
    document.body,
  );
}
