import rawStoryboard from "./storyboard.json";
import type { Scene, Storyboard } from "./types";

export const storyboard = rawStoryboard as Storyboard;

export const scenes: Scene[] = storyboard.scenes.map((scene) => ({
  scene: scene.scene,
  time: scene.time,
  script: scene.scriptLines.join(" "),
  scriptLines: scene.scriptLines,
  captionChunks: scene.captionChunks,
  sceneDescription: scene.sceneDescription,
  duration: scene.durationFrames,
  accent: scene.accent,
  kind: scene.visualKey,
  audio: `audio/info-short/scene-${String(scene.scene).padStart(2, "0")}.wav`,
}));

export const sceneStarts = scenes.reduce<number[]>((starts, scene, index) => {
  starts.push(index === 0 ? 0 : starts[index - 1] + scenes[index - 1].duration);
  return starts;
}, []);

export const infoShortDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
