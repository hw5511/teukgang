import type { FC } from "react";
import { Avatar } from "../components/Avatar";
import { fit } from "../math";
import { formulaText, smallMathText, svgStage } from "../styles";

export const FormulaScene: FC<{ frame: number; duration: number; accent: string }> = ({
  frame,
  duration,
  accent,
}) => {
  const fractions = [
    ["365", "365"],
    ["364", "365"],
    ["363", "365"],
  ];
  const positions = [174, 450, 726];
  const visible = Math.ceil(fit(frame, [0, duration - 28], [1, fractions.length]));

  return (
    <svg viewBox="0 0 900 760" style={svgStage}>
      <path
        d="M 100 440 H 800"
        stroke="#94a3b8"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.26"
      />
      {fractions.map(([top, bottom], index) => {
        const x = positions[index];
        const isVisible = index < visible;

        return (
          <g
            key={`${top}/${bottom}`}
            transform={`translate(${x} 238)`}
            opacity={isVisible ? fit(frame - index * 9, [0, 7], [0, 1]) : 0}
          >
            <text x="0" y="0" textAnchor="middle" style={{ ...formulaText, fontSize: 58 }}>
              {top}
            </text>
            <line
              x1="-74"
              y1="24"
              x2="74"
              y2="24"
              stroke="#0f172a"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <text x="0" y="84" textAnchor="middle" style={{ ...formulaText, fontSize: 58 }}>
              {bottom}
            </text>
            <Avatar
              x={0}
              y={190}
              r={36}
              accent={accent}
              active={index === 0}
              dim={index > 0}
            />
            {index < fractions.length - 1 && (
              <text
                x="138"
                y="46"
                textAnchor="middle"
                style={{ ...formulaText, fontSize: 66, fill: accent }}
              >
                x
              </text>
            )}
          </g>
        );
      })}
      <text
        x="840"
        y="284"
        textAnchor="middle"
        style={{ ...formulaText, fontSize: 70 }}
        opacity={fit(frame, [duration - 42, duration - 24], [0, 1])}
      >
        ...
      </text>
      <text
        x="450"
        y="642"
        textAnchor="middle"
        style={{ ...smallMathText, fontSize: 82, fill: accent }}
        opacity={fit(frame, [duration - 36, duration - 10], [0, 1])}
      >
        365 x 364 x 363 ...
      </text>
    </svg>
  );
};
