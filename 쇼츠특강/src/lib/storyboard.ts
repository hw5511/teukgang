import type { Scene, SceneType, Storyboard } from "../types/storyboard";

export const DEFAULT_FPS = 30;

export const getSceneDurationFrames = (scene: Scene, fps = DEFAULT_FPS) => {
  if (typeof scene.durationFrames === "number") {
    return scene.durationFrames;
  }

  if (typeof scene.durationSeconds === "number") {
    return Math.round(scene.durationSeconds * fps);
  }

  return fps * 4;
};

export const getStoryboardDurationFrames = (scenes: Scene[], fps = DEFAULT_FPS) =>
  scenes.reduce((total, scene) => total + getSceneDurationFrames(scene, fps), 0);

export const filterScenesByType = (storyboard: Storyboard, type: SceneType) =>
  storyboard.scenes.filter((scene) => scene.type === type);

export const makeSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
