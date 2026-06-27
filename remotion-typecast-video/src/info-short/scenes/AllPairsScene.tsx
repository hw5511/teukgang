import type { FC } from "react";
import { Avatar } from "../components/Avatar";
import { avatarPositions, fit, pairs } from "../math";
import { svgStage } from "../styles";

export const AllPairsScene: FC<{ frame: number; duration: number; accent: string }> = ({
  frame,
  duration,
  accent,
}) => {
  const pairLimit = Math.floor(fit(frame, [0, duration * 0.76], [0, pairs.length]));

  return (
    <svg viewBox="0 0 900 760" style={svgStage}>
      {pairs.slice(0, pairLimit).map(([a, b], index) => (
        <line
          key={`${a}-${b}`}
          x1={avatarPositions[a].x}
          y1={avatarPositions[a].y}
          x2={avatarPositions[b].x}
          y2={avatarPositions[b].y}
          stroke={index % 3 === 0 ? accent : "#334155"}
          strokeWidth="2.2"
          opacity={0.12}
        />
      ))}
      {avatarPositions.map((pos, index) => (
        <Avatar key={index} x={pos.x} y={pos.y} r={22} accent={accent} />
      ))}
    </svg>
  );
};
