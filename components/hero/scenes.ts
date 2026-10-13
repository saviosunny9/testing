/**
 * Scene map for /public/media/hero-*.mp4 (§1.1) and detection boxes (§6.4).
 * Box values are percentages of the 16:9 frame.
 */
export type SceneType = 'person' | 'pet' | 'motion';

export type Scene = {
  start: number;
  end: number;
  cam: string;
  label: string;
  type: SceneType;
  box: { x: number; y: number; w: number; h: number };
};

export const SCENES: readonly Scene[] = [
  { start: 0.0, end: 2.8, cam: 'Living Room · Cam 01', label: 'Kids · Playing', type: 'person', box: { x: 30, y: 8, w: 52, h: 84 } },
  { start: 2.8, end: 4.8, cam: 'Family Room · Cam 02', label: 'Child · Game night', type: 'person', box: { x: 40, y: 42, w: 22, h: 46 } },
  { start: 4.8, end: 7.2, cam: 'Dining · Cam 03', label: 'Grandpa · Moment saved', type: 'person', box: { x: 54, y: 27, w: 42, h: 68 } },
  { start: 7.2, end: 9.68, cam: 'Bedroom · Cam 04', label: 'Child · Story time', type: 'person', box: { x: 33, y: 20, w: 29, h: 72 } },
  { start: 9.68, end: 13.12, cam: 'Kitchen · Cam 05', label: 'Child · Motion', type: 'motion', box: { x: 30, y: 6, w: 50, h: 88 } },
  { start: 13.12, end: 15.28, cam: 'Living Room · Cam 01', label: 'Pet · Milo', type: 'pet', box: { x: 49, y: 35, w: 24, h: 43 } },
];

/** Scene index that triggers the "★ Moment saved" toast. */
export const MOMENT_SAVED_SCENE = 2;

export const VIDEO_DURATION = 15.28;

export const SCENE_COLORS: Record<SceneType, string> = {
  person: 'var(--leaf)',
  pet: 'var(--peach)',
  motion: 'var(--apricot)',
};

export function sceneAt(time: number): number {
  for (let i = SCENES.length - 1; i >= 0; i--) {
    if (time >= SCENES[i].start) return i;
  }
  return 0;
}
