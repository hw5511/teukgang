import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import type { Scene, Storyboard } from "../types/storyboard";
import { getSceneDurationFrames } from "../lib/storyboard";
import { GraphicsScene } from "../components/scenes/GraphicsScene";
import { ImageScene } from "../components/scenes/ImageScene";

export type StoryboardCompositionProps = {
  storyboard: Storyboard;
  scenes: Scene[];
};

export const StoryboardComposition: React.FC<StoryboardCompositionProps> = ({ storyboard, scenes }) => {
  let startFrame = 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#020617",
      }}
    >
      {scenes.map((scene) => {
        const duration = getSceneDurationFrames(scene, storyboard.canvas.fps);
        const audioSource = scene.audio?.enabled ? scene.audio.source : undefined;
        const sfxSource = scene.sfx?.enabled ? scene.sfx.source : undefined;

        const sequence = (
          <Sequence key={scene.id} from={startFrame} durationInFrames={duration}>
            <>
              {scene.type === "graphics" ? <GraphicsScene scene={scene} /> : <ImageScene scene={scene} />}
              {audioSource ? <Audio src={staticFile(audioSource)} /> : null}
              {sfxSource ? <Audio src={staticFile(sfxSource)} volume={0.7} /> : null}
            </>
          </Sequence>
        );

        startFrame += duration;
        return sequence;
      })}
    </AbsoluteFill>
  );
};
