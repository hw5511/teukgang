import React from "react";
import { Composition } from "remotion";
import { ImageDancingPlagueShort } from "./compositions/ImageDancingPlagueShort";
import { GraphicsCycloidShort } from "./compositions/GraphicsCycloidShort";
import { StoryboardComposition } from "./compositions/StoryboardComposition";
import { filterScenesByType, getStoryboardDurationFrames } from "./lib/storyboard";
import { sampleStoryboard } from "./storyboards/sampleStoryboard";
import graphicsCycloidStoryboardJson from "../storyboards/graphics-cycloid.storyboard.json";
import imageDancingPlagueStoryboardJson from "../storyboards/image-dancing-plague.storyboard.json";
import type { Storyboard } from "./types/storyboard";

const scenes = sampleStoryboard.scenes;
const graphicsCycloidStoryboard = graphicsCycloidStoryboardJson as Storyboard;
const imageDancingPlagueStoryboard = imageDancingPlagueStoryboardJson as Storyboard;

export const Root: React.FC = () => {
  const imageScenes = filterScenesByType(sampleStoryboard, "image");
  const graphicsScenes = filterScenesByType(sampleStoryboard, "graphics");
  const sampleDuration = getStoryboardDurationFrames(scenes, sampleStoryboard.canvas.fps);
  const imageDancingPlagueScenes = imageDancingPlagueStoryboard.scenes;

  return (
    <>
      <Composition
        id="SampleShort"
        component={StoryboardComposition}
        durationInFrames={sampleDuration}
        fps={sampleStoryboard.canvas.fps}
        width={sampleStoryboard.canvas.width}
        height={sampleStoryboard.canvas.height}
        defaultProps={{
          storyboard: sampleStoryboard,
          scenes,
        }}
      />
      <Composition
        id="ImageOnlyPreview"
        component={StoryboardComposition}
        durationInFrames={getStoryboardDurationFrames(imageScenes, sampleStoryboard.canvas.fps)}
        fps={sampleStoryboard.canvas.fps}
        width={sampleStoryboard.canvas.width}
        height={sampleStoryboard.canvas.height}
        defaultProps={{
          storyboard: sampleStoryboard,
          scenes: imageScenes,
        }}
      />
      <Composition
        id="GraphicsOnlyPreview"
        component={StoryboardComposition}
        durationInFrames={getStoryboardDurationFrames(graphicsScenes, sampleStoryboard.canvas.fps)}
        fps={sampleStoryboard.canvas.fps}
        width={sampleStoryboard.canvas.width}
        height={sampleStoryboard.canvas.height}
        defaultProps={{
          storyboard: sampleStoryboard,
          scenes: graphicsScenes,
        }}
      />
      <Composition
        id="ImageDancingPlagueShort"
        component={ImageDancingPlagueShort}
        durationInFrames={getStoryboardDurationFrames(
          imageDancingPlagueScenes,
          imageDancingPlagueStoryboard.canvas.fps,
        )}
        fps={imageDancingPlagueStoryboard.canvas.fps}
        width={imageDancingPlagueStoryboard.canvas.width}
        height={imageDancingPlagueStoryboard.canvas.height}
        defaultProps={{
          storyboard: imageDancingPlagueStoryboard,
          scenes: imageDancingPlagueScenes,
        }}
      />
      <Composition
        id="GraphicsCycloidShort"
        component={GraphicsCycloidShort}
        durationInFrames={getStoryboardDurationFrames(
          graphicsCycloidStoryboard.scenes,
          graphicsCycloidStoryboard.canvas.fps,
        )}
        fps={graphicsCycloidStoryboard.canvas.fps}
        width={graphicsCycloidStoryboard.canvas.width}
        height={graphicsCycloidStoryboard.canvas.height}
        defaultProps={{
          storyboard: graphicsCycloidStoryboard,
          scenes: graphicsCycloidStoryboard.scenes,
        }}
      />
    </>
  );
};
