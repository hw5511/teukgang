import type { FC } from "react";
import { CalendarGrid } from "../components/CalendarGrid";
import { fit } from "../math";
import { formulaText, svgStage } from "../styles";

export const ReverseScene: FC<{ frame: number; duration: number; accent: string }> = ({
  frame,
  duration,
  accent,
}) => {
  const cross = fit(frame, [16, 38], [0, 1]);
  const pathReveal = fit(frame, [30, duration - 12], [0, 1]);

  return (
    <svg viewBox="0 0 900 760" style={svgStage}>
      <g opacity={fit(frame, [0, 18], [0, 1]) * fit(frame, [36, 58], [1, 0.22])}>
        <CalendarGrid accent="#dc2626" reveal={1} duplicate dots />
        <line
          x1="248"
          y1="172"
          x2={248 + 228 * cross}
          y2={172 + 228 * cross}
          stroke="#dc2626"
          strokeWidth="18"
          strokeLinecap="round"
          opacity="0.82"
        />
        <line
          x1="476"
          y1="172"
          x2={476 - 228 * cross}
          y2={172 + 228 * cross}
          stroke="#dc2626"
          strokeWidth="18"
          strokeLinecap="round"
          opacity="0.82"
        />
      </g>
      <g opacity={pathReveal}>
        <path
          d="M 122 586 C 260 478, 344 430, 450 430 C 558 430, 638 478, 778 586"
          fill="none"
          stroke={accent}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${pathReveal * 760} 760`}
        />
        {Array.from({ length: 9 }).map((_, index) => (
          <circle
            key={index}
            cx={162 + index * 74}
            cy={588 - Math.sin(index / 8) * 126}
            r="14"
            fill={accent}
            opacity={0.34 + index * 0.04}
          />
        ))}
        <text x="450" y="350" textAnchor="middle" style={formulaText}>
          P(no match)
        </text>
      </g>
    </svg>
  );
};
