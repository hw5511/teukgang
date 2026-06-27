import type { FC } from "react";
import { Avatar } from "../components/Avatar";
import { fit, singleComparePositions } from "../math";
import { smallMathText, svgStage } from "../styles";

export const SingleCompareScene: FC<{
  frame: number;
  duration: number;
  accent: string;
}> = ({ frame, duration, accent }) => {
  const center = singleComparePositions[0];
  const lineCount = Math.floor(fit(frame, [10, duration - 26], [0, 22]));

  return (
    <svg viewBox="0 0 900 760" style={svgStage}>
      {singleComparePositions.slice(1).map((pos, index) => (
        <line
          key={index}
          x1={center.x}
          y1={center.y}
          x2={pos.x}
          y2={pos.y}
          stroke={accent}
          strokeWidth="5"
          strokeLinecap="round"
          opacity={index <= lineCount ? 0.44 : 0.04}
        />
      ))}
      {singleComparePositions.map((pos, index) => (
        <Avatar
          key={index}
          x={pos.x}
          y={pos.y}
          r={index === 0 ? 42 : 22}
          accent={accent}
          active={index === 0}
          dim={index !== 0 && index > lineCount + 1}
        />
      ))}
      <text
        x="450"
        y="633"
        textAnchor="middle"
        style={{ ...smallMathText, fill: accent }}
        opacity={fit(frame, [duration * 0.5, duration - 16], [0, 1])}
      >
        1 x 22
      </text>
    </svg>
  );
};
