export type SceneKind =
  | "arrival"
  | "match"
  | "calendar"
  | "singleCompare"
  | "allPairs"
  | "pairCount"
  | "randomDots"
  | "reverse"
  | "formula"
  | "result";

export type Scene = {
  scene: number;
  time: string;
  script: string;
  scriptLines: string[];
  captionChunks: string[];
  sceneDescription: string;
  duration: number;
  accent: string;
  kind: SceneKind;
  audio: string;
};

export type StoryboardScene = {
  scene: number;
  time: string;
  durationFrames: number;
  visualKey: SceneKind;
  accent: string;
  sceneDescription: string;
  scriptLines: string[];
  captionChunks: string[];
};

export type Storyboard = {
  title: string;
  format: {
    width: number;
    height: number;
    fps: number;
    durationSeconds: number;
  };
  captionRule: string;
  scenes: StoryboardScene[];
};
