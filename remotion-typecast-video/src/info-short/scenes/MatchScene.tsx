import type { FC } from "react";
import { Avatar } from "../components/Avatar";
import { avatarPositions, fit } from "../math";
import { dateText, largeNumber, svgStage } from "../styles";

export const MatchScene: FC<{ frame: number; duration: number; accent: string }> = ({
  frame,
  duration,
  accent,
}) => {
  const lineOpacity = fit(frame, [8, 22], [0, 1]);
  const a = avatarPositions[4];
  const b = avatarPositions[17];

  return (
    <svg viewBox="0 0 900 760" style={svgStage}>
      <line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={accent}
        strokeWidth="10"
        strokeLinecap="round"
        opacity={lineOpacity * 0.48}
      />
      {avatarPositions.map((pos, index) => {
        const active = index === 4 || index === 17;

        return (
          <Avatar
            key={index}
            x={pos.x}
            y={pos.y}
            accent={accent}
            active={active}
            dim={!active}
            r={active ? 32 : 22}
          />
        );
      })}
      {[a, b].map((pos, index) => (
        <g
          key={index}
          transform={`translate(${pos.x + (index === 0 ? 22 : -22)} ${pos.y - 88})`}
          opacity={fit(frame, [12 + index * 5, 24 + index * 5], [0, 1])}
        >
          <text
            textAnchor="middle"
            style={dateText}
            fill="#f7f6ef"
            stroke="#f7f6ef"
            strokeWidth="16"
            strokeLinejoin="round"
          >
            7.12
          </text>
          <text textAnchor="middle" style={dateText} fill="#0f172a">
            7.12
          </text>
        </g>
      ))}
      <text
        x="450"
        y="402"
        textAnchor="middle"
        style={{ ...largeNumber, fontSize: 160, fill: accent }}
        opacity={fit(frame, [duration * 0.34, duration * 0.54], [0, 1])}
      >
        50%+
      </text>
    </svg>
  );
};
