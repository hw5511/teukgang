export type SceneType = "image" | "graphics";

export type TransitionType = "cut" | "fade" | "slide";

export type SubtitleChunk = {
  text: string;
  startSeconds: number;
  endSeconds: number;
};

export type StoryboardCanvas = {
  width: number;
  height: number;
  fps: number;
};

export type Storyboard = {
  projectName: string;
  voiceId?: string;
  language?: string;
  canvas: StoryboardCanvas;
  scenes: Scene[];
};

export type Scene = {
  id: string;
  type: SceneType;
  durationFrames?: number;
  durationSeconds?: number;
  headline: string;
  caption?: string;
  narration?: string;
  imagePrompt?: string;
  subtitleChunks?: SubtitleChunk[];
  audio?: {
    enabled?: boolean;
    source?: string;
  };
  image?: {
    enabled?: boolean;
    source?: string;
    fit?: "cover" | "contain";
  };
  sfx?: {
    enabled?: boolean;
    source?: string;
  };
  transition?: {
    in?: TransitionType;
    out?: TransitionType;
  };
  graphics?: {
    metricLabel?: string;
    metricValue?: number;
    bars?: number[];
    line?: number[];
  };
};
