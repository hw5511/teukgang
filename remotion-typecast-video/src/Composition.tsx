import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { napoleonScenes } from "./data/napoleon-scenes";
import { sceneTimeline } from "./data/timeline";

const SceneCard: React.FC<{
  sceneIndex: number;
  durationInFrames: number;
}> = ({ sceneIndex, durationInFrames }) => {
  const frame = useCurrentFrame();
  const scene = napoleonScenes[sceneIndex];
  const imageScale = interpolate(frame, [0, durationInFrames], [1.04, 1.14]);
  const imageY = interpolate(frame, [0, durationInFrames], [0, -36]);
  const narrationFrames =
    (sceneTimeline[sceneIndex].durationSeconds /
      sceneTimeline[sceneIndex].playbackRate) *
    30;
  const captionIndex = Math.min(
    scene.timedCaptions.length - 1,
    Math.max(
      0,
      Math.floor((frame / narrationFrames) * scene.timedCaptions.length),
    ),
  );
  const captionFrameLength = narrationFrames / scene.timedCaptions.length;
  const captionLocalFrame = frame % captionFrameLength;
  const captionOpacity = Math.min(
    interpolate(captionLocalFrame, [0, 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    interpolate(captionLocalFrame, [captionFrameLength - 8, captionFrameLength], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const captionLift = interpolate(captionLocalFrame, [0, 10], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f8eedc",
        opacity: fadeIn * fadeOut,
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile(scene.image)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translateY(${imageY}px) scale(${imageScale})`,
          filter: "saturate(1.03) contrast(1.02)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(22, 24, 29, 0.18) 0%, rgba(22, 24, 29, 0.03) 35%, rgba(22, 24, 29, 0.2) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 135,
          left: 70,
          right: 70,
          color: "white",
          fontFamily:
            "Pretendard, Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: 70,
          fontWeight: 900,
          lineHeight: 1.18,
          textAlign: "center",
          textShadow:
            "0 5px 0 rgba(0,0,0,0.42), 0 12px 28px rgba(0,0,0,0.36)",
          WebkitTextStroke: "2px rgba(40, 32, 25, 0.42)",
          opacity: captionOpacity,
          transform: `translateY(${captionLift}px)`,
        }}
      >
        {scene.timedCaptions[captionIndex]}
      </div>
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#f8eedc" }}>
      {sceneTimeline.map((timing, index) => (
        <Sequence
          key={timing.audio}
          from={timing.from}
          durationInFrames={timing.durationInFrames}
        >
          <SceneCard
            sceneIndex={index}
            durationInFrames={timing.durationInFrames}
          />
          <Audio
            src={staticFile(timing.audio)}
            playbackRate={timing.playbackRate}
            volume={1}
          />
          <Audio
            src={staticFile(index % 2 === 0 ? "sfx/pop.wav" : "sfx/hop.wav")}
            volume={0.12}
          />
        </Sequence>
      ))}
      {sceneTimeline.slice(1).map((timing) => (
        <Sequence key={`whoosh-${timing.from}`} from={timing.from - 8}>
          <Audio src={staticFile("sfx/whoosh.wav")} volume={0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
