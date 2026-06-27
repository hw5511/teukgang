import type { FC } from "react";
import type { Scene } from "../types";
import { visualWrap } from "../styles";
import { AllPairsScene } from "./AllPairsScene";
import { ArrivalScene } from "./ArrivalScene";
import { CalendarScene } from "./CalendarScene";
import { FormulaScene } from "./FormulaScene";
import { MatchScene } from "./MatchScene";
import { PairCountScene } from "./PairCountScene";
import { RandomDotsScene } from "./RandomDotsScene";
import { ResultScene } from "./ResultScene";
import { ReverseScene } from "./ReverseScene";
import { SingleCompareScene } from "./SingleCompareScene";

export const Visual: FC<{
  scene: Scene;
  localFrame: number;
}> = ({ scene, localFrame }) => {
  let content: React.ReactNode = null;

  switch (scene.kind) {
    case "arrival":
      content = (
        <ArrivalScene frame={localFrame} duration={scene.duration} accent={scene.accent} />
      );
      break;
    case "match":
      content = (
        <MatchScene frame={localFrame} duration={scene.duration} accent={scene.accent} />
      );
      break;
    case "calendar":
      content = (
        <CalendarScene frame={localFrame} duration={scene.duration} accent={scene.accent} />
      );
      break;
    case "singleCompare":
      content = (
        <SingleCompareScene
          frame={localFrame}
          duration={scene.duration}
          accent={scene.accent}
        />
      );
      break;
    case "allPairs":
      content = (
        <AllPairsScene frame={localFrame} duration={scene.duration} accent={scene.accent} />
      );
      break;
    case "pairCount":
      content = (
        <PairCountScene frame={localFrame} duration={scene.duration} accent={scene.accent} />
      );
      break;
    case "randomDots":
      content = (
        <RandomDotsScene frame={localFrame} duration={scene.duration} accent={scene.accent} />
      );
      break;
    case "reverse":
      content = (
        <ReverseScene frame={localFrame} duration={scene.duration} accent={scene.accent} />
      );
      break;
    case "formula":
      content = (
        <FormulaScene frame={localFrame} duration={scene.duration} accent={scene.accent} />
      );
      break;
    case "result":
      content = (
        <ResultScene frame={localFrame} duration={scene.duration} accent={scene.accent} />
      );
      break;
  }

  return <div style={visualWrap}>{content}</div>;
};
