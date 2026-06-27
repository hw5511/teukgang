import type { FC } from "react";
import { Avatar } from "../components/Avatar";
import { fit } from "../math";
import { dateText, largeNumber, svgStage } from "../styles";

export const ResultScene: FC<{ frame: number; duration: number; accent: string }> = ({
  frame,
  duration,
  accent,
}) => {
  const progress = fit(frame, [0, duration - 34], [0, 0.507]);
  const barWidth = 620;
  const fillWidth = barWidth * progress;
  const active = progress > 0.5;
  const glow = active ? 0.5 + Math.sin(frame / 5) * 0.5 : 0;

  return (
    <svg viewBox="0 0 900 760" style={svgStage}>
      <line
        x1="140"
        y1="344"
        x2="760"
        y2="344"
        stroke="#cbd5e1"
        strokeWidth="34"
        strokeLinecap="round"
      />
      <line
        x1="140"
        y1="344"
        x2={140 + fillWidth}
        y2="344"
        stroke={accent}
        strokeWidth="34"
        strokeLinecap="round"
      />
      <line
        x1={140 + barWidth * 0.5}
        y1="278"
        x2={140 + barWidth * 0.5}
        y2="416"
        stroke="#0f172a"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.5"
      />
      <text x="450" y="252" textAnchor="middle" style={{ ...largeNumber, fontSize: 128 }}>
        {Math.round(progress * 1000) / 10}%
      </text>
      <g opacity={fit(frame, [duration * 0.44, duration * 0.7], [0, 1])}>
        <circle cx="332" cy="532" r={62 + glow * 12} fill={accent} opacity="0.16" />
        <circle cx="568" cy="532" r={62 + glow * 12} fill={accent} opacity="0.16" />
        <Avatar x={332} y={532} r={42} accent={accent} active />
        <Avatar x={568} y={532} r={42} accent={accent} active />
        <line
          x1="374"
          y1="532"
          x2="526"
          y2="532"
          stroke={accent}
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.62"
        />
        <text x="450" y="602" textAnchor="middle" style={dateText}>
          7.12
        </text>
      </g>
    </svg>
  );
};
