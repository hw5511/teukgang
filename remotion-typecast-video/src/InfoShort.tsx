import type { FC } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Caption } from "./info-short/components/Caption";
import { scenes, sceneStarts, infoShortDuration } from "./info-short/data";
import { fit } from "./info-short/math";
import { Visual } from "./info-short/scenes";
import { gridBackground, stage } from "./info-short/styles";

const InfoScene: FC<{
  index: number;
  localFrame: number;
}> = ({ index, localFrame }) => {
  const scene = scenes[index];
  const opacity =
    fit(localFrame, [0, 7], [0, 1]) *
    fit(localFrame, [scene.duration - 8, scene.duration], [1, 0]);

  return (
    <AbsoluteFill style={{ ...stage, opacity }}>
      <div style={gridBackground} />
      <Visual scene={scene} localFrame={localFrame} />
      <Caption chunks={scene.captionChunks} frame={localFrame} duration={scene.duration} />
    </AbsoluteFill>
  );
};

export const InfoShort: FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#f7f6ef" }}>
      {scenes.map((scene, index) => (
        <Sequence key={scene.kind} from={sceneStarts[index]} durationInFrames={scene.duration}>
          <Audio src={staticFile(scene.audio)} volume={1} />
          <InfoScene index={index} localFrame={frame - sceneStarts[index]} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export { infoShortDuration };
