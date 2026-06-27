import type { FC } from "react";
import { Avatar } from "../components/Avatar";
import { avatarPositions, fit, pairs } from "../math";
import { largeNumber, svgStage } from "../styles";

export const PairCountScene: FC<{ frame: number; duration: number; accent: string }> = ({
  frame,
  duration,
  accent,
}) => {
  const pairLimit = Math.floor(fit(frame, [0, duration * 0.56], [0, pairs.length]));
  const count = Math.floor(fit(frame, [16, duration - 18], [0, 253]));
  const glow = 0.5 + Math.sin(frame / 6) * 0.5;

  return (
    <svg viewBox="0 0 900 760" style={svgStage}>
      {pairs.slice(0, pairLimit).map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={avatarPositions[a].x}
          y1={avatarPositions[a].y}
          x2={avatarPositions[b].x}
          y2={avatarPositions[b].y}
          stroke="#334155"
          strokeWidth="2"
          opacity="0.08"
        />
      ))}
      {avatarPositions.map((pos, index) => (
        <Avatar key={index} x={pos.x} y={pos.y} r={20} accent={accent} dim />
      ))}
      <circle
        cx="450"
        cy="340"
        r={120 + glow * 12}
        fill={accent}
        opacity="0.12"
      />
      <text x="450" y="368" textAnchor="middle" style={{ ...largeNumber, fill: accent }}>
        {count}
      </text>
    </svg>
  );
};
