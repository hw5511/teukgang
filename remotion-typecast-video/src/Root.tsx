import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { InfoShort, infoShortDuration } from "./InfoShort";
import { fps, totalFrames } from "./data/timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={totalFrames}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="InfoShort"
        component={InfoShort}
        durationInFrames={infoShortDuration}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
