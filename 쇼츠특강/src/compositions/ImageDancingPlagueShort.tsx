import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Scene, Storyboard, SubtitleChunk } from "../types/storyboard";
import { getSceneDurationFrames } from "../lib/storyboard";

export type ImageDancingPlagueShortProps = {
  storyboard: Storyboard;
  scenes: Scene[];
};

const getActiveSubtitleChunk = (chunks: SubtitleChunk[] | undefined, timeSeconds: number) => {
  if (!chunks?.length) {
    return undefined;
  }

  const active = chunks.find((chunk) => timeSeconds >= chunk.startSeconds && timeSeconds < chunk.endSeconds);
  return active ?? chunks[chunks.length - 1];
};

const SceneFrame: React.FC<{ scene: Scene; fps: number }> = ({ scene, fps }) => {
  const frame = useCurrentFrame();
  const durationFrames = getSceneDurationFrames(scene, fps);
  const progress = durationFrames > 0 ? frame / durationFrames : 0;
  const fadeIn = interpolate(frame, [0, fps * 0.25], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationFrames - fps * 0.35, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textSpring = spring({ frame, fps, config: { damping: 18, stiffness: 140 } });
  const imageScale = interpolate(progress, [0, 1], [1.08, 1.02]);
  const panX = interpolate(progress, [0, 1], [-24, 18]);
  const panY = interpolate(progress, [0, 1], [10, -12]);
  const activeChunk = getActiveSubtitleChunk(scene.subtitleChunks, frame / fps);
  const text = activeChunk?.text ?? scene.headline;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#020617" }}>
      {scene.image?.enabled && scene.image.source ? (
        <Img
          src={staticFile(scene.image.source)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: scene.image.fit ?? "cover",
            transform: `scale(${imageScale}) translate3d(${panX}px, ${panY}px, 0)`,
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(2,6,23,0.62) 0%, rgba(2,6,23,0.08) 22%, rgba(2,6,23,0.02) 55%, rgba(2,6,23,0.46) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          padding: "8.2% 6.5% 8%",
          justifyContent: "flex-start",
          color: "#f8fafc",
          opacity: fadeIn * fadeOut,
        }}
      >
        <div
          style={{
            maxWidth: "86%",
            fontSize: 60,
            lineHeight: 1.12,
            fontWeight: 800,
            letterSpacing: -1.2,
            textShadow: "0 4px 18px rgba(2,6,23,0.75)",
            transform: `translateY(${(1 - textSpring) * 16}px) scale(${0.98 + textSpring * 0.02})`,
            transformOrigin: "left top",
            whiteSpace: "pre-wrap",
            wordBreak: "keep-all",
          }}
        >
          {text}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ImageDancingPlagueShort: React.FC<ImageDancingPlagueShortProps> = ({ storyboard, scenes }) => {
  let startFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#020617" }}>
      {scenes.map((scene) => {
        const duration = getSceneDurationFrames(scene, storyboard.canvas.fps);
        const audioSource = scene.audio?.enabled ? scene.audio.source : undefined;

        const sequence = (
          <Sequence key={scene.id} from={startFrame} durationInFrames={duration}>
            <>
              <SceneFrame scene={scene} fps={storyboard.canvas.fps} />
              {audioSource ? <Audio src={staticFile(audioSource)} /> : null}
            </>
          </Sequence>
        );

        startFrame += duration;
        return sequence;
      })}
    </AbsoluteFill>
  );
};
