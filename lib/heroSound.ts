/**
 * Sound for the hero film: an ambient music loop and a one-time voiceover story timed to the film's scenes.
 * Off by default; the header's sound toggle turns it on and off.
 *
 * Plays through Web Audio rather than <audio>: MP3 frames pad the ends, so an <audio loop> clicks and drifts,
 * while a buffer source loops on the exact film length. Gain nodes also give fades and ducking on iOS, where
 * media-element volume is fixed.
 */

const LOOP = 15.28; // the hero film's length in seconds
const MUSIC = '/media/audio/hero-music.mp3';
const VOICE = '/media/audio/hero-voice.mp3';
const DUCK = 0.5; // music level while the voice speaks

type Listener = (on: boolean) => void;
const listeners = new Set<Listener>();
let on = false;

let ctx: AudioContext | null = null;
let master: GainNode;
let musicGain: GainNode;
let buffers: Promise<{ music: AudioBuffer; voice: AudioBuffer } | null> | null = null;
let musicSrc: AudioBufferSourceNode | null = null;
let voiceSrc: AudioBufferSourceNode | null = null;
let voiceDone = false;
let film: HTMLVideoElement | null = null;
let stopTimer = 0;

export function isSoundOn() {
  return on;
}

export function subscribeSound(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/** The hero registers its film so the music and voice line up with its scenes (null for the static hero). */
export function registerFilm(video: HTMLVideoElement | null) {
  film = video;
}

/** Call from a click handler: browsers only allow audio to start inside a user gesture. */
export function toggleSound() {
  on = !on;
  if (on) start();
  else stop();
  listeners.forEach((l) => l(on));
}

function load() {
  if (!buffers) {
    const get = (url: string) =>
      fetch(url)
        .then((r) => r.arrayBuffer())
        .then((b) => ctx!.decodeAudioData(b));
    buffers = Promise.all([get(MUSIC), get(VOICE)])
      .then(([music, voice]) => ({ music, voice }))
      .catch(() => null);
  }
  return buffers;
}

function start() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.connect(master);
    document.addEventListener('visibilitychange', () => {
      if (!ctx) return;
      if (document.hidden) void ctx.suspend();
      else if (on) void ctx.resume();
    });
  }
  window.clearTimeout(stopTimer);
  void ctx.resume();
  void load().then((b) => {
    if (!b || !on || !ctx) return;
    const now = ctx.currentTime;
    // the story starts with the film: turning sound on before it has been heard restarts the film
    if (!voiceDone && !voiceSrc && film) film.currentTime = 0;
    // where the film is now, so the music's bars and the voice's lines fall on its scenes
    const t = film && !Number.isNaN(film.currentTime) ? film.currentTime % LOOP : 0;

    if (!musicSrc) {
      musicSrc = ctx.createBufferSource();
      musicSrc.buffer = b.music;
      musicSrc.loop = true;
      musicSrc.loopStart = 0;
      musicSrc.loopEnd = Math.min(LOOP, b.music.duration);
      musicSrc.connect(musicGain);
      musicSrc.start(now, t);
    }

    if (!voiceDone && !voiceSrc) {
      // join the story at the start of the film's next loop (or now, if the film has only just begun)
      const delay = t < 0.8 ? 0 : LOOP - t;
      const offset = t < 0.8 ? t : 0;
      const at = now + delay;
      voiceSrc = ctx.createBufferSource();
      voiceSrc.buffer = b.voice;
      voiceSrc.connect(master);
      voiceSrc.onended = () => {
        if (on) voiceDone = true;
        voiceSrc = null;
      };
      voiceSrc.start(at, offset);
      musicGain.gain.cancelScheduledValues(now);
      musicGain.gain.setValueAtTime(musicGain.gain.value, now);
      musicGain.gain.setTargetAtTime(DUCK, Math.max(now, at - 0.4), 0.3);
      musicGain.gain.setTargetAtTime(1, at + b.voice.duration - offset - 1.2, 0.8);
    }

    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(1, now + 1.2);
  });
}

function stop() {
  if (!ctx) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0, now + 0.45);
  stopTimer = window.setTimeout(() => {
    musicSrc?.stop();
    musicSrc = null;
    // a story cut off part-way starts again next time; one that finished stays finished
    if (voiceSrc) {
      voiceSrc.onended = null;
      voiceSrc.stop();
      voiceSrc = null;
    }
    musicGain.gain.cancelScheduledValues(ctx!.currentTime);
    musicGain.gain.value = 1;
    void ctx!.suspend();
  }, 500);
}
