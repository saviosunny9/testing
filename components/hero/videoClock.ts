import { sceneAt, VIDEO_DURATION } from './scenes';

type FrameListener = (time: number, duration: number) => void;
type SceneListener = (index: number) => void;

type VideoWithRVFC = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: (now: number, meta: { mediaTime: number }) => void) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

/**
 * Follows a looping <video>'s playhead and reports scene changes (§1.1).
 * Uses requestVideoFrameCallback where available, falling back to rAF.
 */
export class VideoClock {
  private video: VideoWithRVFC | null = null;
  private frameListeners = new Set<FrameListener>();
  private sceneListeners = new Set<SceneListener>();
  private handle = 0;
  private usingRVFC = false;
  private running = false;
  scene = 0;
  time = 0;

  attach(video: HTMLVideoElement) {
    this.detach();
    this.video = video as VideoWithRVFC;
    this.usingRVFC = typeof this.video.requestVideoFrameCallback === 'function';
    this.running = true;
    this.schedule();
  }

  detach() {
    this.running = false;
    if (!this.video) return;
    if (this.usingRVFC) this.video.cancelVideoFrameCallback?.(this.handle);
    else cancelAnimationFrame(this.handle);
    this.video = null;
  }

  /** Pretend the video sits at `time` (used by static/reduced-motion previews). */
  seek(time: number) {
    this.update(time);
  }

  onFrame(l: FrameListener) {
    this.frameListeners.add(l);
    l(this.time, this.duration());
    return () => {
      this.frameListeners.delete(l);
    };
  }

  onScene(l: SceneListener) {
    this.sceneListeners.add(l);
    l(this.scene);
    return () => {
      this.sceneListeners.delete(l);
    };
  }

  private duration() {
    const d = this.video?.duration;
    return d && Number.isFinite(d) ? d : VIDEO_DURATION;
  }

  private schedule() {
    if (!this.running || !this.video) return;
    const v = this.video;
    if (this.usingRVFC) {
      this.handle = v.requestVideoFrameCallback!((_, meta) => {
        this.update(meta.mediaTime);
        this.schedule();
      });
    } else {
      this.handle = requestAnimationFrame(() => {
        this.update(v.currentTime);
        this.schedule();
      });
    }
  }

  private update(time: number) {
    this.time = time;
    const d = this.duration();
    this.frameListeners.forEach((l) => l(time, d));
    const s = sceneAt(time);
    if (s !== this.scene) {
      this.scene = s;
      this.sceneListeners.forEach((l) => l(s));
    }
  }
}
