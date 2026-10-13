/**
 * Scene map for /public/media/hero-*.mp4 and detection boxes.
 * Box values are percentages of the 16:9 video frame.
 */
export type SceneType = 'person' | 'pet' | 'motion';

export type Scene = {
  start: number;
  end: number;
  cam: string;
  label: string;
  /** Short line under the room name in the live-view panel. */
  activity: string;
  type: SceneType;
  box: { x: number; y: number; w: number; h: number };
};

export const SCENES: readonly Scene[] = [
  { start: 0.0, end: 2.8, cam: 'Living Room', label: 'Mira', activity: 'Kids playing', type: 'person', box: { x: 30, y: 8, w: 52, h: 84 } },
  { start: 2.8, end: 4.8, cam: 'Family Room', label: 'Arlo', activity: 'Game night', type: 'person', box: { x: 40, y: 42, w: 22, h: 46 } },
  { start: 4.8, end: 7.2, cam: 'Dining Room', label: 'Grandpa', activity: 'Birthday · moment saved', type: 'person', box: { x: 54, y: 27, w: 42, h: 68 } },
  { start: 7.2, end: 9.68, cam: 'Bedroom', label: 'Zoe', activity: 'Story time', type: 'person', box: { x: 33, y: 20, w: 29, h: 72 } },
  { start: 9.68, end: 13.12, cam: 'Kitchen', label: 'Leo', activity: 'Playing with Mum', type: 'motion', box: { x: 30, y: 6, w: 50, h: 88 } },
  { start: 13.12, end: 15.28, cam: 'Living Room', label: 'Milo', activity: 'Milo is up', type: 'pet', box: { x: 49, y: 35, w: 24, h: 43 } },
];

/** Scene index that triggers the "Moment saved" chip. */
export const MOMENT_SAVED_SCENE = 2;

export const VIDEO_DURATION = 15.28;

export function sceneAt(time: number): number {
  for (let i = SCENES.length - 1; i >= 0; i--) {
    if (time >= SCENES[i].start) return i;
  }
  return 0;
}
